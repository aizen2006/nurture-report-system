
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const EnrollmentAttendance = () => {
  const enrollmentData = [
    { name: 'Enrolled', value: 75, color: '#3b82f6' },
    { name: 'Capacity', value: 25, color: '#93c5fd' }
  ];

  const attendanceData = [
    { day: 'Mon', attendance: 68 },
    { day: 'Tue', attendance: 72 },
    { day: 'Wed', attendance: 65 },
    { day: 'Thu', attendance: 70 },
    { day: 'Fri', attendance: 75 },
    { day: 'Sat', attendance: 45 },
    { day: 'Sun', attendance: 35 }
  ];

  const waitlistCount = 12;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          Enrollment & Attendance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">Capacity vs Enrolled</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={enrollmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                >
                  {enrollmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Enrolled (75)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
                <span>Available (25)</span>
              </div>
            </div>
            <div className="text-center mt-4">
              <div className="text-lg font-semibold text-orange-600">
                Waitlist: {waitlistCount}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">Daily Attendance Trend</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={attendanceData}>
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
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnrollmentAttendance;
