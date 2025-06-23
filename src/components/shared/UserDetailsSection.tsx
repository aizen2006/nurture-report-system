
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UserDetailsSectionProps {
  userDetails: {
    fullName: string;
    nurseryName: string;
    email: string;
  };
  onUserDetailsChange: (field: string, value: string) => void;
}

const UserDetailsSection = ({ userDetails, onUserDetailsChange }: UserDetailsSectionProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            value={userDetails.fullName}
            onChange={(e) => onUserDetailsChange('fullName', e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </div>
        <div>
          <Label htmlFor="nurseryName">Nursery Name *</Label>
          <Input
            id="nurseryName"
            value={userDetails.nurseryName}
            onChange={(e) => onUserDetailsChange('nurseryName', e.target.value)}
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
            onChange={(e) => onUserDetailsChange('email', e.target.value)}
            placeholder="Enter your email address"
            required
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default UserDetailsSection;
