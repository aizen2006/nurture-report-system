import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const EmailTest = () => {
  const [testEmail, setTestEmail] = useState('soubhik1971@gmail.com');
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const { toast } = useToast();

  const handleTestEmail = async () => {
    if (!testEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    setIsTestingEmail(true);

    try {
      const testData = {
        submitterName: "Test User",
        submitterEmail: testEmail,
        role: "Test",
        nurseryName: "Test Nursery",
        submissionTime: new Date().toLocaleString(),
        formData: {
          "Sample Question 1": "Test Answer 1",
          "Sample Question 2": "Test Answer 2",
          "Morning Check": "Yes",
          "End of Day Review": "Completed"
        }
      };

      const { data, error } = await supabase.functions.invoke('send-admin-notification', {
        body: testData
      });

      if (error) {
        console.error('Email test error:', error);
        toast({
          title: "Email Test Failed",
          description: error.message || "Failed to send test email",
          variant: "destructive",
        });
      } else {
        console.log('Email test successful:', data);
        toast({
          title: "Email Test Successful",
          description: `Test emails sent to ${testEmail} and admin`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Email test error:', error);
      toast({
        title: "Email Test Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsTestingEmail(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Email Test</CardTitle>
        <CardDescription>
          Test the email notification functionality
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="test-email">Test Email Address</Label>
          <Input
            id="test-email"
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="Enter email to test"
          />
        </div>
        <Button 
          onClick={handleTestEmail} 
          disabled={isTestingEmail}
          className="w-full"
        >
          {isTestingEmail ? 'Sending Test Email...' : 'Send Test Email'}
        </Button>
        <p className="text-sm text-muted-foreground">
          This will send a test email to both the entered address and the admin email.
        </p>
      </CardContent>
    </Card>
  );
};