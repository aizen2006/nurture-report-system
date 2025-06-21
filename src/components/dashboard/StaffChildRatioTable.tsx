
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Save } from 'lucide-react';

const StaffChildRatioTable = () => {
  const [ratioData, setRatioData] = useState([
    {
      id: 1,
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
      id: 2,
      branch: 'A',
      room: '102',
      ageGroup: '3-4 yrs',
      staff: 1,
      children: 12,
      requiredRatio: '1:6',
      actualRatio: '1:12',
      status: 'non-compliant'
    }
  ]);

  const [newEntry, setNewEntry] = useState({
    branch: '',
    room: '',
    ageGroup: '',
    staff: '',
    children: '',
    requiredRatio: ''
  });

  const calculateStatus = (staff: number, children: number, requiredRatio: string) => {
    const [, requiredChildren] = requiredRatio.split(':').map(Number);
    const maxChildren = staff * requiredChildren;
    return children <= maxChildren ? 'compliant' : 'non-compliant';
  };

  const handleAddEntry = () => {
    if (!newEntry.branch || !newEntry.room || !newEntry.ageGroup || !newEntry.staff || !newEntry.children || !newEntry.requiredRatio) return;

    const staff = parseInt(newEntry.staff);
    const children = parseInt(newEntry.children);
    const actualRatio = `1:${Math.ceil(children / staff)}`;
    const status = calculateStatus(staff, children, newEntry.requiredRatio);

    const entry = {
      id: Date.now(),
      ...newEntry,
      staff,
      children,
      actualRatio,
      status
    };

    setRatioData([...ratioData, entry]);
    setNewEntry({
      branch: '',
      room: '',
      ageGroup: '',
      staff: '',
      children: '',
      requiredRatio: ''
    });
  };

  const getStatusBadge = (status: string) => {
    return status === 'compliant' ? 
      <Badge className="bg-green-100 text-green-800">✅ Compliant</Badge> : 
      <Badge className="bg-red-100 text-red-800">❌ Non-Compliant</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Staff-to-Child Ratio Data Collection
          <Button onClick={handleAddEntry} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Entry
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Entry Form */}
        <div className="grid grid-cols-6 gap-2 p-4 bg-gray-50 rounded-lg">
          <Select value={newEntry.branch} onValueChange={(value) => setNewEntry({...newEntry, branch: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">Branch A</SelectItem>
              <SelectItem value="B">Branch B</SelectItem>
              <SelectItem value="C">Branch C</SelectItem>
            </SelectContent>
          </Select>
          
          <Input
            placeholder="Room"
            value={newEntry.room}
            onChange={(e) => setNewEntry({...newEntry, room: e.target.value})}
          />
          
          <Select value={newEntry.ageGroup} onValueChange={(value) => setNewEntry({...newEntry, ageGroup: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Age Group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-1 yrs">0-1 yrs</SelectItem>
              <SelectItem value="1-2 yrs">1-2 yrs</SelectItem>
              <SelectItem value="2-3 yrs">2-3 yrs</SelectItem>
              <SelectItem value="3-4 yrs">3-4 yrs</SelectItem>
              <SelectItem value="4-5 yrs">4-5 yrs</SelectItem>
            </SelectContent>
          </Select>
          
          <Input
            placeholder="Staff Count"
            type="number"
            value={newEntry.staff}
            onChange={(e) => setNewEntry({...newEntry, staff: e.target.value})}
          />
          
          <Input
            placeholder="Children Count"
            type="number"
            value={newEntry.children}
            onChange={(e) => setNewEntry({...newEntry, children: e.target.value})}
          />
          
          <Select value={newEntry.requiredRatio} onValueChange={(value) => setNewEntry({...newEntry, requiredRatio: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Required Ratio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1:3">1:3</SelectItem>
              <SelectItem value="1:4">1:4</SelectItem>
              <SelectItem value="1:6">1:6</SelectItem>
              <SelectItem value="1:8">1:8</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Data Table */}
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
                <TableCell>{row.ageGroup}</TableCell>
                <TableCell>{row.staff}</TableCell>
                <TableCell>{row.children}</TableCell>
                <TableCell>{row.requiredRatio}</TableCell>
                <TableCell className={row.status === 'compliant' ? 'text-green-600' : 'text-red-600'}>
                  {row.actualRatio}
                </TableCell>
                <TableCell>
                  {getStatusBadge(row.status)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default StaffChildRatioTable;
