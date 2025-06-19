
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

const ManagerForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({});
  const [currentSection, setCurrentSection] = useState(0);

  const sections = [
    {
      title: "Compliance & Operations",
      icon: "📋",
      questions: [
        { id: "statutory_requirements", text: "Have all statutory requirements been met this week?", type: "radio" },
        { id: "incidents_complaints", text: "Were there any incidents, complaints, or concerns raised?", type: "radio" },
        { id: "safeguarding_policies", text: "Are all safeguarding policies being followed?", type: "radio" },
        { id: "checks_logged", text: "Have all checks (first aid, fire drills, maintenance) been logged?", type: "radio" }
      ]
    },
    {
      title: "Health & Safety",
      icon: "🏥",
      questions: [
        { id: "health_safety_issues", text: "Were there any health & safety issues this week?", type: "radio" },
        { id: "hygiene_measures", text: "Were hygiene and infection control measures followed?", type: "radio" },
        { id: "environmental_hazards", text: "Any environmental hazards or repairs needed?", type: "textarea" }
      ]
    },
    {
      title: "Safeguarding",
      icon: "🛡️",
      questions: [
        { id: "safeguarding_concerns", text: "Were there any safeguarding concerns raised?", type: "radio" },
        { id: "concerns_reported", text: "Have all concerns been reported properly?", type: "radio" },
        { id: "staff_confidence", text: "Do staff feel confident in safeguarding procedures?", type: "radio" }
      ]
    },
    {
      title: "Staff Updates",
      icon: "👥",
      questions: [
        { id: "staff_issues", text: "Any staff absences, lateness, or performance issues?", type: "textarea" },
        { id: "staffing_changes", text: "Any staffing changes?", type: "textarea" },
        { id: "training_needs", text: "Any training or support needs identified?", type: "textarea" }
      ]
    },
    {
      title: "Children's Development",
      icon: "🌱",
      questions: [
        { id: "development_plans", text: "Are learning and development plans progressing?", type: "radio" },
        { id: "development_concerns", text: "Any concerns about individual children's development?", type: "textarea" },
        { id: "parent_communications", text: "Are parent communications up to date?", type: "radio" }
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
    localStorage.setItem('manager_form_draft', JSON.stringify(formData));
    toast({
      title: "Draft Saved",
      description: "Your progress has been saved locally.",
    });
  };

  const handleSubmit = () => {
    console.log('Manager Form Data:', formData);
    toast({
      title: "Form Submitted",
      description: "Manager compliance report has been submitted successfully.",
    });
    // Here you would typically send data to your backend/Google Sheets
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
          <h2 className="text-2xl font-bold text-gray-900">Manager Weekly Report</h2>
          <p className="text-gray-600">Complete your weekly compliance and development checklist</p>
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
        {/* Section Navigation */}
        <div className="space-y-2">
          {sections.map((section, index) => (
            <button
              key={index}
              onClick={() => setCurrentSection(index)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                currentSection === index 
                  ? 'bg-blue-500 text-white' 
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

        {/* Current Section */}
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
        <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
          <Send className="w-4 h-4 mr-2" />
          Submit Report
        </Button>
      </div>
    </div>
  );
};

export default ManagerForm;
