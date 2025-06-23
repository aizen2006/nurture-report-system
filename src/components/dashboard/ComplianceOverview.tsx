
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';
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
  const [showInfo, setShowInfo] = useState(false);

  const { data: submissions, isLoading, error } = useQuery({
    queryKey: ['form_submissions_compliance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching compliance data:', error);
        throw error;
      }
      return data;
    },
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
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

    try {
      // Count submissions with positive compliance indicators
      const complianceChecks = submissions.reduce((acc, sub) => {
        const data = parseSubmissionData(sub.submission_data);
        const responses = data.responses || {};
        
        // Check various compliance fields that might exist in responses
        if (responses.fire_safety_check === 'yes' || 
            responses.fire_safety === 'completed' ||
            responses.safety_check === 'yes') {
          acc.fireSafety++;
        }
        
        if (responses.first_aid_certified === 'yes' || 
            responses.first_aid_training === 'completed' ||
            responses.first_aid === 'yes') {
          acc.firstAid++;
        }
        
        if (responses.staff_training_complete === 'yes' || 
            responses.training_completed === 'yes' ||
            responses.staff_training === 'completed') {
          acc.staffTraining++;
        }
        
        if (responses.safeguarding_concerns === 'no' || 
            responses.safeguarding_training === 'completed' ||
            responses.safeguarding_check === 'yes') {
          acc.safeguarding++;
        }
        
        acc.total++;
        return acc;
      }, { fireSafety: 0, firstAid: 0, staffTraining: 0, safeguarding: 0, total: 0 });

      const getStatus = (compliant: number, total: number): 'compliant' | 'pending' | 'non-compliant' => {
        if (total === 0) return 'pending';
        const percentage = (compliant / total) * 100;
        if (percentage >= 80) return 'compliant';
        if (percentage >= 50) return 'pending';
        return 'non-compliant';
      };

      return [
        { 
          name: 'Fire Safety', 
          status: getStatus(complianceChecks.fireSafety, complianceChecks.total),
          count: complianceChecks.fireSafety,
          total: complianceChecks.total
        },
        { 
          name: 'First Aid', 
          status: getStatus(complianceChecks.firstAid, complianceChecks.total),
          count: complianceChecks.firstAid,
          total: complianceChecks.total
        },
        { 
          name: 'Staff Training', 
          status: getStatus(complianceChecks.staffTraining, complianceChecks.total),
          count: complianceChecks.staffTraining,
          total: complianceChecks.total
        },
        { 
          name: 'Safeguarding', 
          status: getStatus(complianceChecks.safeguarding, complianceChecks.total),
          count: complianceChecks.safeguarding,
          total: complianceChecks.total
        }
      ];
    } catch (error) {
      console.error('Error calculating compliance items:', error);
      return [
        { name: 'Fire Safety', status: 'pending' },
        { name: 'First Aid', status: 'pending' },
        { name: 'Staff Training', status: 'pending' },
        { name: 'Safeguarding', status: 'pending' }
      ];
    }
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
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            Compliance Overview
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1 h-6 w-6"
              onClick={() => setShowInfo(!showInfo)}
            >
              <Info className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600">Failed to load compliance data</p>
            <p className="text-sm text-gray-500 mt-1">Please check your connection and try again</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            Compliance Overview
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1 h-6 w-6"
              onClick={() => setShowInfo(!showInfo)}
            >
              <Info className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            <span className="ml-2 text-gray-600">Loading compliance data...</span>
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
    <Card className="relative">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          Compliance Overview
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1 h-6 w-6"
            onClick={() => setShowInfo(!showInfo)}
          >
            <Info className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showInfo && (
          <div className="absolute top-2 right-2 bg-white border rounded-lg p-4 shadow-lg z-10 max-w-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-sm">Compliance Overview</h4>
              <Button variant="ghost" size="sm" className="p-0 h-6 w-6" onClick={() => setShowInfo(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-600">
              This section tracks compliance across key areas including fire safety, first aid certification, 
              staff training completion, and safeguarding protocols. Data is based on form submissions and 
              calculated as a percentage of completed requirements.
            </p>
          </div>
        )}
        
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
                {item.count !== undefined && item.total !== undefined && (
                  <span className="text-xs text-gray-500">({item.count}/{item.total})</span>
                )}
              </div>
              {getStatusBadge(item.status)}
            </div>
          ))}
        </div>

        {(!submissions || submissions.length === 0) && (
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
