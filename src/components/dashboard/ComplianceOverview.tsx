
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';

interface ComplianceItem {
  name: string;
  status: 'compliant' | 'pending' | 'non-compliant';
  expiryDate?: string;
}

const ComplianceOverview = () => {
  const complianceItems: ComplianceItem[] = [
    { name: 'Fire Safety', status: 'compliant' },
    { name: 'First Aid', status: 'non-compliant' },
    { name: 'Health & Safety', status: 'pending', expiryDate: '2025-07-15' },
    { name: 'Food Hygiene', status: 'compliant' },
    { name: 'Safeguarding', status: 'compliant' },
    { name: 'DBS Checks', status: 'pending', expiryDate: '2025-08-20' }
  ];

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

  const expiringItems = complianceItems.filter(item => item.expiryDate);
  const overallCompliance = Math.round((complianceItems.filter(item => item.status === 'compliant').length / complianceItems.length) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          Compliance Overview
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
              </div>
              {getStatusBadge(item.status)}
            </div>
          ))}
        </div>

        {expiringItems.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Expiring Licenses
            </h4>
            {expiringItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                <span className="text-sm">{item.name}</span>
                <span className="text-xs text-yellow-800">Expires: {item.expiryDate}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComplianceOverview;
