
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface AttendanceChartsProps {
  staffData: any[];
  childData: any[];
  siteName: string;
  selectedSite: string;
}

const AttendanceCharts = ({ staffData, childData, siteName, selectedSite }: AttendanceChartsProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-700">
            Staff Attendance - {siteName}
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            {selectedSite === 'all' && staffData.length > 0 ? (
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
            Children Attendance - {siteName}
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            {selectedSite === 'all' && childData.length > 0 ? (
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
  );
};

export default AttendanceCharts;
