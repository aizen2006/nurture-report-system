
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { createCSVFromData, downloadCSV, formatSubmissionsForCSV } from '../utils/csvExport';

export const useGoogleSheetsDownload = (submissions: any[]) => {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadGoogleSheet = async () => {
    setIsDownloading(true);
    try {
      console.log("Starting download process...");
      
      const { data, error } = await supabase.functions.invoke('google-sheets-integration', {
        method: 'GET'
      });

      console.log("Edge function response:", data);

      if (error) {
        console.error("Supabase function error:", error);
        throw error;
      }

      if (data?.success && data?.sheetUrl) {
        // Open the Google Sheet in a new tab
        window.open(data.sheetUrl, '_blank');
        toast({
          title: "Sheet Ready",
          description: `Google Sheet opened with ${data.recordCount} records`,
        });
      } else if (data?.success && data?.csvContent) {
        // Download CSV if Google Sheets integration failed but CSV content is available
        downloadCSV(data.csvContent, 'form-submissions.csv');
        toast({
          title: "CSV Downloaded",
          description: `Downloaded ${data.recordCount} records as CSV file`,
        });
      } else if (data?.data) {
        // Fallback: create CSV from returned data
        const csvContent = createCSVFromData(data.data);
        downloadCSV(csvContent, 'form-submissions.csv');
        toast({
          title: "CSV Downloaded",
          description: `Downloaded ${data.recordCount || data.data.length} records as CSV file`,
        });
      } else {
        throw new Error(data?.message || 'Failed to process sheet download');
      }
    } catch (error) {
      console.error('Download error:', error);
      
      // Final fallback: create CSV from local submissions data
      if (submissions && submissions.length > 0) {
        const formattedData = formatSubmissionsForCSV(submissions);
        const csvContent = createCSVFromData(formattedData);
        downloadCSV(csvContent, 'form-submissions-backup.csv');
        
        toast({
          title: "Backup CSV Downloaded",
          description: `Downloaded ${submissions.length} records as backup CSV`,
          variant: "default",
        });
      } else {
        toast({
          title: "Download Failed",
          description: "Failed to download sheet and no data available for backup.",
          variant: "destructive",
        });
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return { downloadGoogleSheet, isDownloading };
};
