
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
      console.log("Starting multi-sheet download process...");
      
      // Fetch all data sources
      const [submissionsResponse, ratiosResponse, enrollmentResponse] = await Promise.all([
        // Form submissions (already passed as parameter, but fetch fresh data)
        supabase.from('form_submissions').select('*').order('submitted_at', { ascending: false }),
        // Staff-child ratios
        supabase.from('staff_child_ratios').select('*').order('created_at', { ascending: false }),
        // Enrollment & attendance
        supabase.from('enrollment_attendance').select('*').order('date', { ascending: false })
      ]);

      if (submissionsResponse.error) throw submissionsResponse.error;
      if (ratiosResponse.error) throw ratiosResponse.error;
      if (enrollmentResponse.error) throw enrollmentResponse.error;

      const formattedSubmissions = formatSubmissionsForCSV(submissionsResponse.data || []);
      const formattedRatios = formatRatiosForCSV(ratiosResponse.data || []);
      const formattedEnrollment = formatEnrollmentForCSV(enrollmentResponse.data || []);

      // Try Google Sheets integration first
      const { data, error } = await supabase.functions.invoke('google-sheets-integration', {
        method: 'POST',
        body: {
          action: 'createMultipleSheets',
          sheets: [
            { name: 'Form Submissions', data: formattedSubmissions },
            { name: 'Staff Child Ratios', data: formattedRatios },
            { name: 'Enrollment Attendance', data: formattedEnrollment }
          ]
        }
      });

      if (error) {
        console.error("Supabase function error:", error);
        throw error;
      }

      if (data?.success && data?.sheetUrl) {
        window.open(data.sheetUrl, '_blank');
        toast({
          title: "Sheets Ready",
          description: `Google Sheets opened with ${data.totalRecords} total records across 3 sheets`,
        });
      } else {
        // Fallback: download separate CSV files
        const timestamp = new Date().toISOString().split('T')[0];
        
        if (formattedSubmissions.length > 0) {
          const submissionsCsv = createCSVFromData(formattedSubmissions);
          downloadCSV(submissionsCsv, `form-submissions-${timestamp}.csv`);
        }
        
        if (formattedRatios.length > 0) {
          const ratiosCsv = createCSVFromRatiosData(formattedRatios);
          downloadCSV(ratiosCsv, `staff-child-ratios-${timestamp}.csv`);
        }
        
        if (formattedEnrollment.length > 0) {
          const enrollmentCsv = createCSVFromEnrollmentData(formattedEnrollment);
          downloadCSV(enrollmentCsv, `enrollment-attendance-${timestamp}.csv`);
        }

        const totalRecords = formattedSubmissions.length + formattedRatios.length + formattedEnrollment.length;
        toast({
          title: "CSV Files Downloaded",
          description: `Downloaded ${totalRecords} total records across 3 CSV files`,
        });
      }
    } catch (error) {
      console.error('Download error:', error);
      
      // Final fallback: create CSV from local data
      const timestamp = new Date().toISOString().split('T')[0];
      let downloadedFiles = 0;
      
      if (submissions && submissions.length > 0) {
        const formattedData = formatSubmissionsForCSV(submissions);
        const csvContent = createCSVFromData(formattedData);
        downloadCSV(csvContent, `form-submissions-backup-${timestamp}.csv`);
        downloadedFiles++;
      }

      toast({
        title: downloadedFiles > 0 ? "Backup CSV Downloaded" : "Download Failed",
        description: downloadedFiles > 0 
          ? `Downloaded ${downloadedFiles} backup file(s)`
          : "Failed to download data and no backup available.",
        variant: downloadedFiles > 0 ? "default" : "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return { downloadGoogleSheet, isDownloading };
};

// Helper function to format staff-child ratios for CSV
const formatRatiosForCSV = (ratios: any[]) => {
  return ratios.map((ratio, index) => ({
    id: index + 1,
    branch: ratio.branch,
    room: ratio.room,
    age_group: ratio.age_group,
    staff_count: ratio.staff_count,
    children_count: ratio.children_count,
    required_ratio: ratio.required_ratio,
    actual_ratio: ratio.actual_ratio,
    status: ratio.status,
    created_at: ratio.created_at,
    updated_at: ratio.updated_at
  }));
};

// Helper function to format enrollment & attendance for CSV
const formatEnrollmentForCSV = (enrollment: any[]) => {
  return enrollment.map((item, index) => ({
    id: index + 1,
    site: item.site,
    date: item.date,
    staff_count: item.staff_count,
    children_enrolled: item.children_enrolled,
    children_present: item.children_present,
    planned_capacity: item.planned_capacity || 0,
    occupancy_rate: item.occupancy_rate,
    staff_attendance_rate: item.staff_attendance_rate,
    created_at: item.created_at,
    updated_at: item.updated_at
  }));
};

// Helper function to create CSV from ratios data
const createCSVFromRatiosData = (data: any[]) => {
  if (!data || data.length === 0) return '';
  
  const headers = ['ID', 'Branch', 'Room', 'Age Group', 'Staff Count', 'Children Count', 'Required Ratio', 'Actual Ratio', 'Status', 'Created At', 'Updated At'];
  const csvRows = [
    headers.join(','),
    ...data.map(row => [
      row.id,
      `"${row.branch}"`,
      `"${row.room}"`,
      `"${row.age_group}"`,
      row.staff_count,
      row.children_count,
      `"${row.required_ratio}"`,
      `"${row.actual_ratio}"`,
      `"${row.status}"`,
      row.created_at,
      row.updated_at
    ].join(','))
  ];
  
  return csvRows.join('\n');
};

// Helper function to create CSV from enrollment data
const createCSVFromEnrollmentData = (data: any[]) => {
  if (!data || data.length === 0) return '';
  
  const headers = ['ID', 'Site', 'Date', 'Staff Count', 'Children Enrolled', 'Children Present', 'Planned Capacity', 'Occupancy Rate', 'Staff Attendance Rate', 'Created At', 'Updated At'];
  const csvRows = [
    headers.join(','),
    ...data.map(row => [
      row.id,
      `"${row.site}"`,
      row.date,
      row.staff_count,
      row.children_enrolled,
      row.children_present,
      row.planned_capacity,
      `${row.occupancy_rate}%`,
      `${row.staff_attendance_rate}%`,
      row.created_at,
      row.updated_at
    ].join(','))
  ];
  
  return csvRows.join('\n');
};
