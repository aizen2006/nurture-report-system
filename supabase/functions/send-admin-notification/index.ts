
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationData {
  submitterName: string;
  submitterEmail: string;
  role: string;
  nurseryName: string;
  submissionTime: string;
  googleSheetUrl?: string;
  formData?: any;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const notificationData: NotificationData = await req.json();
    
    const adminEmail = "abhik@arkgroup.co.uk";
    
    // Create form data summary for email
    const formDataSummary = notificationData.formData 
      ? Object.entries(notificationData.formData).map(([key, value]) => `${key}: ${value}`).join('\n')
      : 'No form data available';

    // Admin notification email
    const adminEmailHtml = `
      <h2>New Childcare Checklist Submission</h2>
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h3>Submission Details:</h3>
        <ul>
          <li><strong>Submitter:</strong> ${notificationData.submitterName}</li>
          <li><strong>Email:</strong> ${notificationData.submitterEmail}</li>
          <li><strong>Role:</strong> ${notificationData.role}</li>
          <li><strong>Nursery:</strong> ${notificationData.nurseryName}</li>
          <li><strong>Submitted:</strong> ${notificationData.submissionTime}</li>
        </ul>
        
        ${notificationData.googleSheetUrl ? `<p><a href="${notificationData.googleSheetUrl}">View in Google Sheets</a></p>` : ''}
        
        <h3>Form Data Summary:</h3>
        <pre style="background: #f5f5f5; padding: 10px; border-radius: 5px;">${formDataSummary}</pre>
      </div>
    `;

    // Submitter confirmation email
    const submitterEmailHtml = `
      <h2>Thank you for your submission!</h2>
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>Dear ${notificationData.submitterName},</p>
        
        <p>Thank you for submitting your ${notificationData.role} checklist for ${notificationData.nurseryName}.</p>
        
        <h3>Submission Confirmation:</h3>
        <ul>
          <li><strong>Submitted:</strong> ${notificationData.submissionTime}</li>
          <li><strong>Role:</strong> ${notificationData.role}</li>
          <li><strong>Nursery:</strong> ${notificationData.nurseryName}</li>
        </ul>
        
        <p>Your submission has been recorded and the management team has been notified.</p>
        
        <p>Best regards,<br>Childcare Management System</p>
      </div>
    `;

    try {
      // Send admin notification
      const adminEmailResponse = await resend.emails.send({
        from: "Childcare System <onboarding@resend.dev>",
        to: [adminEmail],
        subject: `New ${notificationData.role} Checklist Submission`,
        html: adminEmailHtml
      });

      console.log("Admin email sent successfully:", adminEmailResponse);

      // Send submitter confirmation
      const submitterEmailResponse = await resend.emails.send({
        from: "Childcare System <onboarding@resend.dev>",
        to: [notificationData.submitterEmail],
        subject: "Checklist Submission Confirmation",
        html: submitterEmailHtml
      });

      console.log("Submitter confirmation email sent successfully:", submitterEmailResponse);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Emails sent successfully",
          adminEmailId: adminEmailResponse.data?.id,
          submitterEmailId: submitterEmailResponse.data?.id
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } catch (emailError) {
      console.error("Error sending emails:", emailError);
      
      // Still return success if the notification was processed, even if email failed
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Notification processed but email delivery failed",
          error: emailError.message
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
  } catch (error) {
    console.error("Error in send-admin-notification:", error);
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
