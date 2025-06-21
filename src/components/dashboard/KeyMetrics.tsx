
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  FileText, 
  AlertTriangle,
  Download
} from 'lucide-react';

interface KeyMetricsProps {
  overallCompliance: number;
  totalSubmissions: number;
  activeAlerts: number;
  onDownload: () => void;
  isDownloading: boolean;
  hasData: boolean;
}

const KeyMetrics = ({ 
  overallCompliance, 
  totalSubmissions, 
  activeAlerts, 
  onDownload, 
  isDownloading, 
  hasData 
}: KeyMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overall Compliance</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{overallCompliance}%</div>
          <Progress value={overallCompliance} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
          <FileText className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSubmissions}</div>
          <p className="text-xs text-muted-foreground">Across all roles</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{activeAlerts}</div>
          <p className="text-xs text-muted-foreground">Requires attention</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Export Data</CardTitle>
          <Download className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <Button 
            onClick={onDownload}
            disabled={isDownloading || !hasData}
            className="w-full text-sm"
            size="sm"
          >
            {isDownloading ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <Download className="h-3 w-3 mr-2" />
                Export Data
              </>
            )}
          </Button>
          {!hasData && (
            <p className="text-xs text-muted-foreground mt-1">No data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KeyMetrics;
