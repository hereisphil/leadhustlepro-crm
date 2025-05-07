
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
    console.log("Check subscription function called");
    
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Parse request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (e) {
      console.error("Error parsing request body:", e);
      throw new Error("Invalid JSON in request body");
    }
    
    const userId = requestBody?.userId;
    console.log("Received userId:", userId);

    if (!userId) {
      throw new Error("Missing required parameter: userId");
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user's subscription record
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (subscriptionError && subscriptionError.code !== "PGRST116") { // Not found is OK
      throw new Error(`Error fetching subscription: ${subscriptionError.message}`);
    }

    if (!subscriptionData || !subscriptionData.stripe_customer_id) {
      console.log(`No subscription found for user: ${userId}`);
      return new Response(JSON.stringify({ 
        active: false,
        status: "no_subscription",
        trialEnd: null,
        currentPeriodEnd: null
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // If we have a customer but no subscription ID, try to find active subscriptions for this customer
    if (!subscriptionData.stripe_subscription_id && subscriptionData.stripe_customer_id) {
      console.log(`No subscription ID found, looking up by customer ID: ${subscriptionData.stripe_customer_id}`);
      
      const subscriptions = await stripe.subscriptions.list({
        customer: subscriptionData.stripe_customer_id,
        status: 'all',
        limit: 1
      });
      
      if (subscriptions.data.length > 0) {
        const subscription = subscriptions.data[0];
        console.log(`Found subscription ${subscription.id} via customer lookup`);
        
        // Update the subscription with userId metadata if not present
        if (!subscription.metadata?.userId) {
          console.log(`Adding userId metadata to subscription ${subscription.id}`);
          await stripe.subscriptions.update(subscription.id, {
            metadata: { userId }
          });
        }
        
        // Update subscription record in database
        await supabase.from("subscriptions").update({
          stripe_subscription_id: subscription.id,
          status: subscription.status,
          trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString()
        }).eq("user_id", userId);
        
        // Continue checking this subscription
        subscriptionData.stripe_subscription_id = subscription.id;
      }
    }
    
    // If we still have no subscription ID, return no_subscription
    if (!subscriptionData.stripe_subscription_id) {
      console.log(`No subscription found for customer: ${subscriptionData.stripe_customer_id}`);
      return new Response(JSON.stringify({
        active: false,
        status: "no_subscription",
        trialEnd: null,
        currentPeriodEnd: null
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Get subscription details from Stripe
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionData.stripe_subscription_id);
      console.log(`Retrieved subscription for user ${userId}, status: ${subscription.status}`);
      
      // Add userId to subscription metadata if not present
      if (!subscription.metadata?.userId) {
        console.log(`Adding userId metadata to subscription ${subscription.id}`);
        await stripe.subscriptions.update(subscription.id, {
          metadata: { userId }
        });
      }
      
      // Update subscription in database
      await supabase.from("subscriptions").update({
        status: subscription.status,
        trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString()
      }).eq("user_id", userId);

      // Update user profile subscription status
      await supabase.from("profiles").update({
        subscription_status: subscription.status
      }).eq("id", userId);

      // IMPORTANT: Consider both 'active' AND 'trialing' as valid active subscriptions
      const isSubscriptionActive = subscription.status === "active" || subscription.status === "trialing";

      return new Response(JSON.stringify({
        active: isSubscriptionActive,
        status: subscription.status,
        trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } catch (stripeError) {
      console.error(`Error retrieving subscription ${subscriptionData.stripe_subscription_id}:`, stripeError);
      
      // If the subscription doesn't exist in Stripe anymore, clear it from the database
      if (stripeError.code === 'resource_missing') {
        console.log(`Subscription ${subscriptionData.stripe_subscription_id} not found in Stripe, clearing from database`);
        await supabase.from("subscriptions").update({
          stripe_subscription_id: null,
          status: "canceled",
          updated_at: new Date().toISOString()
        }).eq("user_id", userId);
        
        await supabase.from("profiles").update({
          subscription_status: "canceled"
        }).eq("id", userId);
        
        return new Response(JSON.stringify({
          active: false,
          status: "canceled",
          trialEnd: null,
          currentPeriodEnd: null
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
      
      throw stripeError;
    }
  } catch (error) {
    console.error("Error checking subscription:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
