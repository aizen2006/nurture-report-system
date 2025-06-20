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

interface DeputyManagerFormProps {
  userDetails: UserDetails;
}

const DeputyManagerForm = ({ userDetails }: DeputyManagerFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({});
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sections = [
    {
      title: "Daily Running",
      icon: "⏰",
      questions: [
        { id: "routines_smooth", text: "Did routines (meals, transitions, outdoor play) run smoothly?", type: "radio" },
        { id: "staffing_challenges", text: "Any staffing or rota challenges?", type: "textarea" },
        { id: "parent_interactions", text: "Were parent drop-offs/pick-ups handled well?", type: "radio" }
      ]
    },
    {
      title: "Health & Safety",
      icon: "🏥",
      questions: [
        { id: "room_checks", text: "Were room checks, temp checks, and cleaning records completed?", type: "radio" },
        { id: "accident_forms", text: "Were accident forms filled and shared?", type: "radio" }
      ]
    },
    {
      title: "Safeguarding",
      icon: "🛡️",
      questions: [
        { id: "safeguarding_concerns", text: "Any safeguarding concerns this week?", type: "radio" },
        { id: "practices_attention", text: "Any practices needing attention?", type: "textarea" }
      ]
    },
    {
      title: "Staff Updates",
      icon: "👥",
      questions: [
        { id: "staff_support", text: "Any staff needing extra support?", type: "textarea" },
        { id: "staff_contributions", text: "Any notable staff contributions?", type: "textarea" },
        { id: "staff_clarity", text: "Are staff clear on responsibilities?", type: "radio" }
      ]
    },
    {
      title: "Children's Experiences",
      icon: "🌟",
      questions: [
        { id: "activities_appropriate", text: "Were activities inclusive and age-appropriate?", type: "radio" },
        { id: "children_support", text: "Did any children need extra support or show progress?", type: "textarea" }
      ]
    }
  ];

  const handleInputChange = (questionId, value) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
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
    localStorage.setItem('deputy_manager_form_draft', JSON.stringify({
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
          role: 'Deputy Manager',
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
        description: "Deputy Manager report has been submitted to the database.",
      });

      setFormData({});
      localStorage.removeItem('deputy_manager_form_draft');

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
          <h2 className="text-2xl font-bold text-gray-900">Deputy Manager Daily Report</h2>
          <p className="text-gray-600">Complete your daily operations and development checklist</p>
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
                  ? 'bg-green-500 text-white' 
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
          className="bg-green-600 hover:bg-green-700"
        >
          <Send className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </Button>
      </div>
    </div>
  );
};

export default DeputyManagerForm;
