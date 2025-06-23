
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Save, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import UserDetailsSection from '@/components/shared/UserDetailsSection';

const ManagerForm = () => {
  const { toast } = useToast();
  const [userDetails, setUserDetails] = useState({
    fullName: '',
    nurseryName: '',
    email: ''
  });
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allQuestions = [
    { id: "statutory_requirements", text: "Have all statutory requirements been met this week?", type: "radio" },
    { id: "incidents_complaints", text: "Were there any incidents, complaints, or concerns raised?", type: "radio" },
    { id: "safeguarding_policies", text: "Are all safeguarding policies being followed?", type: "radio" },
    { id: "checks_logged", text: "Have all checks (first aid, fire drills, maintenance) been logged?", type: "radio" },
    { id: "health_safety_issues", text: "Were there any health & safety issues this week?", type: "radio" },
    { id: "hygiene_measures", text: "Were hygiene and infection control measures followed?", type: "radio" },
    { id: "environmental_hazards", text: "Any environmental hazards or repairs needed?", type: "textarea" },
    { id: "safeguarding_concerns", text: "Were there any safeguarding concerns raised?", type: "radio" },
    { id: "concerns_reported", text: "Have all concerns been reported properly?", type: "radio" },
    { id: "staff_confidence", text: "Do staff feel confident in safeguarding procedures?", type: "radio" },
    { id: "staff_issues", text: "Any staff absences, lateness, or performance issues?", type: "textarea" },
    { id: "staffing_changes", text: "Any staffing changes?", type: "textarea" },
    { id: "training_needs", text: "Any training or support needs identified?", type: "textarea" },
    { id: "development_plans", text: "Are learning and development plans progressing?", type: "radio" },
    { id: "development_concerns", text: "Any concerns about individual children's development?", type: "textarea" },
    { id: "parent_communications", text: "Are parent communications up to date?", type: "radio" }
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

  const getTotalQuestions = () => allQuestions.length;
  const getAnsweredQuestions = () => Object.keys(formData).length;
  const getProgressPercentage = () => Math.round((getAnsweredQuestions() / getTotalQuestions()) * 100);

  const isFormValid = () => {
    return userDetails.fullName && userDetails.nurseryName && userDetails.email;
  };

  const handleSaveDraft = () => {
    localStorage.setItem('manager_form_draft', JSON.stringify({
      formData,
      userDetails,
      timestamp: new Date().toISOString()
    }));
    toast({
      title: "Draft Saved",
      description: "Your progress has been saved locally.",
    });
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
      const { data, error } = await supabase
        .from('form_submissions')
        .insert({
          full_name: userDetails.fullName,
          email: userDetails.email,
          role: 'Manager',
          submission_data: {
            nursery_name: userDetails.nurseryName,
            responses: formData,
            total_questions: getTotalQuestions(),
            answered_questions: getAnsweredQuestions()
          }
        });

      if (error) throw error;

      toast({
        title: "Form Submitted Successfully!",
        description: "Manager compliance report has been submitted to the database.",
      });

      setFormData({});
      setUserDetails({ fullName: '', nurseryName: '', email: '' });
      localStorage.removeItem('manager_form_draft');

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

  const renderQuestion = (question: any) => {
    if (question.type === 'radio') {
      return (
        <RadioGroup
          value={formData[question.id] || ''}
          onValueChange={(value) => handleInputChange(question.id, value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id={`${question.id}_yes`} />
            <Label htmlFor={`${question.id}_yes`}>Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id={`${question.id}_no`} />
            <Label htmlFor={`${question.id}_no`}>No</Label>
          </div>
        </RadioGroup>
      );
    } else if (question.type === 'textarea') {
      return (
        <Textarea
          value={formData[question.id] || ''}
          onChange={(e) => handleInputChange(question.id, e.target.value)}
          placeholder="Please provide details..."
          className="min-h-[100px]"
        />
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manager Daily Checklist</h2>
          <p className="text-gray-600">Complete your daily compliance and development checklist</p>
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-6 h-6 text-blue-500" />
            <span>Daily Checklist</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {allQuestions.map((question, index) => (
            <div key={question.id} className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-start space-x-3">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full min-w-[2rem] text-center">
                  {index + 1}
                </span>
                <div className="flex-1 space-y-3">
                  <Label className="text-base font-medium">{question.text}</Label>
                  {renderQuestion(question)}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleSaveDraft}>
          <Save className="w-4 h-4 mr-2" />
          Save Draft
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || !isFormValid()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Send className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </Button>
      </div>
    </div>
  );
};

export default ManagerForm;
