
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import OccupancyChart from './OccupancyChart';
import EnrollmentSummary from './EnrollmentSummary';
import AttendanceCharts from './AttendanceCharts';

const EnrollmentAttendance = () => {
  const [selectedSite, setSelectedSite] = useState('all');
  const [showDetailedCharts, setShowDetailedCharts] = useState(false);

  const { data: enrollmentData, isLoading } = useQuery({
    queryKey: ['enrollment_attendance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enrollment_attendance')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const sites = [
    { id: 'all', name: 'All Sites' },
    ...Array.from(new Set(enrollmentData?.map(item => item.site) || [])).map(site => ({
      id: site.toLowerCase().replace(/\s+/g, '-'),
      name: site
    }))
  ];

  // Get current occupancy data based on selected site
  const getCurrentOccupancyData = () => {
    if (!enrollmentData || enrollmentData.length === 0) return { occupancyData: [], currentOccupancy: 0, plannedCapacity: 0 };

    if (selectedSite === 'all') {
      // Get the most recent date's data
      const mostRecentDate = enrollmentData.reduce((latest, item) => {
        return new Date(item.date) > new Date(latest) ? item.date : latest;
      }, enrollmentData[0].date);

      const todayData = enrollmentData.filter(item => item.date === mostRecentDate);
      const totalOccupied = todayData.reduce((sum, item) => sum + item.children_present, 0);
      const totalCapacity = todayData.reduce((sum, item) => sum + (item.planned_capacity || 0), 0);

      return {
        occupancyData: [
          { name: 'Occupied', value: totalOccupied, color: '#3b82f6' },
          { name: 'Available', value: Math.max(0, totalCapacity - totalOccupied), color: '#93c5fd' }
        ],
        currentOccupancy: totalOccupied,
        plannedCapacity: totalCapacity
      };
    } else {
      // Filter by selected site
      const selectedSiteName = sites.find(s => s.id === selectedSite)?.name;
      const siteData = enrollmentData.filter(item => item.site === selectedSiteName);
      const latestData = siteData[0] || { children_present: 0, planned_capacity: 0 };
      
      return {
        occupancyData: [
          { name: 'Occupied', value: latestData.children_present, color: '#3b82f6' },
          { name: 'Available', value: Math.max(0, (latestData.planned_capacity || 0) - latestData.children_present), color: '#93c5fd' }
        ],
        currentOccupancy: latestData.children_present,
        plannedCapacity: latestData.planned_capacity || 0
      };
    }
  };

  // Process data for line/bar charts
  const processChartData = () => {
    if (!enrollmentData) return { staffData: [], childData: [] };

    const last15Records = enrollmentData.slice(0, 15).reverse();
    
    if (selectedSite === 'all') {
      // Group by date and aggregate by site
      const groupedByDate = last15Records.reduce((acc, item) => {
        const dateKey = item.date;
        if (!acc[dateKey]) {
          acc[dateKey] = { date: dateKey, sites: {} };
        }
        acc[dateKey].sites[item.site] = {
          staff: item.staff_count,
          children: item.children_present
        };
        return acc;
      }, {});

      const staffData = Object.values(groupedByDate).map((item: any) => {
        const result = { day: new Date(item.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }) };
        Object.keys(item.sites).forEach(site => {
          result[site.replace(/\s+/g, '')] = item.sites[site].staff;
        });
        return result;
      });

      const childData = Object.values(groupedByDate).map((item: any) => {
        const result = { day: new Date(item.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }) };
        Object.keys(item.sites).forEach(site => {
          result[site.replace(/\s+/g, '')] = item.sites[site].children;
        });
        return result;
      });

      return { staffData, childData };
    } else {
      // Filter by selected site
      const selectedSiteName = sites.find(s => s.id === selectedSite)?.name;
      const siteData = last15Records.filter(item => item.site === selectedSiteName);
      
      const staffData = siteData.map(item => ({
        day: new Date(item.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
        attendance: item.staff_count
      }));

      const childData = siteData.map(item => ({
        day: new Date(item.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
        attendance: item.children_present
      }));

      return { staffData, childData };
    }
  };

  // Calculate today's totals based on selected site
  const getTodayTotals = () => {
    if (!enrollmentData) return { staff: 0, children: 0 };
    
    const mostRecentDate = enrollmentData.reduce((latest, item) => {
      return new Date(item.date) > new Date(latest) ? item.date : latest;
    }, enrollmentData[0].date);
    
    let relevantData = enrollmentData.filter(item => item.date === mostRecentDate);
    
    if (selectedSite !== 'all') {
      const selectedSiteName = sites.find(s => s.id === selectedSite)?.name;
      relevantData = relevantData.filter(item => item.site === selectedSiteName);
    }
    
    return relevantData.reduce((acc, item) => {
      acc.staff += item.staff_count;
      acc.children += item.children_present;
      return acc;
    }, { staff: 0, children: 0 });
  };

  const { occupancyData, currentOccupancy, plannedCapacity } = getCurrentOccupancyData();
  const { staffData, childData } = processChartData();
  const todayTotals = getTodayTotals();
  const currentSiteName = sites.find(s => s.id === selectedSite)?.name || 'All Sites';

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            Enrollment & Attendance
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedSite} onValueChange={setSelectedSite}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select Site" />
              </SelectTrigger>
              <SelectContent>
                {sites.map((site) => (
                  <SelectItem key={site.id} value={site.id}>
                    {site.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetailedCharts(!showDetailedCharts)}
              disabled={!enrollmentData || enrollmentData.length === 0}
            >
              {showDetailedCharts ? 'Hide Charts' : 'View Charts'}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!enrollmentData || enrollmentData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No enrollment and attendance data available.</p>
            <p className="text-sm mt-2">Data will appear here once attendance is recorded.</p>
          </div>
        ) : !showDetailedCharts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <OccupancyChart
              occupancyData={occupancyData}
              currentOccupancy={currentOccupancy}
              plannedCapacity={plannedCapacity}
              siteName={currentSiteName}
            />
            <EnrollmentSummary
              todayTotals={todayTotals}
              siteName={currentSiteName}
            />
          </div>
        ) : (
          <AttendanceCharts
            staffData={staffData}
            childData={childData}
            siteName={currentSiteName}
            selectedSite={selectedSite}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default EnrollmentAttendance;
