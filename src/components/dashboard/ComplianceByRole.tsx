
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Users, Shield, Calendar, Activity } from 'lucide-react';

interface ComplianceData {
  overall: number;
  managers: number;
  deputies: number;
  roomLeaders: number;
  areaManagers: number;
}

interface ComplianceByRoleProps {
  complianceData: ComplianceData;
}

const ComplianceByRole = ({ complianceData }: ComplianceByRoleProps) => {
  const roleItems = [
    { role: 'Managers', percentage: complianceData.managers, icon: Users },
    { role: 'Deputy Managers', percentage: complianceData.deputies, icon: Shield },
    { role: 'Room Leaders', percentage: complianceData.roomLeaders, icon: Calendar },
    { role: 'Area Managers', percentage: complianceData.areaManagers, icon: Activity }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance by Role</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {roleItems.map((item) => (
            <div key={item.role} className="flex items-center space-x-4">
              <item.icon className="h-5 w-5 text-gray-500" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{item.role}</span>
                  <span className="text-sm text-gray-500">{item.percentage}%</span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplianceByRole;
