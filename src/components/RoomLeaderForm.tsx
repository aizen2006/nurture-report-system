import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Save, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UserDetails {
  fullName: string;
  nurseryName: string;
  email: string;
}

interface RoomLeaderFormProps {
  userDetails: UserDetails;
}

const RoomLeaderForm = ({ userDetails }: RoomLeaderFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({});
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sections = [
    {
      title: "Room Management",
      icon: "🏠",
      questions: [
        { id: "ratios_maintained", text: "Were ratios maintained?", type: "radio" },
        { id: "risk_fridge_checks", text: "Were risk and fridge checks done?", type: "radio" },
        { id: "resources_clean", text: "Were resources clean and safe?", type: "radio" }
      ]
    },
    {
      title: "Child Development & Learning",
      icon: "📚",
      questions: [
        { id: "observations_assessments", text: "Were observations or assessments done?", type: "radio" },
        { id: "activities_meet_needs", text: "Did activities meet child needs?", type: "radio" },
        { id: "concerns_raised", text: "Were any concerns raised?", type: "textarea" }
      ]
    },
    {
      title: "Safeguarding",
      icon: "🛡️",
      questions: [
        { id: "safeguarding_concerns", text: "Any safeguarding concerns observed?", type: "radio" },
        { id: "staff_awareness", text: "Are all staff aware of safeguarding duties?", type: "radio" }
      ]
    },
    {
      title: "Staff Updates",
      icon: "👥",
      questions: [
        { id: "team_issues", text: "Any team issues or achievements?", type: "textarea" },
        { id: "support_needed", text: "Any support needed?", type: "textarea" }
      ]
    }
  ];

  const handleInputChange = (question, value) => {
    setFormData(prev => ({
      ...prev,
      [question.id]: value
    }));
  };

  const getTotalQuestions = () => {
    return sections.reduce((total, section) => total + section.questions.length, 0);
  };

  const getAnsweredQuestions = () => {
    return Object.keys(formData).length;
  };

  const getProgressPercentage = () => {
    return Math.round((getAnsweredQuestions() / getTotalQuestions()) * 100);
  };

  const handleSaveDraft = () => {
    localStorage.setItem('room_leader_form_draft', JSON.stringify({
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
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('form_submissions')
        .insert({
          full_name: userDetails.fullName,
          email: userDetails.email,
          role: 'Room Leader',
          submission_data: {
            nursery_name: userDetails.nurseryName,
            responses: formData,
            completed_sections: sections.length,
            total_questions: getTotalQuestions(),
            answered_questions: getAnsweredQuestions()
          }
        });

      if (error) throw error;

      toast({
        title: "Form Submitted Successfully!",
        description: "Room Leader report has been submitted to the database.",
      });

      setFormData({});
      localStorage.removeItem('room_leader_form_draft');

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

  const renderQuestion = (question) => {
    if (question.type === 'radio') {
      return (
        <RadioGroup
          value={formData[question.id] || ''}
          onValueChange={(value) => handleInputChange(question, value)}
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
          onChange={(e) => handleInputChange(question, e.target.value)}
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
          <h2 className="text-2xl font-bold text-gray-900">Room Leader Daily Report</h2>
          <p className="text-gray-600">Complete your daily room management checklist</p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          {getAnsweredQuestions()}/{getTotalQuestions()} completed
        </Badge>
      </div>

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
          {sections.map((section, index) => (
            <button
              key={index}
              onClick={() => setCurrentSection(index)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                currentSection === index 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-white hover:bg-gray-50 border'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{section.icon}</span>
                <span className="text-sm font-medium">{section.title}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">{sections[currentSection].icon}</span>
                <span>{sections[currentSection].title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {sections[currentSection].questions.map((question, index) => (
                <div key={question.id} className="space-y-3">
                  <Label className="text-base font-medium">{question.text}</Label>
                  {renderQuestion(question)}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleSaveDraft}>
          <Save className="w-4 h-4 mr-2" />
          Save Draft
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Send className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </Button>
      </div>
    </div>
  );
};

export default RoomLeaderForm;
