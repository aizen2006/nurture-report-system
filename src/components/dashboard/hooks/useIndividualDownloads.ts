
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { createCSVFromData, downloadCSV, formatSubmissionsForCSV } from '../utils/csvExport';

export const useIndividualDownloads = () => {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadFormSubmissions = async () => {
    setIsDownloading(true);
    try {
      console.log("Downloading form submissions...");
      
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const formattedData = formatSubmissionsForCSV(data);
        const csvContent = createCSVFromData(formattedData);
        const timestamp = new Date().toISOString().split('T')[0];
        downloadCSV(csvContent, `form-submissions-${timestamp}.csv`);
        
        toast({
          title: "Download Complete",
          description: `Downloaded ${data.length} form submissions`,
        });
      } else {
        toast({
          title: "No Data",
          description: "No form submissions found to download",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Form submissions download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download form submissions",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadStaffRatios = async () => {
    setIsDownloading(true);
    try {
      console.log("Downloading staff-child ratios...");
      
      const { data, error } = await supabase
        .from('staff_child_ratios')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const formattedData = data.map((ratio, index) => ({
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

        const headers = ['ID', 'Branch', 'Room', 'Age Group', 'Staff Count', 'Children Count', 'Required Ratio', 'Actual Ratio', 'Status', 'Created At', 'Updated At'];
        const csvRows = [
          headers.join(','),
          ...formattedData.map(row => [
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

        const csvContent = csvRows.join('\n');
        const timestamp = new Date().toISOString().split('T')[0];
        downloadCSV(csvContent, `staff-child-ratios-${timestamp}.csv`);
        
        toast({
          title: "Download Complete",
          description: `Downloaded ${data.length} staff-child ratio records`,
        });
      } else {
        toast({
          title: "No Data",
          description: "No staff-child ratio data found to download",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Staff ratios download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download staff-child ratios",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadEnrollmentAttendance = async () => {
    setIsDownloading(true);
    try {
      console.log("Downloading enrollment & attendance...");
      
      const { data, error } = await supabase
        .from('enrollment_attendance')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const formattedData = data.map((item, index) => ({
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

        const headers = ['ID', 'Site', 'Date', 'Staff Count', 'Children Enrolled', 'Children Present', 'Planned Capacity', 'Occupancy Rate', 'Staff Attendance Rate', 'Created At', 'Updated At'];
        const csvRows = [
          headers.join(','),
          ...formattedData.map(row => [
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

        const csvContent = csvRows.join('\n');
        const timestamp = new Date().toISOString().split('T')[0];
        downloadCSV(csvContent, `enrollment-attendance-${timestamp}.csv`);
        
        toast({
          title: "Download Complete",
          description: `Downloaded ${data.length} enrollment & attendance records`,
        });
      } else {
        toast({
          title: "No Data",
          description: "No enrollment & attendance data found to download",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Enrollment attendance download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download enrollment & attendance data",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadRoomPlanner = async () => {
    setIsDownloading(true);
    try {
      console.log("Downloading room planner data...");
      
      const { data, error } = await supabase
        .from('room_planner')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const formattedData = data.map((room, index) => ({
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
          created_at: room.created_at,
          updated_at: room.updated_at
        }));

        const headers = ['ID', 'Site', 'Room Name', 'Age Group', 'Ratio', 'Mon Children', 'Tue Children', 'Wed Children', 'Thu Children', 'Fri Children', 'Mon Staff', 'Tue Staff', 'Wed Staff', 'Thu Staff', 'Fri Staff', 'Created At', 'Updated At'];
        const csvRows = [
          headers.join(','),
          ...formattedData.map(row => [
            row.id,
            `"${row.site}"`,
            `"${row.room_name}"`,
            `"${row.age_group}"`,
            `"${row.ratio}"`,
            row.monday_children,
            row.tuesday_children,
            row.wednesday_children,
            row.thursday_children,
            row.friday_children,
            row.monday_staff,
            row.tuesday_staff,
            row.wednesday_staff,
            row.thursday_staff,
            row.friday_staff,
            row.created_at,
            row.updated_at
          ].join(','))
        ];

        const csvContent = csvRows.join('\n');
        const timestamp = new Date().toISOString().split('T')[0];
        downloadCSV(csvContent, `room-planner-${timestamp}.csv`);
        
        toast({
          title: "Download Complete",
          description: `Downloaded ${data.length} room planner records`,
        });
      } else {
        toast({
          title: "No Data",
          description: "No room planner data found to download",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Room planner download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download room planner data",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    downloadFormSubmissions,
    downloadStaffRatios,
    downloadEnrollmentAttendance,
    downloadRoomPlanner,
    isDownloading
  };
};
