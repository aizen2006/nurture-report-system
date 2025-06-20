
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FormSubmissionData {
  id: string;
  full_name: string;
  email: string;
  role: string;
  submitted_at: string;
  submission_data: any;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const googleScriptUrl = Deno.env.get('GOOGLE_SCRIPT_URL');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (req.method === 'GET') {
      // Fetch all submissions from database
      const { data: submissions, error } = await supabase
        .from('form_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Error fetching submissions:', error);
        throw error;
      }

      // Format data for Google Sheets
      const formattedData = submissions?.map((submission: any) => {
        const parsedData = typeof submission.submission_data === 'string' 
          ? JSON.parse(submission.submission_data) 
          : submission.submission_data;

        return {
          id: submission.id,
          timestamp: submission.submitted_at,
          full_name: submission.full_name,
          email: submission.email,
          role: submission.role,
          nursery_name: parsedData?.nursery_name || '',
          total_questions: parsedData?.total_questions || 0,
          answered_questions: parsedData?.answered_questions || 0,
          compliance_rate: parsedData?.total_questions > 0 
            ? Math.round((parsedData.answered_questions / parsedData.total_questions) * 100) 
            : 0,
          responses: JSON.stringify(parsedData?.responses || {})
        };
      }) || [];

      // Send to Google Apps Script if URL is configured
      if (googleScriptUrl && formattedData.length > 0) {
        try {
          const response = await fetch(googleScriptUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'createOrUpdateSheet',
              data: formattedData
            })
          });

          const result = await response.json();
          console.log('Google Sheets response:', result);

          return new Response(
            JSON.stringify({ 
              success: true, 
              message: "Data successfully sent to Google Sheets",
              sheetUrl: result.sheetUrl || null,
              recordCount: formattedData.length
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            }
          );
        } catch (googleError) {
          console.error('Google Sheets error:', googleError);
          // Return the data even if Google Sheets fails
          return new Response(
            JSON.stringify({ 
              success: false, 
              message: "Failed to send to Google Sheets, but data retrieved",
              data: formattedData,
              error: googleError.message
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            }
          );
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Data retrieved successfully",
          data: formattedData,
          recordCount: formattedData.length
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Handle POST requests (single submission)
    const submissionData: FormSubmissionData = await req.json();
    
    console.log("Processing submission for Google Sheets:", submissionData.id);
    
    if (googleScriptUrl) {
      const response = await fetch(googleScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addRow',
          data: submissionData
        })
      });

      const result = await response.json();
      console.log('Google Sheets response:', result);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Submission processed for Google Sheets",
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
