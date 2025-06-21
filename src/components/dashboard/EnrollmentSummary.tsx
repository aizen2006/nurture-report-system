
import React from 'react';

interface EnrollmentSummaryProps {
  todayTotals: {
    staff: number;
    children: number;
  };
  siteName: string;
}

const EnrollmentSummary = ({ todayTotals, siteName }: EnrollmentSummaryProps) => {
  return (
    <div className="space-y-2">
      <h4 className="font-medium text-sm text-gray-700">
        Daily Attendance Overview - {siteName}
      </h4>
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
  );
};

export default EnrollmentSummary;
