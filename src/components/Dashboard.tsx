
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  Shield, 
  TrendingUp, 
  Calendar,
  Clock,
  FileText,
  Activity
} from 'lucide-react';

const Dashboard = () => {
  // Mock data for demonstration
  const complianceData = {
    overall: 85,
    managers: 92,
    deputies: 88,
    roomLeaders: 82,
    areaManagers: 78
  };

  const recentEntries = [
    { role: 'Manager', location: 'Main Branch', status: 'complete', time: '2 hours ago' },
    { role: 'Deputy Manager', location: 'South Branch', status: 'pending', time: '4 hours ago' },
    { role: 'Room Leader', location: 'Main Branch', status: 'complete', time: '6 hours ago' },
    { role: 'Area Manager', location: 'All Locations', status: 'complete', time: '1 day ago' }
  ];

  const alerts = [
    { type: 'safeguarding', message: 'Safeguarding concern reported - Room 2', severity: 'high' },
    { type: 'staffing', message: '2 staff absences reported today', severity: 'medium' },
    { type: 'maintenance', message: 'Fire drill due this week', severity: 'low' }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Compliance</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{complianceData.overall}%</div>
            <Progress value={complianceData.overall} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Reports</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">7</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff on Duty</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">Across all locations</p>
          </CardContent>
        </Card>
      </div>

      {/* Compliance by Role */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance by Role</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { role: 'Managers', percentage: complianceData.managers, icon: Users },
              { role: 'Deputy Managers', percentage: complianceData.deputies, icon: Shield },
              { role: 'Room Leaders', percentage: complianceData.roomLeaders, icon: Calendar },
              { role: 'Area Managers', percentage: complianceData.areaManagers, icon: Activity }
            ].map((item) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEntries.map((entry, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      entry.status === 'complete' ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium">{entry.role}</p>
                      <p className="text-xs text-gray-500">{entry.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={entry.status === 'complete' ? 'default' : 'secondary'}>
                      {entry.status}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">{entry.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts & Issues */}
        <Card>
          <CardHeader>
            <CardTitle>Alerts & Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
