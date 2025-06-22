
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import OccupancyChart from './OccupancyChart';
import EnrollmentSummary from './EnrollmentSummary';
import AttendanceCharts from './AttendanceCharts';

const EnrollmentAttendance = () => {
  const [selectedSite, setSelectedSite] = useState('all');
  const [showDetailedCharts, setShowDetailedCharts] = useState(false);
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());

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

  // Get date range based on view mode and current date
  const getDateRange = () => {
    const now = new Date(currentDate);
    
    if (viewMode === 'week') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay()); // Start from Sunday
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return { start: startOfWeek, end: endOfWeek };
    } else {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return { start: startOfMonth, end: endOfMonth };
    }
  };

  // Filter data by date range
  const filterDataByDateRange = (data: any[]) => {
    if (!data) return [];
    const { start, end } = getDateRange();
    return data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= start && itemDate <= end;
    });
  };

  // Navigate to previous/next period
  const navigatePeriod = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  // Get current period display text
  const getPeriodText = () => {
    const { start, end } = getDateRange();
    if (viewMode === 'week') {
      return `${start.toLocaleDateString('en', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else {
      return start.toLocaleDateString('en', { month: 'long', year: 'numeric' });
    }
  };

  // Get current occupancy data based on selected site and date range
  const getCurrentOccupancyData = () => {
    if (!enrollmentData || enrollmentData.length === 0) {
      return { 
        occupancyData: [
          { name: 'Occupied', value: 0, color: '#3b82f6' },
          { name: 'Available', value: 0, color: '#93c5fd' }
        ], 
        currentOccupancy: 0, 
        plannedCapacity: 0 
      };
    }

    const filteredData = filterDataByDateRange(enrollmentData);
    
    if (selectedSite === 'all') {
      // Get the most recent date's data from filtered range
      if (filteredData.length === 0) {
        return { 
          occupancyData: [
            { name: 'Occupied', value: 0, color: '#3b82f6' },
            { name: 'Available', value: 0, color: '#93c5fd' }
          ], 
          currentOccupancy: 0, 
          plannedCapacity: 0 
        };
      }
      
      const mostRecentDate = filteredData.reduce((latest, item) => {
        return new Date(item.date) > new Date(latest) ? item.date : latest;
      }, filteredData[0].date);

      const todayData = filteredData.filter(item => item.date === mostRecentDate);
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
      const siteData = filteredData.filter(item => item.site === selectedSiteName);
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

    const filteredData = filterDataByDateRange(enrollmentData);
    const sortedData = filteredData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (selectedSite === 'all') {
      // Group by date and aggregate by site
      const groupedByDate = sortedData.reduce((acc, item) => {
        const dateKey = item.date;
        if (!acc[dateKey]) {
          acc[dateKey] = { date: dateKey, sites: {} };
        }
        if (!acc[dateKey].sites[item.site]) {
          acc[dateKey].sites[item.site] = { staff: 0, children: 0 };
        }
        acc[dateKey].sites[item.site].staff += item.staff_count;
        acc[dateKey].sites[item.site].children += item.children_present;
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
      const siteData = sortedData.filter(item => item.site === selectedSiteName);
      
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

  // Calculate totals based on selected site and date range
  const getTodayTotals = () => {
    if (!enrollmentData) return { staff: 0, children: 0 };
    
    const filteredData = filterDataByDateRange(enrollmentData);
    
    if (filteredData.length === 0) return { staff: 0, children: 0 };
    
    const mostRecentDate = filteredData.reduce((latest, item) => {
      return new Date(item.date) > new Date(latest) ? item.date : latest;
    }, filteredData[0].date);
    
    let relevantData = filteredData.filter(item => item.date === mostRecentDate);
    
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
        
        {showDetailedCharts && (
          <div className="flex items-center justify-between mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Select value={viewMode} onValueChange={(value: 'week' | 'month') => setViewMode(value)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" onClick={() => navigatePeriod('prev')}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="px-3 py-1 bg-white rounded border min-w-[200px] text-center text-sm">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  {getPeriodText()}
                </div>
                <Button variant="outline" size="sm" onClick={() => navigatePeriod('next')}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
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
