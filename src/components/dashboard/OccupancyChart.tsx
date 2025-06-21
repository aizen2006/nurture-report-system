
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface OccupancyChartProps {
  occupancyData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  currentOccupancy: number;
  plannedCapacity: number;
  siteName: string;
}

const OccupancyChart = ({ occupancyData, currentOccupancy, plannedCapacity, siteName }: OccupancyChartProps) => {
  return (
    <div className="space-y-2">
      <h4 className="font-medium text-sm text-gray-700">
        Available vs Planned Occupancy - {siteName}
      </h4>
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
  );
};

export default OccupancyChart;
