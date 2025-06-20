
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const notificationData: NotificationData = await req.json();
    
    // In a real implementation, you would use Resend or another email service
    // const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    
    const adminEmail = "abhik@arkgroup.co.uk";
    
    console.log(`Admin notification prepared for ${adminEmail}:`, {
      subject: `New Childcare Checklist Submission - ${notificationData.role}`,
      message: `
        New form submission received:
        
        Submitter: ${notificationData.submitterName}
        Email: ${notificationData.submitterEmail}
        Role: ${notificationData.role}
        Nursery: ${notificationData.nurseryName}
        Submitted: ${notificationData.submissionTime}
        
        ${notificationData.googleSheetUrl ? `View in Google Sheets: ${notificationData.googleSheetUrl}` : ''}
      `
    });

    // In a real implementation with Resend:
    // const emailResponse = await resend.emails.send({
    //   from: "Nursery System <noreply@yourdomain.com>",
    //   to: [adminEmail],
    //   subject: `New Childcare Checklist Submission - ${notificationData.role}`,
    //   html: emailContent
    // });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Admin notification prepared",
        recipient: adminEmail
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
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
