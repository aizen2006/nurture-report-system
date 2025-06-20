
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
    const googleScriptUrl = Deno.env.get('PAGE_URL'); // Using PAGE_URL as mentioned

    console.log("Google Script URL:", googleScriptUrl);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (req.method === 'GET') {
      console.log("Fetching submissions from database...");
      
      // Fetch all submissions from database
      const { data: submissions, error } = await supabase
        .from('form_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Error fetching submissions:', error);
        throw error;
      }

      console.log(`Found ${submissions?.length || 0} submissions`);

      // Format data for Google Sheets
      const formattedData = submissions?.map((submission: any) => {
        const parsedData = typeof submission.submission_data === 'string' 
          ? JSON.parse(submission.submission_data) 
          : submission.submission_data;

        return {
          id: submission.id,
          timestamp: new Date(submission.submitted_at).toISOString(),
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

      console.log("Formatted data sample:", formattedData[0]);

      // Send to Google Apps Script if URL is configured
      if (googleScriptUrl && formattedData.length > 0) {
        try {
          console.log("Sending data to Google Apps Script...");
          
          const response = await fetch(googleScriptUrl, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              action: 'createOrUpdateSheet',
              data: formattedData
            })
          });

          console.log("Google Apps Script response status:", response.status);
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error("Google Apps Script error response:", errorText);
            throw new Error(`Google Apps Script returned ${response.status}: ${errorText}`);
          }

          const result = await response.json();
          console.log('Google Apps Script response:', result);

          return new Response(
            JSON.stringify({ 
              success: true, 
              message: "Data successfully sent to Google Sheets",
              sheetUrl: result.sheetUrl || null,
              recordCount: formattedData.length,
              result: result
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            }
          );
        } catch (googleError) {
          console.error('Google Sheets integration error:', googleError);
          
          // Return the data as CSV fallback if Google Sheets fails
          const csvContent = createCSVFromData(formattedData);
          
          return new Response(
            JSON.stringify({ 
              success: false, 
              message: "Failed to send to Google Sheets, CSV data provided as fallback",
              data: formattedData,
              csvContent: csvContent,
              recordCount: formattedData.length,
              error: googleError.message
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            }
          );
        }
      } else {
        console.log("Google Script URL not configured or no data to send");
        
        // If no Google Script URL, return CSV data
        const csvContent = createCSVFromData(formattedData);
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "Data retrieved successfully, CSV content provided",
            data: formattedData,
            csvContent: csvContent,
            recordCount: formattedData.length
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
    }

    // Handle POST requests (single submission)
    const submissionData: FormSubmissionData = await req.json();
    
    console.log("Processing single submission for Google Sheets:", submissionData.id);
    
    if (googleScriptUrl) {
      const response = await fetch(googleScriptUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          action: 'addRow',
          data: submissionData
        })
      });

      const result = await response.json();
      console.log('Google Sheets single submission response:', result);
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
      JSON.stringify({ 
        error: error.message,
        success: false,
        message: "Failed to process request"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

// Helper function to create CSV content
function createCSVFromData(data: any[]): string {
  if (!data || data.length === 0) return '';
  
  const headers = ['ID', 'Timestamp', 'Full Name', 'Email', 'Role', 'Nursery', 'Total Questions', 'Answered Questions', 'Compliance Rate'];
  const csvRows = [
    headers.join(','),
    ...data.map(row => [
      row.id,
      row.timestamp,
      `"${row.full_name}"`,
      row.email,
      `"${row.role}"`,
      `"${row.nursery_name}"`,
      row.total_questions,
      row.answered_questions,
      `${row.compliance_rate}%`
    ].join(','))
  ];
  
  return csvRows.join('\n');
}

serve(handler);
