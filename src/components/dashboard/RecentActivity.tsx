
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RecentEntry {
  role: string;
  location: string;
  status: string;
  time: string;
}

interface RecentActivityProps {
  recentEntries: RecentEntry[];
}

const RecentActivity = ({ recentEntries }: RecentActivityProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentEntries.length > 0 ? recentEntries.map((entry, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div>
                  <p className="text-sm font-medium">{entry.role}</p>
                  <p className="text-xs text-gray-500">{entry.location}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="default">complete</Badge>
                <p className="text-xs text-gray-500 mt-1">{entry.time}</p>
              </div>
            </div>
          )) : (
            <p className="text-sm text-gray-500">No recent submissions</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
