
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Users, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

const StaffChildRatio = () => {
  const [showInfo, setShowInfo] = useState(false);

  const { data: ratios, isLoading, error } = useQuery({
    queryKey: ['staff_child_ratios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff_child_ratios')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('correct') || statusLower.includes('compliant')) {
      return <Badge className="bg-green-100 text-green-800">Compliant</Badge>;
    } else if (statusLower.includes('incorrect') || statusLower.includes('non-compliant')) {
      return <Badge className="bg-red-100 text-red-800">Non-Compliant</Badge>;
    } else {
      return <Badge className="bg-yellow-100 text-yellow-800">Review</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('correct') || statusLower.includes('compliant')) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else {
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            Staff-Child Ratios
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
            <p className="text-red-600">Failed to load ratio data</p>
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
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            Staff-Child Ratios
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
            <span className="ml-2 text-gray-600">Loading ratio data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const compliantRatios = ratios?.filter(ratio => 
    ratio.status.toLowerCase().includes('correct') || 
    ratio.status.toLowerCase().includes('compliant')
  ).length || 0;
  
  const totalRatios = ratios?.length || 0;
  const compliancePercentage = totalRatios > 0 ? Math.round((compliantRatios / totalRatios) * 100) : 0;

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded"></div>
          Staff-Child Ratios
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
              <h4 className="font-medium text-sm">Staff-Child Ratios</h4>
              <Button variant="ghost" size="sm" className="p-0 h-6 w-6" onClick={() => setShowInfo(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-600">
              This section monitors staff-to-child ratios across all rooms and age groups to ensure 
              regulatory compliance. Shows current ratios, required ratios, and compliance status 
              based on the latest data from the staff_child_ratios table.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Overall Compliance</span>
          <span className="text-2xl font-bold text-orange-600">{compliancePercentage}%</span>
        </div>
        <Progress value={compliancePercentage} className="h-2" />

        <div className="space-y-3">
          <h4 className="font-medium text-sm text-gray-700">Room Status</h4>
          {ratios && ratios.length > 0 ? (
            ratios.slice(0, 5).map((ratio, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(ratio.status)}
                  <div>
                    <div className="font-medium text-sm">{ratio.room}</div>
                    <div className="text-xs text-gray-500">
                      {ratio.age_group} • {ratio.staff_count} staff : {ratio.children_count} children
                    </div>
                    <div className="text-xs text-gray-600">
                      Required: {ratio.required_ratio} | Actual: {ratio.actual_ratio}
                    </div>
                  </div>
                </div>
                {getStatusBadge(ratio.status)}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No ratio data available</p>
              <p className="text-xs mt-1">Data will appear here once submitted</p>
            </div>
          )}
        </div>

        {ratios && ratios.length > 5 && (
          <div className="text-center">
            <Button variant="outline" size="sm">
              View All Rooms ({ratios.length})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StaffChildRatio;
