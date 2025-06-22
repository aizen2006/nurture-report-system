
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, XCircle, Clock, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { parseSubmissionData } from './utils/dataProcessing';

interface ComplianceItem {
  name: string;
  status: 'compliant' | 'pending' | 'non-compliant';
  expiryDate?: string;
  count?: number;
  total?: number;
}

const ComplianceOverview = () => {
  const { data: submissions, isLoading } = useQuery({
    queryKey: ['form_submissions_compliance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const calculateComplianceItems = (): ComplianceItem[] => {
    if (!submissions || submissions.length === 0) {
      return [
        { name: 'Fire Safety', status: 'pending' },
        { name: 'First Aid', status: 'pending' },
        { name: 'Staff Training', status: 'pending' },
        { name: 'Safeguarding', status: 'pending' }
      ];
    }

    const fireSafety = submissions.filter(sub => {
      const data = parseSubmissionData(sub.submission_data);
      return data.responses?.fire_safety_check === 'yes';
    });

    const firstAid = submissions.filter(sub => {
      const data = parseSubmissionData(sub.submission_data);
      return data.responses?.first_aid_certified === 'yes';
    });

    const staffTraining = submissions.filter(sub => {
      const data = parseSubmissionData(sub.submission_data);
      return data.responses?.staff_training_complete === 'yes';
    });

    const safeguarding = submissions.filter(sub => {
      const data = parseSubmissionData(sub.submission_data);
      return data.responses?.safeguarding_concerns === 'no';
    });

    const getStatus = (compliant: number, total: number): 'compliant' | 'pending' | 'non-compliant' => {
      const percentage = (compliant / total) * 100;
      if (percentage >= 80) return 'compliant';
      if (percentage >= 50) return 'pending';
      return 'non-compliant';
    };

    return [
      { 
        name: 'Fire Safety', 
        status: getStatus(fireSafety.length, submissions.length),
        count: fireSafety.length,
        total: submissions.length
      },
      { 
        name: 'First Aid', 
        status: getStatus(firstAid.length, submissions.length),
        count: firstAid.length,
        total: submissions.length
      },
      { 
        name: 'Staff Training', 
        status: getStatus(staffTraining.length, submissions.length),
        count: staffTraining.length,
        total: submissions.length
      },
      { 
        name: 'Safeguarding', 
        status: getStatus(safeguarding.length, submissions.length),
        count: safeguarding.length,
        total: submissions.length
      }
    ];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'non-compliant':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant':
        return <Badge className="bg-green-100 text-green-800">Compliant</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'non-compliant':
        return <Badge className="bg-red-100 text-red-800">Non-Compliant</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            Compliance Overview
            <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
              <Info className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const complianceItems = calculateComplianceItems();
  const overallCompliance = complianceItems.length > 0 
    ? Math.round((complianceItems.filter(item => item.status === 'compliant').length / complianceItems.length) * 100)
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          Compliance Overview
          <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
            <Info className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Overall Compliance</span>
          <span className="text-2xl font-bold text-green-600">{overallCompliance}%</span>
        </div>
        <Progress value={overallCompliance} className="h-2" />
        
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-gray-700">Checklist Items</h4>
          {complianceItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(item.status)}
                <span className="text-sm">{item.name}</span>
                {item.count !== undefined && (
                  <span className="text-xs text-gray-500">({item.count}/{item.total})</span>
                )}
              </div>
              {getStatusBadge(item.status)}
            </div>
          ))}
        </div>

        {!submissions || submissions.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <p className="text-sm">No compliance data available.</p>
            <p className="text-xs mt-1">Data will appear here once forms are submitted.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComplianceOverview;
