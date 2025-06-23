
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Info } from 'lucide-react';
import AttendanceCharts from './AttendanceCharts';
import OccupancyChart from './OccupancyChart';
import EnrollmentSummary from './EnrollmentSummary';
import EnrollmentSummaryCards from './enrollment/EnrollmentSummaryCards';
import { processEnrollmentData } from './enrollment/EnrollmentDataProcessor';
import { generateOccupancyData } from './enrollment/OccupancyDataProcessor';

const EnrollmentAttendance = () => {
  const [selectedSite, setSelectedSite] = useState('all');
  const [showCharts, setShowCharts] = useState(false);

  // Fetch enrollment data from database
  const { data: enrollmentData, isLoading: enrollmentLoading } = useQuery({
    queryKey: ['enrollment_attendance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enrollment_attendance')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch form submissions for additional data
  const { data: submissions } = useQuery({
    queryKey: ['form_submissions_enrollment'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (enrollmentLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            Enrollment & Attendance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { processFormSubmissionData, generateChartData } = processEnrollmentData(enrollmentData || [], submissions || []);
  const { sites, staffData, childData } = generateChartData();
  const formSubmissionData = processFormSubmissionData();
  const { occupancyData, currentOccupancy, plannedCapacity } = generateOccupancyData(enrollmentData || [], formSubmissionData, selectedSite);

  // Filter data based on selected site
  const getFilteredData = (data: any[]) => {
    if (selectedSite === 'all') return data;
    return data.filter(item => item.site === selectedSite || item[selectedSite] !== undefined);
  };

  const filteredStaffData = getFilteredData(staffData);
  const filteredChildData = getFilteredData(childData);
  const siteName = selectedSite === 'all' ? 'All Sites' : selectedSite;

  // Calculate summary data
  const totalEnrolled = enrollmentData?.reduce((sum, item) => sum + item.children_enrolled, 0) || 
                       formSubmissionData.attendanceData.reduce((sum: number, item: any) => sum + item.monthlyEnrollment, 0) || 0;
  
  const avgAttendance = enrollmentData?.length > 0 
    ? Math.round(enrollmentData.reduce((sum, item) => sum + item.occupancy_rate, 0) / enrollmentData.length)
    : Math.round(formSubmissionData.attendanceData.reduce((sum: number, item: any) => 
        sum + parseInt(item.weeklyAttendance.replace('%', '')), 0) / Math.max(formSubmissionData.attendanceData.length, 1));

  const todayTotals = {
    staff: enrollmentData?.reduce((sum, item) => sum + item.staff_count, 0) || 
           formSubmissionData.attendanceData.reduce((sum: number, item: any) => sum + Math.floor(item.monthlyEnrollment * 0.3), 0) || 15,
    children: enrollmentData?.reduce((sum, item) => sum + item.children_present, 0) || 
              formSubmissionData.attendanceData.reduce((sum: number, item: any) => sum + item.monthlyEnrollment, 0) || 85
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            Enrollment & Attendance
            <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
              <Info className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <Select value={selectedSite} onValueChange={setSelectedSite}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sites</SelectItem>
                {sites.map(site => (
                  <SelectItem key={site} value={site}>{site}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCharts(!showCharts)}
            >
              {showCharts ? 'Hide Charts' : 'View Charts'}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Cards */}
        <EnrollmentSummaryCards 
          totalEnrolled={totalEnrolled}
          avgAttendance={avgAttendance}
          activeSites={sites.length}
        />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Occupancy Chart */}
          <OccupancyChart 
            occupancyData={occupancyData}
            currentOccupancy={currentOccupancy}
            plannedCapacity={plannedCapacity}
            siteName={siteName}
          />

          {/* Summary or Charts */}
          {showCharts ? (
            <div className="lg:col-span-2">
              <AttendanceCharts 
                staffData={filteredStaffData}
                childData={filteredChildData}
                siteName={siteName}
                selectedSite={selectedSite}
              />
            </div>
          ) : (
            <EnrollmentSummary 
              todayTotals={todayTotals}
              siteName={siteName}
            />
          )}
        </div>

        {/* Data Source Info */}
        <div className="text-xs text-gray-500 border-t pt-4">
          Data source: {enrollmentData && enrollmentData.length > 0 
            ? 'Enrollment & Attendance database table' 
            : 'Form submissions (real-time data)'}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnrollmentAttendance;
