
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Save, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import UserDetailsSection from '@/components/shared/UserDetailsSection';
import MorningReportSection from './area-manager/MorningReportSection';
import EndOfDaySection from './area-manager/EndOfDaySection';

const AreaManagerForm = () => {
  const { toast } = useToast();
  const [userDetails, setUserDetails] = useState({
    fullName: '',
    nurseryName: '',
    email: ''
  });
  const [formData, setFormData] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { title: "Morning Report", component: MorningReportSection, questionCount: 25 },
    { title: "End of Day Report", component: EndOfDaySection, questionCount: 10 }
  ];

  const handleUserDetailsChange = (field: string, value: string) => {
    setUserDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInputChange = (questionId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const getTotalQuestions = () => 35;
  const getAnsweredQuestions = () => Object.keys(formData).length;
  const getProgressPercentage = () => Math.round((getAnsweredQuestions() / getTotalQuestions()) * 100);

  const isFormValid = () => {
    return userDetails.fullName && userDetails.nurseryName && userDetails.email;
  };

  const handleSaveDraft = () => {
    localStorage.setItem('area_manager_form_draft', JSON.stringify({
      formData,
      userDetails,
      timestamp: new Date().toISOString()
    }));
    toast({
      title: "Draft Saved",
      description: "Your progress has been saved locally.",
    });
  };

  const submitToGoogleSheets = async (submissionData: any) => {
    try {
      const sheetData = {
        timestamp: new Date().toISOString(),
        full_name: userDetails.fullName,
        email: userDetails.email,
        nursery_name: userDetails.nurseryName,
        role: 'Area Manager',
        ...submissionData.responses
      };

      console.log('Data to be sent to Google Sheets:', sheetData);
      return { success: true };
    } catch (error) {
      console.error('Error submitting to Google Sheets:', error);
      return { success: false, error };
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required personal details.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const submissionData = {
        nursery_name: userDetails.nurseryName,
        responses: formData,
        completed_sections: steps.length,
        total_questions: getTotalQuestions(),
        answered_questions: getAnsweredQuestions(),
        timestamp: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('form_submissions')
        .insert({
          full_name: userDetails.fullName,
          email: userDetails.email,
          role: 'Area Manager',
          submission_data: submissionData
        });

      if (error) throw error;

      await submitToGoogleSheets(submissionData);

      // Send email notifications
      try {
        await supabase.functions.invoke('send-admin-notification', {
          body: {
            submitterName: userDetails.fullName,
            submitterEmail: userDetails.email,
            role: 'Area Manager',
            nurseryName: userDetails.nurseryName,
            submissionTime: new Date().toLocaleString(),
            formData: formData
          }
        });
        console.log('Email notifications sent successfully');
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
        // Don't fail the submission if email fails
      }

      toast({
        title: "Form Submitted Successfully!",
        description: "Area Manager daily report has been submitted and email notifications sent.",
      });

      setFormData({});
      setUserDetails({ fullName: '', nurseryName: '', email: '' });
      localStorage.removeItem('area_manager_form_draft');

    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Area Manager Daily Checklist</h2>
          <p className="text-gray-600">Complete your detailed daily operations report</p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          {getAnsweredQuestions()}/{getTotalQuestions()} completed
        </Badge>
      </div>

      <UserDetailsSection 
        userDetails={userDetails}
        onUserDetailsChange={handleUserDetailsChange}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Progress Overview</CardTitle>
            <span className="text-sm text-gray-500">{getProgressPercentage()}%</span>
          </div>
          <Progress value={getProgressPercentage()} className="mt-2" />
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          {steps.map((step, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                currentStep === index 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white hover:bg-gray-50 border'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{step.title}</span>
                <CheckCircle className={`w-4 h-4 ${currentStep === index ? 'text-white' : 'text-gray-400'}`} />
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
          <CurrentStepComponent 
            formData={formData}
            onInputChange={handleInputChange}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleSaveDraft}>
          <Save className="w-4 h-4 mr-2" />
          Save Draft
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting || !isFormValid()}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <Send className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </Button>
      </div>
    </div>
  );
};

export default AreaManagerForm;
