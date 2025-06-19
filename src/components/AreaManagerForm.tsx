
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Save, Send, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AreaManagerForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({});
  const [currentSection, setCurrentSection] = useState(0);

  const sections = [
    {
      title: "Morning Report",
      icon: "🌅",
      questions: [
        { id: "location_attended", text: "Location attended", type: "text" },
        { id: "arrival_time", text: "Time of arrival", type: "time" },
        { id: "morning_reports_checked", text: "Have all morning reports been checked?", type: "radio" },
        { id: "staff_ratios", text: "Staff-to-Child Ratios for each room at each location", type: "textarea" },
        { id: "contacted_locations", text: "Have you contacted all locations for support?", type: "radio" },
        { id: "asana_set", text: "Is your Asana set?", type: "radio" }
      ]
    },
    {
      title: "End of Day Report",
      icon: "🌙",
      questions: [
        { id: "end_reports_reviewed", text: "Have end-of-day reports been reviewed?", type: "radio" },
        { id: "issues_to_report", text: "Any issues to report?", type: "textarea" },
        { id: "children_outside", text: "Are children taken outside daily?", type: "radio" },
        { id: "outside_reason", text: "Reason if No", type: "textarea", conditional: "children_outside", value: "no" },
        { id: "asana_completed", text: "Completed all Asana tasks?", type: "radio" },
        { id: "asana_reason", text: "Reason if No", type: "textarea", conditional: "asana_completed", value: "no" },
        { id: "summary_emailed", text: "Emailed daily summary to Azi?", type: "radio" },
        { id: "accidents_incidents", text: "Any accidents/incidents?", type: "radio" },
        { id: "accident_description", text: "Description", type: "textarea", conditional: "accidents_incidents", value: "yes" },
        { id: "departure_time", text: "Time left location", type: "time" }
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
    localStorage.setItem('area_manager_form_draft', JSON.stringify(formData));
    toast({
      title: "Draft Saved",
      description: "Your progress has been saved locally.",
    });
  };

  const handleSubmit = () => {
    console.log('Area Manager Form Data:', formData);
    toast({
      title: "Form Submitted",
      description: "Area Manager daily report has been submitted successfully.",
    });
  };

  const shouldShowQuestion = (question) => {
    if (!question.conditional) return true;
    return formData[question.conditional] === question.value;
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
    } else if (question.type === 'text') {
      return (
        <Input
          value={formData[question.id] || ''}
          onChange={(e) => handleInputChange(question.id, e.target.value)}
          placeholder="Enter location name..."
        />
      );
    } else if (question.type === 'time') {
      return (
        <Input
          type="time"
          value={formData[question.id] || ''}
          onChange={(e) => handleInputChange(question.id, e.target.value)}
        />
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Area Manager Daily Report</h2>
          <p className="text-gray-600">Complete your daily operations report</p>
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
                  ? 'bg-orange-500 text-white' 
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
              {sections[currentSection].questions.map((question, index) => 
                shouldShowQuestion(question) && (
                  <div key={question.id} className="space-y-3">
                    <Label className="text-base font-medium">{question.text}</Label>
                    {renderQuestion(question)}
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleSaveDraft}>
          <Save className="w-4 h-4 mr-2" />
          Save Draft
        </Button>
        <Button onClick={handleSubmit} className="bg-orange-600 hover:bg-orange-700">
          <Send className="w-4 h-4 mr-2" />
          Submit Report
        </Button>
      </div>
    </div>
  );
};

export default AreaManagerForm;
