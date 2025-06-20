
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface EndOfDaySectionProps {
  formData: Record<string, any>;
  onInputChange: (questionId: string, value: string) => void;
}

const EndOfDaySection = ({ formData, onInputChange }: EndOfDaySectionProps) => {
  const shouldShowQuestion = (question: any) => {
    if (!question.conditional) return true;
    return formData[question.conditional] === question.value;
  };

  const renderQuestion = (question: any) => {
    if (question.type === 'radio') {
      return (
        <RadioGroup
          value={formData[question.id] || ''}
          onValueChange={(value) => onInputChange(question.id, value)}
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
          onChange={(e) => onInputChange(question.id, e.target.value)}
          placeholder="Please provide details..."
          className="min-h-[80px]"
        />
      );
    } else if (question.type === 'time') {
      return (
        <Input
          type="time"
          value={formData[question.id] || ''}
          onChange={(e) => onInputChange(question.id, e.target.value)}
        />
      );
    }
  };

  const questions = [
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
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span className="text-2xl">🌙</span>
          <span>End of Day Report</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {questions.map((question) => 
          shouldShowQuestion(question) && (
            <div key={question.id} className="space-y-3">
              <Label className="text-base font-medium">
                {question.text}
              </Label>
              {renderQuestion(question)}
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
};

export default EndOfDaySection;
