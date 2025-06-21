
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

interface Alert {
  type: string;
  message: string;
  severity: string;
}

interface AlertsIssuesProps {
  alerts: Alert[];
}

const AlertsIssues = ({ alerts }: AlertsIssuesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alerts & Issues</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.length > 0 ? alerts.map((alert, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
              <AlertTriangle className={`h-4 w-4 mt-0.5 ${
                alert.severity === 'high' ? 'text-red-500' : 
                alert.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm">{alert.message}</p>
                <Badge variant="outline" className="mt-1 text-xs">
                  {alert.severity} priority
                </Badge>
              </div>
            </div>
          )) : (
            <p className="text-sm text-gray-500">No active alerts</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsIssues;
