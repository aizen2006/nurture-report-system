
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

const EnrollmentAttendanceTable = () => {
  const [attendanceData, setAttendanceData] = useState([
    {
      id: 1,
      site: 'Site A',
      date: '2024-01-15',
      staffCount: 12,
      childrenEnrolled: 68,
      childrenPresent: 65,
      occupancyRate: 95.6,
      staffAttendanceRate: 100
    },
    {
      id: 2,
      site: 'Site B',
      date: '2024-01-15',
      staffCount: 8,
      childrenEnrolled: 45,
      childrenPresent: 42,
      occupancyRate: 93.3,
      staffAttendanceRate: 100
    }
  ]);

  const [newEntry, setNewEntry] = useState({
    site: '',
    date: '',
    staffCount: '',
    childrenEnrolled: '',
    childrenPresent: '',
    plannedCapacity: ''
  });

  const handleAddEntry = () => {
    if (!newEntry.site || !newEntry.date || !newEntry.staffCount || !newEntry.childrenEnrolled || !newEntry.childrenPresent) return;

    const childrenEnrolled = parseInt(newEntry.childrenEnrolled);
    const childrenPresent = parseInt(newEntry.childrenPresent);
    const staffCount = parseInt(newEntry.staffCount);
    const occupancyRate = (childrenPresent / childrenEnrolled) * 100;

    const entry = {
      id: Date.now(),
      ...newEntry,
      staffCount,
      childrenEnrolled,
      childrenPresent,
      occupancyRate: Math.round(occupancyRate * 10) / 10,
      staffAttendanceRate: 100 // Simplified for demo
    };

    setAttendanceData([...attendanceData, entry]);
    setNewEntry({
      site: '',
      date: '',
      staffCount: '',
      childrenEnrolled: '',
      childrenPresent: '',
      plannedCapacity: ''
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Enrollment & Attendance Data Collection
          <Button onClick={handleAddEntry} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Entry
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Entry Form */}
        <div className="grid grid-cols-6 gap-2 p-4 bg-gray-50 rounded-lg">
          <Select value={newEntry.site} onValueChange={(value) => setNewEntry({...newEntry, site: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Site" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Site A">Site A</SelectItem>
              <SelectItem value="Site B">Site B</SelectItem>
              <SelectItem value="Site C">Site C</SelectItem>
            </SelectContent>
          </Select>
          
          <Input
            placeholder="Date"
            type="date"
            value={newEntry.date}
            onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
          />
          
          <Input
            placeholder="Staff Count"
            type="number"
            value={newEntry.staffCount}
            onChange={(e) => setNewEntry({...newEntry, staffCount: e.target.value})}
          />
          
          <Input
            placeholder="Children Enrolled"
            type="number"
            value={newEntry.childrenEnrolled}
            onChange={(e) => setNewEntry({...newEntry, childrenEnrolled: e.target.value})}
          />
          
          <Input
            placeholder="Children Present"
            type="number"
            value={newEntry.childrenPresent}
            onChange={(e) => setNewEntry({...newEntry, childrenPresent: e.target.value})}
          />
          
          <Input
            placeholder="Planned Capacity"
            type="number"
            value={newEntry.plannedCapacity}
            onChange={(e) => setNewEntry({...newEntry, plannedCapacity: e.target.value})}
          />
        </div>

        {/* Data Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Site</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Staff Count</TableHead>
              <TableHead>Children Enrolled</TableHead>
              <TableHead>Children Present</TableHead>
              <TableHead>Occupancy Rate</TableHead>
              <TableHead>Staff Attendance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendanceData.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.site}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.staffCount}</TableCell>
                <TableCell>{row.childrenEnrolled}</TableCell>
                <TableCell>{row.childrenPresent}</TableCell>
                <TableCell>
                  <span className={row.occupancyRate >= 90 ? 'text-green-600' : 'text-orange-600'}>
                    {row.occupancyRate}%
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-green-600">{row.staffAttendanceRate}%</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default EnrollmentAttendanceTable;
