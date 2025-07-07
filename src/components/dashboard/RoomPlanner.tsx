
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronRight, Info, ChevronLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format, addWeeks, startOfWeek } from 'date-fns';

const RoomPlanner = () => {
  const [selectedSite, setSelectedSite] = useState('all');
  const [weekOffset, setWeekOffset] = useState(0);

  const { data: roomPlannerData, isLoading } = useQuery({
    queryKey: ['room_planner'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('room_planner')
        .select('*')
        .order('site', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const sites = [
    { id: 'all', name: 'All Sites' },
    ...Array.from(new Set(roomPlannerData?.map(item => item.site) || [])).map(site => ({
      id: site.toLowerCase().replace(/\s+/g, '-'),
      name: site
    }))
  ];

  const weekDays = useMemo(() => {
    const currentWeek = addWeeks(startOfWeek(new Date(), { weekStartsOn: 1 }), weekOffset);
    return Array.from({ length: 5 }, (_, i) => {
      const date = addWeeks(currentWeek, 0);
      date.setDate(date.getDate() + i);
      return {
        day: format(date, 'EEE'),
        date: format(date, 'd MMM')
      };
    });
  }, [weekOffset]);

  const currentWeekRange = useMemo(() => {
    const startDate = addWeeks(startOfWeek(new Date(), { weekStartsOn: 1 }), weekOffset);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 4);
    return `${format(startDate, 'd MMM')} - ${format(endDate, 'd MMM yyyy')}`;
  }, [weekOffset]);

  const getFilteredRooms = () => {
    if (!roomPlannerData) return [];
    
    if (selectedSite === 'all') {
      return roomPlannerData.map(room => ({
        name: `${room.site} - ${room.room_name}`,
        ageGroup: room.age_group,
        totalChildren: [room.monday_children, room.tuesday_children, room.wednesday_children, room.thursday_children, room.friday_children],
        staffRequired: [room.monday_staff, room.tuesday_staff, room.wednesday_staff, room.thursday_staff, room.friday_staff],
        ratio: room.ratio
      }));
    } else {
      const selectedSiteName = sites.find(s => s.id === selectedSite)?.name;
      return roomPlannerData
        .filter(room => room.site === selectedSiteName)
        .map(room => ({
          name: `${room.site} - ${room.room_name}`,
          ageGroup: room.age_group,
          totalChildren: [room.monday_children, room.tuesday_children, room.wednesday_children, room.thursday_children, room.friday_children],
          staffRequired: [room.monday_staff, room.tuesday_staff, room.wednesday_staff, room.thursday_staff, room.friday_staff],
          ratio: room.ratio
        }));
    }
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Room planner</span>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                  <Info className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Room Planner Information</DialogTitle>
                  <DialogDescription>
                    The Room Planner shows the planned staffing and child capacity for each room across the week. 
                    It helps you visualize staffing requirements and ensure proper staff-to-child ratios are maintained.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
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

  const filteredRooms = getFilteredRooms();
  const summary = getSummary();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Room planner</span>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                  <Info className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Room Planner Information</DialogTitle>
                  <DialogDescription>
                    The Room Planner shows the planned staffing and child capacity for each room across the week. 
                    It helps you visualize staffing requirements and ensure proper staff-to-child ratios are maintained.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setWeekOffset(weekOffset - 1)}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm font-medium min-w-[140px] text-center">
                {currentWeekRange}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setWeekOffset(weekOffset + 1)}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
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
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {filteredRooms.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No room planner data available.</p>
            <p className="text-sm mt-2">Data will appear here once room planning is configured.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Day Headers */}
            <div className="grid grid-cols-6 gap-2 text-sm">
              <div></div>
              {weekDays.map((day, index) => (
                <div key={index} className="text-center">
                  <div className="font-medium">{day.day}</div>
                  <div className="text-gray-500 text-xs">{day.date}</div>
                </div>
              ))}
            </div>

            {/* Room Details */}
            {filteredRooms.map((room, roomIndex) => (
              <div key={roomIndex} className="space-y-2">
                <div className="flex items-center gap-2 font-medium">
                  <ChevronRight className="h-4 w-4" />
                  {room.name}
                  <span className="text-xs text-gray-500">({room.ageGroup})</span>
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-0 h-4 w-4">
                        <Info className="h-3 w-3 text-blue-500" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Total Children Information</DialogTitle>
                        <DialogDescription>
                          This shows the total number of children across all rooms for each day of the week.
                          The numbers help you understand daily capacity requirements.
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
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
        )}
      </CardContent>
    </Card>
  );
};

export default RoomPlanner;
