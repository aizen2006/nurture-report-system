
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Info } from 'lucide-react';

const RoomPlanner = () => {
  const [selectedSite, setSelectedSite] = useState('all');

  const sites = [
    { id: 'all', name: 'All Sites' },
    { id: 'site-a', name: 'Site A' },
    { id: 'site-b', name: 'Site B' },
    { id: 'site-c', name: 'Site C' }
  ];

  const weekDays = [
    { day: 'Mon', date: '29 Jul', status: 'complete' },
    { day: 'Tue', date: '30 Jul', status: 'complete' },
    { day: 'Wed', date: '31 Jul', status: 'complete' },
    { day: 'Thu', date: '1 Aug', status: 'complete' },
    { day: 'Fri', date: '2 Aug', status: 'complete' }
  ];

  const allSitesRooms = [
    {
      name: 'Site A - Baby Room',
      totalChildren: [11, 9, 11, 11, 9],
      staffRequired: [4, 3, 4, 4, 3],
      ratio: '1:3'
    },
    {
      name: 'Site A - Pre-School Room', 
      totalChildren: [8, 9, 10, 7, 6],
      staffRequired: [1, 1, 1, 1, 1],
      ratio: '1:8'
    },
    {
      name: 'Site A - Toddler Room',
      totalChildren: [7, 8, 6, 7, 6],
      staffRequired: [2, 2, 2, 2, 2],
      ratio: '1:4'
    },
    {
      name: 'Site B - Baby Room',
      totalChildren: [9, 8, 10, 9, 8],
      staffRequired: [3, 3, 3, 3, 3],
      ratio: '1:3'
    },
    {
      name: 'Site B - Pre-School Room',
      totalChildren: [12, 11, 13, 10, 9],
      staffRequired: [2, 1, 2, 1, 1],
      ratio: '1:8'
    },
    {
      name: 'Site B - Toddler Room',
      totalChildren: [6, 7, 5, 6, 7],
      staffRequired: [2, 2, 1, 2, 2],
      ratio: '1:4'
    },
    {
      name: 'Site C - Baby Room',
      totalChildren: [13, 12, 14, 13, 11],
      staffRequired: [4, 4, 5, 4, 4],
      ratio: '1:3'
    },
    {
      name: 'Site C - Pre-School Room',
      totalChildren: [15, 14, 16, 13, 12],
      staffRequired: [2, 2, 2, 2, 2],
      ratio: '1:8'
    },
    {
      name: 'Site C - Toddler Room',
      totalChildren: [8, 9, 7, 8, 8],
      staffRequired: [2, 2, 2, 2, 2],
      ratio: '1:4'
    }
  ];

  const getFilteredRooms = () => {
    if (selectedSite === 'all') {
      return allSitesRooms;
    }
    return allSitesRooms.filter(room => 
      room.name.toLowerCase().includes(selectedSite.replace('-', ' '))
    );
  };

  const getSummary = () => {
    const filteredRooms = getFilteredRooms();
    const summary = {
      totalChildren: [0, 0, 0, 0, 0],
      staffRequired: [0, 0, 0, 0, 0]
    };
    
    filteredRooms.forEach(room => {
      room.totalChildren.forEach((count, index) => {
        summary.totalChildren[index] += count;
      });
      room.staffRequired.forEach((count, index) => {
        summary.staffRequired[index] += count;
      });
    });

    return summary;
  };

  const filteredRooms = getFilteredRooms();
  const summary = getSummary();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Room planner</span>
            <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
              <Info className="h-4 w-4" />
            </Button>
          </div>
          <Select value={selectedSite} onValueChange={setSelectedSite}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select Site" />
            </SelectTrigger>
            <SelectContent>
              {sites.map((site) => (
                <SelectItem key={site.id} value={site.id}>
                  {site.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Weekly Schedule */}
        <div className="space-y-4">
          {/* Day Headers */}
          <div className="grid grid-cols-6 gap-2 text-sm">
            <div></div>
            {weekDays.map((day, index) => (
              <div key={index} className="text-center">
                <div className="font-medium">{day.day}</div>
                <div className="text-gray-500 text-xs">{day.date}</div>
                <div className="mt-2 h-12 bg-green-500 rounded flex items-center justify-center text-white text-xs">
                  08:00<br/>18:00
                </div>
              </div>
            ))}
          </div>

          {/* Room Details */}
          {filteredRooms.map((room, roomIndex) => (
            <div key={roomIndex} className="space-y-2">
              <div className="flex items-center gap-2 font-medium">
                <ChevronRight className="h-4 w-4" />
                {room.name}
              </div>
              
              <div className="grid grid-cols-6 gap-2 pl-6">
                <div className="text-sm text-gray-600">Total Children</div>
                {room.totalChildren.map((count, dayIndex) => (
                  <div key={dayIndex} className="text-center text-sm font-medium">
                    {count}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-6 gap-2 pl-6">
                <div className="text-sm text-gray-600">
                  Staff Required (Ratio {room.ratio})
                </div>
                {room.staffRequired.map((staff, dayIndex) => (
                  <div key={dayIndex} className="text-center text-sm">
                    {staff}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Summary */}
          <div className="border-t pt-4 space-y-2">
            <div className="font-medium">Summary</div>
            
            <div className="grid grid-cols-6 gap-2">
              <div className="text-sm text-gray-600 flex items-center gap-1">
                Total Children
                <Button variant="ghost" size="sm" className="p-0 h-4 w-4">
                  <Info className="h-3 w-3 text-blue-500" />
                </Button>
              </div>
              {summary.totalChildren.map((count, dayIndex) => (
                <div key={dayIndex} className="text-center text-sm font-medium">
                  {count}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-6 gap-2">
              <div className="text-sm text-gray-600">Staff Required</div>
              {summary.staffRequired.map((staff, dayIndex) => (
                <div key={dayIndex} className="text-center text-sm font-medium">
                  {staff}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomPlanner;
