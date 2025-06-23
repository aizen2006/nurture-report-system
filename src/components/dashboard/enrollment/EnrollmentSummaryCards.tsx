
import React from 'react';
import { Users, TrendingUp, Calendar } from 'lucide-react';

interface EnrollmentSummaryCardsProps {
  totalEnrolled: number;
  avgAttendance: number;
  activeSites: number;
}

const EnrollmentSummaryCards = ({ totalEnrolled, avgAttendance, activeSites }: EnrollmentSummaryCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-blue-900">Total Enrolled</span>
        </div>
        <div className="text-2xl font-bold text-blue-700 mt-1">
          {totalEnrolled}
        </div>
      </div>
      
      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          <span className="font-medium text-green-900">Avg Attendance</span>
        </div>
        <div className="text-2xl font-bold text-green-700 mt-1">
          {avgAttendance}%
        </div>
      </div>
      
      <div className="bg-orange-50 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-orange-600" />
          <span className="font-medium text-orange-900">Sites Active</span>
        </div>
        <div className="text-2xl font-bold text-orange-700 mt-1">
          {activeSites}
        </div>
      </div>
    </div>
  );
};

export default EnrollmentSummaryCards;
