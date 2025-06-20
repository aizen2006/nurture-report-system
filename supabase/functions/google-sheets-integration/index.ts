
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FormSubmissionData {
  timestamp: string;
  full_name: string;
  email: string;
  nursery_name: string;
  role: string;
  [key: string]: any;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const submissionData: FormSubmissionData = await req.json();
    
    // Google Apps Script Web App URL would be configured here
    // const GOOGLE_SCRIPT_URL = Deno.env.get("GOOGLE_SCRIPT_URL");
    
    // For now, we'll just log the data structure that would be sent
    console.log("Data to be sent to Google Sheets:", submissionData);
    
    // In a real implementation, you would send to Google Apps Script:
    // const response = await fetch(GOOGLE_SCRIPT_URL, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(submissionData)
    // });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Data prepared for Google Sheets submission",
        data: submissionData 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error in google-sheets-integration:", error);
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
