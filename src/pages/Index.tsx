
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

  const roles = [
    { id: 'manager', name: 'Manager', icon: Users, color: 'bg-blue-500' },
    { id: 'deputy', name: 'Deputy Manager', icon: Shield, color: 'bg-green-500' },
    { id: 'room-leader', name: 'Room Leader', icon: Calendar, color: 'bg-purple-500' },
    { id: 'area-manager', name: 'Area Manager', icon: TrendingUp, color: 'bg-orange-500' }
  ];

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
            <ManagerForm />
          </TabsContent>

          <TabsContent value="deputy">
            <DeputyManagerForm />
          </TabsContent>

          <TabsContent value="room-leader">
            <RoomLeaderForm />
          </TabsContent>

          <TabsContent value="area-manager">
            <AreaManagerForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
