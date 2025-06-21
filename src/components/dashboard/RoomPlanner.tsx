
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Info } from 'lucide-react';

const RoomPlanner = () => {
  const [showAllergies, setShowAllergies] = useState(false);
  const [showSpecialDietary, setShowSpecialDietary] = useState(false);
  const [showChildSignature, setShowChildSignature] = useState(false);
  const [showStaffSignature, setShowStaffSignature] = useState(false);

  const weekDays = [
    { day: 'Mon', date: '29 Jul', status: 'complete' },
    { day: 'Tue', date: '30 Jul', status: 'complete' },
    { day: 'Wed', date: '31 Jul', status: 'complete' },
    { day: 'Thu', date: '1 Aug', status: 'complete' },
    { day: 'Fri', date: '2 Aug', status: 'complete' }
  ];

  const rooms = [
    {
      name: 'Perkins Baby Room',
      totalChildren: [11, 9, 11, 11, 9],
      staffRequired: [3.7, 3, 3.7, 3.7, 3],
      ratio: '1:3'
    },
    {
      name: 'Perkins Pre-School Room', 
      totalChildren: [8, 9, 10, 7, 6],
      staffRequired: [1, 1.1, 1.3, 0.9, 0.8],
      ratio: '1:8'
    },
    {
      name: 'Perkins Toddler Room',
      totalChildren: [7, 8, 6, 7, 6],
      staffRequired: [1.8, 2, 1.5, 1.8, 1.5],
      ratio: '1:4'
    }
  ];

  const summary = {
    totalChildren: [26, 26, 27, 25, 21],
    staffRequired: [7, 7, 8, 7, 6]
  };

  // Handler functions to convert CheckedState to boolean
  const handleAllergiesChange = (checked: boolean | "indeterminate") => {
    setShowAllergies(checked === true);
  };

  const handleSpecialDietaryChange = (checked: boolean | "indeterminate") => {
    setShowSpecialDietary(checked === true);
  };

  const handleChildSignatureChange = (checked: boolean | "indeterminate") => {
    setShowChildSignature(checked === true);
  };

  const handleStaffSignatureChange = (checked: boolean | "indeterminate") => {
    setShowStaffSignature(checked === true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Room planner</span>
          <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
            <Info className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filter Options */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="allergies" 
              checked={showAllergies}
              onCheckedChange={handleAllergiesChange}
            />
            <label htmlFor="allergies" className="text-sm font-medium">
              Show Allergies
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="dietary" 
              checked={showSpecialDietary}
              onCheckedChange={handleSpecialDietaryChange}
            />
            <label htmlFor="dietary" className="text-sm font-medium">
              Show Special Dietary Considerations
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="child-signature" 
              checked={showChildSignature}
              onCheckedChange={handleChildSignatureChange}
            />
            <label htmlFor="child-signature" className="text-sm font-medium">
              Child Signature Fields
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="staff-signature" 
              checked={showStaffSignature}
              onCheckedChange={handleStaffSignatureChange}
            />
            <label htmlFor="staff-signature" className="text-sm font-medium">
              Staff Signature Fields
            </label>
          </div>
        </div>

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
          {rooms.map((room, roomIndex) => (
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
