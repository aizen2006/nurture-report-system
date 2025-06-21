
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ComplianceOverview from './dashboard/ComplianceOverview';
import StaffChildRatio from './dashboard/StaffChildRatio';
import EnrollmentAttendance from './dashboard/EnrollmentAttendance';
import AISuggestions from './dashboard/AISuggestions';
import KeyMetrics from './dashboard/KeyMetrics';
import ComplianceByRole from './dashboard/ComplianceByRole';
import RecentActivity from './dashboard/RecentActivity';
import RoomPlanner from './dashboard/RoomPlanner';
import StaffChildRatioTable from './dashboard/StaffChildRatioTable';
import EnrollmentAttendanceTable from './dashboard/EnrollmentAttendanceTable';
import { calculateComplianceData, getRecentEntries } from './dashboard/utils/dataProcessing';
import { useGoogleSheetsDownload } from './dashboard/hooks/useGoogleSheetsDownload';

const Dashboard = () => {
  const { data: submissions, isLoading } = useQuery({
    queryKey: ['form_submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { downloadGoogleSheet, isDownloading } = useGoogleSheetsDownload(submissions || []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const complianceData = calculateComplianceData(submissions || []);
  const recentEntries = getRecentEntries(submissions || []);

  return (
    <div className="space-y-6">
      {/* Top Row - Compliance Overview and Staff Child Ratio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ComplianceOverview />
        <StaffChildRatio />
      </div>
      
      {/* Second Row - Enrollment & Attendance */}
      <EnrollmentAttendance />

      {/* Room Planner Section */}
      <RoomPlanner />

      {/* Data Collection Tables */}
      <div className="space-y-6">
        <StaffChildRatioTable />
        <EnrollmentAttendanceTable />
      </div>

      {/* Key Metrics */}
      <KeyMetrics
        overallCompliance={complianceData.overall}
        totalSubmissions={submissions?.length || 0}
        activeAlerts={0}
        onDownload={downloadGoogleSheet}
        isDownloading={isDownloading}
        hasData={submissions && submissions.length > 0}
      />

      {/* Compliance by Role */}
      <ComplianceByRole complianceData={complianceData} />

      {/* Recent Activity and AI Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity recentEntries={recentEntries} />
        <AISuggestions />
      </div>
    </div>
  );
};

export default Dashboard;
