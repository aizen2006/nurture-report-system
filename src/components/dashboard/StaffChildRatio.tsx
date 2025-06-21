
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

const StaffChildRatio = () => {
  const { data: ratioData, isLoading } = useQuery({
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

  const getStatusIcon = (status: string) => {
    return status === 'compliant' ? 
      <CheckCircle className="h-4 w-4 text-green-600" /> : 
      <XCircle className="h-4 w-4 text-red-600" />;
  };

  const getStatusBadge = (status: string) => {
    return status === 'compliant' ? 
      <Badge className="bg-green-100 text-green-800">✅</Badge> : 
      <Badge className="bg-red-100 text-red-800">❌</Badge>;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            Staff-to-Child Ratio
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          Staff-to-Child Ratio
        </CardTitle>
      </CardHeader>
      <CardContent>
        {ratioData && ratioData.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Branch</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Age Group</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead>Children</TableHead>
                <TableHead>Required</TableHead>
                <TableHead>Actual</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ratioData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.branch}</TableCell>
                  <TableCell>{row.room}</TableCell>
                  <TableCell>{row.age_group}</TableCell>
                  <TableCell>{row.staff_count}</TableCell>
                  <TableCell>{row.children_count}</TableCell>
                  <TableCell>{row.required_ratio}</TableCell>
                  <TableCell className={row.status === 'compliant' ? 'text-green-600' : 'text-red-600'}>
                    {row.actual_ratio}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(row.status)}
                      {getStatusBadge(row.status)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No staff-to-child ratio data available.</p>
            <p className="text-sm mt-2">Data will appear here once ratios are recorded.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StaffChildRatio;
