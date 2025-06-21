
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

interface RatioData {
  branch: string;
  room: string;
  ageGroup: string;
  staff: number;
  children: number;
  requiredRatio: string;
  actualRatio: string;
  status: 'compliant' | 'non-compliant';
}

const StaffChildRatio = () => {
  const ratioData: RatioData[] = [
    {
      branch: 'A',
      room: '101',
      ageGroup: '1-2 yrs',
      staff: 2,
      children: 6,
      requiredRatio: '1:3',
      actualRatio: '1:3',
      status: 'compliant'
    },
    {
      branch: 'A',
      room: '102',
      ageGroup: '3-4 yrs',
      staff: 1,
      children: 12,
      requiredRatio: '1:6',
      actualRatio: '1:12',
      status: 'non-compliant'
    },
    {
      branch: 'B',
      room: '201',
      ageGroup: '2-3 yrs',
      staff: 2,
      children: 8,
      requiredRatio: '1:4',
      actualRatio: '1:4',
      status: 'compliant'
    },
    {
      branch: 'B',
      room: '202',
      ageGroup: '4-5 yrs',
      staff: 1,
      children: 8,
      requiredRatio: '1:8',
      actualRatio: '1:8',
      status: 'compliant'
    }
  ];

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          Staff-to-Child Ratio
        </CardTitle>
      </CardHeader>
      <CardContent>
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
            {ratioData.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{row.branch}</TableCell>
                <TableCell>{row.room}</TableCell>
                <TableCell>{row.ageGroup}</TableCell>
                <TableCell>{row.staff}</TableCell>
                <TableCell>{row.children}</TableCell>
                <TableCell>{row.requiredRatio}</TableCell>
                <TableCell className={row.status === 'compliant' ? 'text-green-600' : 'text-red-600'}>
                  {row.actualRatio}
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
      </CardContent>
    </Card>
  );
};

export default StaffChildRatio;
