
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useGoogleSheetsDownload = (submissions: any[]) => {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadGoogleSheet = async () => {
    setIsDownloading(true);
    try {
      console.log("Starting Google Sheets download process...");

      // Fetch all data from different tables
      const [formSubmissionsResult, staffRatiosResult, enrollmentResult, roomPlannerResult] = await Promise.all([
        supabase.from('form_submissions').select('*').order('submitted_at', { ascending: false }),
        supabase.from('staff_child_ratios').select('*').order('created_at', { ascending: false }),
        supabase.from('enrollment_attendance').select('*').order('date', { ascending: false }),
        supabase.from('room_planner').select('*').order('created_at', { ascending: false })
      ]);

      if (formSubmissionsResult.error) throw formSubmissionsResult.error;
      if (staffRatiosResult.error) throw staffRatiosResult.error;
      if (enrollmentResult.error) throw enrollmentResult.error;
      if (roomPlannerResult.error) throw roomPlannerResult.error;

      // Format data for each sheet
      const formSubmissionsData = formSubmissionsResult.data?.map((submission, index) => {
        const parsedData = typeof submission.submission_data === 'string' 
          ? JSON.parse(submission.submission_data) 
          : submission.submission_data;

        return {
          id: index + 1,
          timestamp: new Date(submission.submitted_at).toLocaleString(),
          full_name: submission.full_name,
          email: submission.email,
          role: submission.role,
          nursery_name: parsedData?.nursery_name || '',
          total_questions: parsedData?.total_questions || 0,
          answered_questions: parsedData?.answered_questions || 0,
          compliance_rate: parsedData?.total_questions > 0 
            ? Math.round((parsedData.answered_questions / parsedData.total_questions) * 100) 
            : 0
        };
      }) || [];

      const staffRatiosData = staffRatiosResult.data?.map((ratio, index) => ({
        id: index + 1,
        branch: ratio.branch,
        room: ratio.room,
        age_group: ratio.age_group,
        staff_count: ratio.staff_count,
        children_count: ratio.children_count,
        required_ratio: ratio.required_ratio,
        actual_ratio: ratio.actual_ratio,
        status: ratio.status,
        created_at: new Date(ratio.created_at).toLocaleString()
      })) || [];

      const enrollmentData = enrollmentResult.data?.map((item, index) => ({
        id: index + 1,
        site: item.site,
        date: item.date,
        staff_count: item.staff_count,
        children_enrolled: item.children_enrolled,
        children_present: item.children_present,
        planned_capacity: item.planned_capacity || 0,
        occupancy_rate: `${item.occupancy_rate}%`,
        staff_attendance_rate: `${item.staff_attendance_rate}%`,
        created_at: new Date(item.created_at).toLocaleString()
      })) || [];

      const roomPlannerData = roomPlannerResult.data?.map((room, index) => ({
        id: index + 1,
        site: room.site,
        room_name: room.room_name,
        age_group: room.age_group,
        ratio: room.ratio,
        monday_children: room.monday_children,
        tuesday_children: room.tuesday_children,
        wednesday_children: room.wednesday_children,
        thursday_children: room.thursday_children,
        friday_children: room.friday_children,
        monday_staff: room.monday_staff,
        tuesday_staff: room.tuesday_staff,
        wednesday_staff: room.wednesday_staff,
        thursday_staff: room.thursday_staff,
        friday_staff: room.friday_staff,
        created_at: new Date(room.created_at).toLocaleString()
      })) || [];

      // Create multi-sheet structure
      const sheetsData = {
        action: 'createMultipleSheets',
        sheets: [
          {
            name: 'Form Submissions',
            headers: ['ID', 'Timestamp', 'Full Name', 'Email', 'Role', 'Nursery', 'Total Questions', 'Answered Questions', 'Compliance Rate'],
            data: formSubmissionsData
          },
          {
            name: 'Staff Child Ratios',
            headers: ['ID', 'Branch', 'Room', 'Age Group', 'Staff Count', 'Children Count', 'Required Ratio', 'Actual Ratio', 'Status', 'Created At'],
            data: staffRatiosData
          },
          {
            name: 'Enrollment Attendance',
            headers: ['ID', 'Site', 'Date', 'Staff Count', 'Children Enrolled', 'Children Present', 'Planned Capacity', 'Occupancy Rate', 'Staff Attendance Rate', 'Created At'],
            data: enrollmentData
          },
          {
            name: 'Room Planner',
            headers: ['ID', 'Site', 'Room Name', 'Age Group', 'Ratio', 'Mon Children', 'Tue Children', 'Wed Children', 'Thu Children', 'Fri Children', 'Mon Staff', 'Tue Staff', 'Wed Staff', 'Thu Staff', 'Fri Staff', 'Created At'],
            data: roomPlannerData
          }
        ]
      };

      console.log("Sending multi-sheet data to Google Sheets function...");

      const response = await supabase.functions.invoke('google-sheets-integration', {
        body: sheetsData
      });

      console.log("Google Sheets function response:", response);

      if (response.error) {
        throw new Error(`Function error: ${response.error.message}`);
      }

      if (response.data?.success && response.data?.sheetUrl) {
        // Open the Google Sheet in a new tab
        window.open(response.data.sheetUrl, '_blank');
        
        toast({
          title: "Success!",
          description: `Google Sheets created successfully with ${response.data.totalRecords || 'multiple'} records`,
        });
      } else if (response.data?.sheets) {
        // Fallback: download as CSV files
        console.log("Google Sheets failed, providing CSV fallback");
        
        response.data.sheets.forEach((sheet: any) => {
          if (sheet.data && sheet.data.length > 0) {
            const csvRows = [
              sheet.headers.join(','),
              ...sheet.data.map((row: any) => 
                sheet.headers.map((header: string) => {
                  const key = header.toLowerCase().replace(/\s+/g, '_');
                  const value = row[key] || '';
                  return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
                }).join(',')
              )
            ];
            
            const csvContent = csvRows.join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${sheet.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
          }
        });

        toast({
          title: "CSV Download",
          description: "Google Sheets unavailable. Downloaded as CSV files instead.",
          variant: "destructive",
        });
      } else {
        throw new Error("No valid response from Google Sheets integration");
      }

    } catch (error) {
      console.error('Google Sheets download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to create Google Sheets. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    downloadGoogleSheet,
    isDownloading
  };
};
