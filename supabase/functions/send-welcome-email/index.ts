
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const resend = new Resend(resendApiKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  fullName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, fullName }: WelcomeEmailRequest = await req.json();
    const name = fullName || email.split("@")[0];

    console.log(`Sending welcome email to ${email}`);

    // Send welcome email to the user
    const welcomeEmailResponse = await resend.emails.send({
      from: "LeadHustle.pro <no-reply@leadhustle.pro>",
      to: [email],
      subject: "Welcome to LeadHustle.pro!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to LeadHustle.pro, ${name}!</h2>
          <p>Thank you for signing up. We're thrilled to have you on board!</p>
          <p>With LeadHustle.pro, you can:</p>
          <ul>
            <li>Easily manage your leads</li>
            <li>Set up automated follow-ups</li>
            <li>Track your conversion rates</li>
            <li>Generate performance reports</li>
          </ul>
          <p>If you have any questions, don't hesitate to reach out to our support team.</p>
          <p>Best regards,<br>The LeadHustle.pro Team</p>
        </div>
      `,
    });

    // Send internal notification
    const notificationEmailResponse = await resend.emails.send({
      from: "LeadHustle.pro <no-reply@leadhustle.pro>",
      to: ["phillip.cantu@leadhustle.pro"],
      subject: "New User Signup: LeadHustle.pro",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New User Alert</h2>
          <p>A new user has signed up for LeadHustle.pro:</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p>Time: ${new Date().toLocaleString()}</p>
        </div>
      `,
    });

    console.log("Welcome email sent:", welcomeEmailResponse);
    console.log("Notification email sent:", notificationEmailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        welcomeEmail: welcomeEmailResponse,
        notificationEmail: notificationEmailResponse,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
