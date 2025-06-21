
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';

const EnrollmentAttendance = () => {
  const [selectedSite, setSelectedSite] = useState('all');
  const [showDetailedCharts, setShowDetailedCharts] = useState(false);

  const sites = [
    { id: 'all', name: 'All Sites' },
    { id: 'site-a', name: 'Site A' },
    { id: 'site-b', name: 'Site B' },
    { id: 'site-c', name: 'Site C' }
  ];

  const occupancyData = [
    { name: 'Occupied', value: 85, color: '#3b82f6' },
    { name: 'Available', value: 15, color: '#93c5fd' }
  ];

  const staffAttendanceData = [
    { day: 'Mon', siteA: 12, siteB: 8, siteC: 15 },
    { day: 'Tue', siteA: 11, siteB: 9, siteC: 14 },
    { day: 'Wed', siteA: 13, siteB: 7, siteC: 16 },
    { day: 'Thu', siteA: 12, siteB: 8, siteC: 15 },
    { day: 'Fri', siteA: 10, siteB: 9, siteC: 13 }
  ];

  const childAttendanceData = [
    { day: 'Mon', siteA: 68, siteB: 45, siteC: 92 },
    { day: 'Tue', siteA: 72, siteB: 48, siteC: 88 },
    { day: 'Wed', siteA: 65, siteB: 42, siteC: 95 },
    { day: 'Thu', siteA: 70, siteB: 46, siteC: 90 },
    { day: 'Fri', siteA: 75, siteB: 50, siteC: 85 }
  ];

  const waitlistCount = 12;
  const plannedCapacity = 100;
  const currentOccupancy = 85;

  const filteredStaffData = selectedSite === 'all' ? staffAttendanceData : 
    staffAttendanceData.map(item => ({
      day: item.day,
      attendance: selectedSite === 'site-a' ? item.siteA : 
                 selectedSite === 'site-b' ? item.siteB : item.siteC
    }));

  const filteredChildData = selectedSite === 'all' ? childAttendanceData : 
    childAttendanceData.map(item => ({
      day: item.day,
      attendance: selectedSite === 'site-a' ? item.siteA : 
                 selectedSite === 'site-b' ? item.siteB : item.siteC
    }));

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
            >
              {showDetailedCharts ? 'Hide Charts' : 'View Charts'}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!showDetailedCharts ? (
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
                <div className="text-lg font-semibold text-orange-600">
                  Waitlist: {waitlistCount}
                </div>
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
                    <div className="text-xl font-bold">24</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-semibold text-green-600">Children Today</div>
                    <div className="text-xl font-bold">78</div>
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
                    <BarChart data={filteredStaffData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="siteA" fill="#3b82f6" name="Site A" />
                      <Bar dataKey="siteB" fill="#10b981" name="Site B" />
                      <Bar dataKey="siteC" fill="#f59e0b" name="Site C" />
                    </BarChart>
                  ) : (
                    <LineChart data={filteredStaffData}>
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
                    <BarChart data={filteredChildData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="siteA" fill="#3b82f6" name="Site A" />
                      <Bar dataKey="siteB" fill="#10b981" name="Site B" />
                      <Bar dataKey="siteC" fill="#f59e0b" name="Site C" />
                    </BarChart>
                  ) : (
                    <LineChart data={filteredChildData}>
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
