
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
    
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      throw new Error("No Stripe signature found");
    }

    const body = await req.text();
    let event;

    // Verify webhook signature
    try {
      const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
      if (endpointSecret) {
        event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
      } else {
        event = JSON.parse(body);
        console.warn("⚠️ Webhook signature verification skipped - no endpoint secret found");
      }
    } catch (err) {
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        if (session.mode === "subscription") {
          const subscriptionId = session.subscription;
          const customerId = session.customer;
          const userId = session.metadata?.userId;

          if (userId) {
            // Retrieve subscription details
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            
            // Update subscription record in database
            await supabase.from("subscriptions").upsert({
              user_id: userId,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              status: subscription.status,
              price_id: subscription.items.data[0]?.price.id,
              trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              updated_at: new Date().toISOString()
            }, { onConflict: "user_id" });

            // Update user profile subscription status
            await supabase.from("profiles").update({
              subscription_status: subscription.status
            }).eq("id", userId);
          }
        }
        break;
      }
      case "customer.subscription.updated": 
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        
        // Find user by customer ID
        const { data: userData } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .single();
          
        if (userData?.user_id) {
          // Update subscription record in database
          await supabase.from("subscriptions").update({
            status: subscription.status,
            trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString()
          }).eq("user_id", userData.user_id);

          // Update user profile subscription status
          await supabase.from("profiles").update({
            subscription_status: subscription.status
          }).eq("id", userData.user_id);
        }
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
});
