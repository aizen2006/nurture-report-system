
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Shield, Calendar, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import ManagerForm from '@/components/ManagerForm';
import DeputyManagerForm from '@/components/DeputyManagerForm';
import RoomLeaderForm from '@/components/RoomLeaderForm';
import AreaManagerForm from '@/components/AreaManagerForm';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userDetails, setUserDetails] = useState({
    fullName: '',
    nurseryName: '',
    email: ''
  });
  const [isUserDetailsComplete, setIsUserDetailsComplete] = useState(false);

  const roles = [
    { id: 'manager', name: 'Manager', icon: Users, color: 'bg-blue-500' },
    { id: 'deputy', name: 'Deputy Manager', icon: Shield, color: 'bg-green-500' },
    { id: 'room-leader', name: 'Room Leader', icon: Calendar, color: 'bg-purple-500' },
    { id: 'area-manager', name: 'Area Manager', icon: TrendingUp, color: 'bg-orange-500' }
  ];

  const handleUserDetailsSubmit = () => {
    if (userDetails.fullName && userDetails.nurseryName && userDetails.email) {
      setIsUserDetailsComplete(true);
    }
  };

  const isFormComplete = userDetails.fullName && userDetails.nurseryName && userDetails.email;

  if (!isUserDetailsComplete && activeTab !== 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Nursery Daily Checklist
            </h1>
            <p className="text-lg text-gray-600">
              Comprehensive monitoring and compliance tracking system
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Enter Your Details</CardTitle>
                <p className="text-sm text-gray-600">Please provide your information before accessing the forms</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={userDetails.fullName}
                    onChange={(e) => setUserDetails({...userDetails, fullName: e.target.value})}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="nurseryName">Nursery Name *</Label>
                  <Input
                    id="nurseryName"
                    value={userDetails.nurseryName}
                    onChange={(e) => setUserDetails({...userDetails, nurseryName: e.target.value})}
                    placeholder="Enter nursery name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userDetails.email}
                    onChange={(e) => setUserDetails({...userDetails, email: e.target.value})}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                <Button 
                  onClick={handleUserDetailsSubmit}
                  disabled={!isFormComplete}
                  className="w-full"
                >
                  Continue to Forms
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('dashboard')}
                  className="w-full"
                >
                  View Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Nursery Daily Checklist
          </h1>
          <p className="text-lg text-gray-600">
            Comprehensive monitoring and compliance tracking system
          </p>
          {isUserDetailsComplete && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">
                <strong>{userDetails.fullName}</strong> from <strong>{userDetails.nurseryName}</strong>
              </p>
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            {roles.map((role) => (
              <TabsTrigger key={role.id} value={role.id} className="flex items-center gap-2">
                <role.icon className="w-4 h-4" />
                {role.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>

          <TabsContent value="manager">
            <ManagerForm userDetails={userDetails} />
          </TabsContent>

          <TabsContent value="deputy">
            <DeputyManagerForm userDetails={userDetails} />
          </TabsContent>

          <TabsContent value="room-leader">
            <RoomLeaderForm userDetails={userDetails} />
          </TabsContent>

          <TabsContent value="area-manager">
            <AreaManagerForm userDetails={userDetails} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
