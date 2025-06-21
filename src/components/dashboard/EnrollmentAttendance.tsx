
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

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

  // Calculate current occupancy data
  const latestData = enrollmentData?.[0];
  const currentOccupancy = latestData?.children_present || 0;
  const plannedCapacity = latestData?.planned_capacity || 100;
  const occupancyData = [
    { name: 'Occupied', value: currentOccupancy, color: '#3b82f6' },
    { name: 'Available', value: Math.max(0, plannedCapacity - currentOccupancy), color: '#93c5fd' }
  ];

  // Process data for charts
  const processChartData = () => {
    if (!enrollmentData) return { staffData: [], childData: [] };

    const last5Days = enrollmentData.slice(0, 5).reverse();
    
    if (selectedSite === 'all') {
      // Group by date and aggregate by site
      const groupedData = last5Days.reduce((acc: any, item) => {
        const date = new Date(item.date).toLocaleDateString('en', { weekday: 'short' });
        if (!acc[date]) {
          acc[date] = { day: date, sites: {} };
        }
        acc[date].sites[item.site] = {
          staff: item.staff_count,
          children: item.children_present
        };
        return acc;
      }, {});

      const staffData = Object.values(groupedData).map((item: any) => ({
        day: item.day,
        ...Object.keys(item.sites).reduce((acc: any, site) => {
          acc[site.replace(/\s+/g, '')] = item.sites[site].staff;
          return acc;
        }, {})
      }));

      const childData = Object.values(groupedData).map((item: any) => ({
        day: item.day,
        ...Object.keys(item.sites).reduce((acc: any, site) => {
          acc[site.replace(/\s+/g, '')] = item.sites[site].children;
          return acc;
        }, {})
      }));

      return { staffData, childData };
    } else {
      // Filter by selected site
      const selectedSiteName = sites.find(s => s.id === selectedSite)?.name;
      const siteData = last5Days.filter(item => item.site === selectedSiteName);
      
      const staffData = siteData.map(item => ({
        day: new Date(item.date).toLocaleDateString('en', { weekday: 'short' }),
        attendance: item.staff_count
      }));

      const childData = siteData.map(item => ({
        day: new Date(item.date).toLocaleDateString('en', { weekday: 'short' }),
        attendance: item.children_present
      }));

      return { staffData, childData };
    }
  };

  const { staffData, childData } = processChartData();

  // Calculate today's totals
  const todayTotals = enrollmentData?.reduce((acc, item) => {
    const today = new Date().toDateString();
    const itemDate = new Date(item.date).toDateString();
    if (itemDate === today) {
      acc.staff += item.staff_count;
      acc.children += item.children_present;
    }
    return acc;
  }, { staff: 0, children: 0 }) || { staff: 0, children: 0 };

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
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700">Available vs Planned Occupancy</h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={occupancyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {occupancyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Occupied ({currentOccupancy})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
                  <span>Available ({plannedCapacity - currentOccupancy})</span>
                </div>
              </div>
              <div className="text-center mt-4">
                <div className="text-sm text-gray-500">
                  Planned Capacity: {plannedCapacity}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700">Daily Attendance Overview</h4>
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Click "View Charts" to see detailed attendance data</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-semibold text-blue-600">Staff Today</div>
                    <div className="text-xl font-bold">{todayTotals.staff}</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-semibold text-green-600">Children Today</div>
                    <div className="text-xl font-bold">{todayTotals.children}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-700">
                  Staff Attendance - {sites.find(s => s.id === selectedSite)?.name}
                </h4>
                <ResponsiveContainer width="100%" height={250}>
                  {selectedSite === 'all' ? (
                    <BarChart data={staffData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      {Object.keys(staffData[0] || {}).filter(key => key !== 'day').map((site, index) => (
                        <Bar 
                          key={site} 
                          dataKey={site} 
                          fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][index % 4]} 
                          name={site}
                        />
                      ))}
                    </BarChart>
                  ) : (
                    <LineChart data={staffData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="attendance" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-700">
                  Children Attendance - {sites.find(s => s.id === selectedSite)?.name}
                </h4>
                <ResponsiveContainer width="100%" height={250}>
                  {selectedSite === 'all' ? (
                    <BarChart data={childData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      {Object.keys(childData[0] || {}).filter(key => key !== 'day').map((site, index) => (
                        <Bar 
                          key={site} 
                          dataKey={site} 
                          fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][index % 4]} 
                          name={site}
                        />
                      ))}
                    </BarChart>
                  ) : (
                    <LineChart data={childData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="attendance" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnrollmentAttendance;
