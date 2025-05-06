
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "npm:stripe@14.21.0";
import { createClient } from "npm:@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Parse request body
    const { userId, returnUrl } = await req.json();

    if (!userId) {
      throw new Error("Missing required parameter: userId");
    }
    
    console.log("Creating checkout session for user:", userId);

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user details
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", userId)
      .single();

    if (userError || !userData) {
      throw new Error(`Error fetching user: ${userError?.message || "User not found"}`);
    }

    // Check if user already has a Stripe customer ID
    const { data: subscriptionData } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .single();

    let customerId = subscriptionData?.stripe_customer_id;
    
    if (!customerId) {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: userData.email,
        name: userData.full_name || undefined,
        metadata: {
          userId: userId,
        },
      });
      customerId = customer.id;
      console.log("Created new customer:", customerId);
    } else {
      console.log("Using existing customer:", customerId);
    }

    // Updated price ID for the subscription
    const priceId = "price_1PdJSxLXVTuI8YtKWg9LuOgt";
    
    // Determine base URL and construct success URL
    const origin = returnUrl ? new URL(returnUrl).origin : (req.headers.get("origin") || "http://localhost:5173");
    const successUrl = `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/welcome?canceled=true`;

    console.log("Success URL:", successUrl);
    console.log("Cancel URL:", cancelUrl);
    
    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      subscription_data: {
        trial_period_days: 7,
      },
      metadata: {
        userId: userId,
      },
    });

    // Update subscription record in database
    await supabase.from("subscriptions").upsert({
      user_id: userId,
      stripe_customer_id: customerId,
      status: "trialing",
      price_id: priceId,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });

    console.log("Checkout session created:", session.id);
    
    return new Response(JSON.stringify({ sessionUrl: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
