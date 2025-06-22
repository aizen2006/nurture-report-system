
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  FileText, 
  Download,
  Database,
  ChevronDown,
  Calendar
} from 'lucide-react';

interface KeyMetricsProps {
  totalSubmissions: number;
  onDownloadFormSubmissions: () => void;
  onDownloadStaffRatios: () => void;
  onDownloadEnrollmentAttendance: () => void;
  onDownloadRoomPlanner: () => void;
  onDownloadAll: () => void;
  isDownloading: boolean;
  hasData: boolean;
}

const KeyMetrics = ({ 
  totalSubmissions, 
  onDownloadFormSubmissions,
  onDownloadStaffRatios,
  onDownloadEnrollmentAttendance,
  onDownloadRoomPlanner,
  onDownloadAll,
  isDownloading, 
  hasData 
}: KeyMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <CardTitle className="text-sm font-medium">Export Data</CardTitle>
          <Download className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
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
                    <Database className="h-3 w-3 mr-2" />
                    Export Data
                    <ChevronDown className="h-3 w-3 ml-2" />
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white border border-gray-200 shadow-lg z-50">
              <DropdownMenuItem 
                onClick={onDownloadFormSubmissions}
                disabled={isDownloading}
                className="cursor-pointer hover:bg-gray-100"
              >
                <FileText className="h-4 w-4 mr-2" />
                Form Submissions
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onDownloadStaffRatios}
                disabled={isDownloading}
                className="cursor-pointer hover:bg-gray-100"
              >
                <Database className="h-4 w-4 mr-2" />
                Staff-Child Ratios
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onDownloadEnrollmentAttendance}
                disabled={isDownloading}
                className="cursor-pointer hover:bg-gray-100"
              >
                <Database className="h-4 w-4 mr-2" />
                Enrollment & Attendance
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onDownloadRoomPlanner}
                disabled={isDownloading}
                className="cursor-pointer hover:bg-gray-100"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Room Planner
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onDownloadAll}
                disabled={isDownloading}
                className="cursor-pointer hover:bg-gray-100 font-semibold"
              >
                <Download className="h-4 w-4 mr-2" />
                All Data (Google Sheets)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {!hasData && (
            <p className="text-xs text-muted-foreground mt-1">No data available</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Choose data to export
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default KeyMetrics;
