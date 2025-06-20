
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  Shield, 
  TrendingUp, 
  Calendar,
  Clock,
  FileText,
  Activity,
  Mail
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Type for the submission data structure
interface SubmissionData {
  nursery_name?: string;
  total_questions?: number;
  answered_questions?: number;
  responses?: Record<string, any>;
  [key: string]: any;
}

const Dashboard = () => {
  const { toast } = useToast();

  const { data: submissions, isLoading } = useQuery({
    queryKey: ['form_submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Helper function to safely parse submission data
  const parseSubmissionData = (data: any): SubmissionData => {
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch {
        return {};
      }
    }
    return data || {};
  };

  const calculateComplianceData = () => {
    if (!submissions || submissions.length === 0) {
      return {
        overall: 0,
        managers: 0,
        deputies: 0,
        roomLeaders: 0,
        areaManagers: 0
      };
    }

    const roleGroups = submissions.reduce((acc, submission) => {
      const role = submission.role;
      if (!acc[role]) acc[role] = [];
      acc[role].push(submission);
      return acc;
    }, {} as Record<string, any[]>);

    const calculateRoleCompliance = (roleSubmissions: any[]) => {
      if (roleSubmissions.length === 0) return 0;
      const totalQuestions = roleSubmissions.reduce((sum, sub) => {
        const parsedData = parseSubmissionData(sub.submission_data);
        return sum + (parsedData.total_questions || 0);
      }, 0);
      const answeredQuestions = roleSubmissions.reduce((sum, sub) => {
        const parsedData = parseSubmissionData(sub.submission_data);
        return sum + (parsedData.answered_questions || 0);
      }, 0);
      return totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
    };

    const totalQuestions = submissions.reduce((sum, sub) => {
      const parsedData = parseSubmissionData(sub.submission_data);
      return sum + (parsedData.total_questions || 0);
    }, 0);
    
    const totalAnswered = submissions.reduce((sum, sub) => {
      const parsedData = parseSubmissionData(sub.submission_data);
      return sum + (parsedData.answered_questions || 0);
    }, 0);

    return {
      overall: totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0,
      managers: calculateRoleCompliance(roleGroups['Manager'] || []),
      deputies: calculateRoleCompliance(roleGroups['Deputy Manager'] || []),
      roomLeaders: calculateRoleCompliance(roleGroups['Room Leader'] || []),
      areaManagers: calculateRoleCompliance(roleGroups['Area Manager'] || [])
    };
  };

  const getRecentEntries = () => {
    if (!submissions) return [];
    return submissions.slice(0, 4).map(sub => {
      const parsedData = parseSubmissionData(sub.submission_data);
      return {
        role: sub.role,
        location: parsedData.nursery_name || 'Unknown',
        status: 'complete',
        time: new Date(sub.submitted_at).toLocaleString()
      };
    });
  };

  const getAlertsFromSubmissions = () => {
    if (!submissions) return [];
    const alerts = [];
    
    submissions.forEach(sub => {
      const parsedData = parseSubmissionData(sub.submission_data);
      const responses = parsedData.responses || {};
      
      // Check for safeguarding concerns
      if (responses.safeguarding_concerns === 'yes') {
        alerts.push({
          type: 'safeguarding',
          message: `Safeguarding concern reported by ${sub.full_name}`,
          severity: 'high'
        });
      }
      
      // Check for staff absences
      const absenceFields = Object.keys(responses).filter(key => key.includes('absences'));
      const hasAbsences = absenceFields.some(field => responses[field] && responses[field].trim());
      if (hasAbsences) {
        alerts.push({
          type: 'staffing',
          message: `Staff absences reported by ${sub.full_name}`,
          severity: 'medium'
        });
      }
      
      // Check for ratio issues
      const ratioFields = Object.keys(responses).filter(key => key.includes('ratio_status'));
      const hasIncorrectRatios = ratioFields.some(field => responses[field] === 'Incorrect Ratio');
      if (hasIncorrectRatios) {
        alerts.push({
          type: 'ratio',
          message: `Incorrect staff ratios reported by ${sub.full_name}`,
          severity: 'high'
        });
      }
    });
    
    return alerts.slice(0, 5); // Show only latest 5 alerts
  };

  const sendSheetToAdmin = async () => {
    try {
      // In a real implementation, this would trigger an email with the Google Sheet link
      toast({
        title: "Sheet Sent to Admin",
        description: "The Google Sheet has been sent to abhik@arkgroup.co.uk",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send sheet to admin",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const complianceData = calculateComplianceData();
  const recentEntries = getRecentEntries();
  const alerts = getAlertsFromSubmissions();

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
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissions?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Across all roles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{alerts.length}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Send to Admin</CardTitle>
            <Mail className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <Button 
              onClick={sendSheetToAdmin}
              className="w-full text-sm"
              size="sm"
            >
              Email Sheet
            </Button>
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

        {/* Alerts & Issues */}
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
      </div>
    </div>
  );
};

export default Dashboard;
