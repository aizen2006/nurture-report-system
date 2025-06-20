
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MorningReportSectionProps {
  formData: Record<string, any>;
  onInputChange: (questionId: string, value: string) => void;
}

const MorningReportSection = ({ formData, onInputChange }: MorningReportSectionProps) => {
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
    } else if (question.type === 'select') {
      return (
        <Select
          value={formData[question.id] || ''}
          onValueChange={(value) => onInputChange(question.id, value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={`Select ${question.text.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {question.options.map((option: string) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    } else if (question.type === 'textarea') {
      return (
        <Textarea
          value={formData[question.id] || ''}
          onChange={(e) => onInputChange(question.id, e.target.value)}
          placeholder={question.placeholder || "Please provide details..."}
          className="min-h-[80px]"
        />
      );
    } else if (question.type === 'text') {
      return (
        <Input
          value={formData[question.id] || ''}
          onChange={(e) => onInputChange(question.id, e.target.value)}
          placeholder={question.placeholder || "Enter details..."}
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
    { id: "location_attended", text: "Name of Location Attended", type: "select", 
      options: ["Curlew", "GGS", "Marylebone", "Paddington", "Head Office"] },
    { id: "arrival_time", text: "Time of Arrival at Location", type: "time" },
    { id: "morning_reports_checked", text: "Have all nurseries' morning reports been checked?", type: "radio" },
    { id: "locations_contacted", text: "Have you contacted each location to check if support is needed?", type: "radio" },
    { id: "asana_set", text: "Is your Asana set for the day?", type: "radio" },
    
    // Room-wise Staff-to-Child Ratios - Curlew
    { id: "curlew_baby_ratio", text: "Curlew - Baby Room Staff-to-Child Ratio", type: "text", placeholder: "e.g., 1:3" },
    { id: "curlew_toddler_ratio", text: "Curlew - Toddler Room Staff-to-Child Ratio", type: "text", placeholder: "e.g., 1:4" },
    { id: "curlew_preschool_ratio", text: "Curlew - Preschool Room Staff-to-Child Ratio", type: "text", placeholder: "e.g., 1:8" },
    
    // Room-wise Staff-to-Child Ratios - GGS
    { id: "ggs_baby_ratio", text: "GGS - Baby Room Staff-to-Child Ratio", type: "text", placeholder: "e.g., 1:3" },
    { id: "ggs_pretoddler_ratio", text: "GGS - Pre-Toddler Room Staff-to-Child Ratio", type: "text", placeholder: "e.g., 1:3" },
    { id: "ggs_toddler_ratio", text: "GGS - Toddler Room Staff-to-Child Ratio", type: "text", placeholder: "e.g., 1:4" },
    { id: "ggs_preschool_ratio", text: "GGS - Preschool Room Staff-to-Child Ratio", type: "text", placeholder: "e.g., 1:8" },
    
    // Room-wise Staff-to-Child Ratios - Marylebone
    { id: "marylebone_explorer_ratio", text: "Marylebone - Explorer Room Staff-to-Child Ratio", type: "text", placeholder: "e.g., 1:4" },
    { id: "marylebone_montessori_ratio", text: "Marylebone - Montessori Room Staff-to-Child Ratio", type: "text", placeholder: "e.g., 1:8" },
    
    // Room-wise Staff-to-Child Ratios - Paddington
    { id: "paddington_explorer_ratio", text: "Paddington - Explorer Room Staff-to-Child Ratio", type: "text", placeholder: "e.g., 1:4" },
    { id: "paddington_montessori_ratio", text: "Paddington - Montessori Room Staff-to-Child Ratio", type: "text", placeholder: "e.g., 1:8" },
    
    // Staff Absence Reporting
    { id: "curlew_absences", text: "Any staff absences at Curlew today? (Name & reason)", type: "textarea", optional: true },
    { id: "ggs_absences", text: "Any staff absences at GGS today? (Name & reason)", type: "textarea", optional: true },
    { id: "marylebone_absences", text: "Any staff absences at Marylebone today? (Name & reason)", type: "textarea", optional: true },
    { id: "paddington_absences", text: "Any staff absences at Paddington today? (Name & reason)", type: "textarea", optional: true },
    { id: "general_absences", text: "Any staff absences at the site in general today? (Name & reason)", type: "textarea", optional: true },
    
    // Arrival & Ratio Validation
    { id: "arrival_status", text: "Arrival Status", type: "select", 
      options: ["On Time", "Late", "Not Arrived"] },
    { id: "curlew_baby_ratio_status", text: "Curlew Baby Room Ratio Status", type: "select", 
      options: ["Correct Ratio", "Incorrect Ratio"] },
    { id: "curlew_toddler_ratio_status", text: "Curlew Toddler Room Ratio Status", type: "select", 
      options: ["Correct Ratio", "Incorrect Ratio"] },
    { id: "curlew_preschool_ratio_status", text: "Curlew Preschool Room Ratio Status", type: "select", 
      options: ["Correct Ratio", "Incorrect Ratio"] },
    { id: "overall_ratio_notes", text: "Overall Ratio Notes", type: "textarea", optional: true }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span className="text-2xl">🌅</span>
          <span>Morning Report</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {questions.map((question) => (
          <div key={question.id} className="space-y-3">
            <Label className="text-base font-medium flex items-center">
              {question.text}
              {question.optional && (
                <span className="text-sm text-gray-500 ml-2">(Optional)</span>
              )}
            </Label>
            {renderQuestion(question)}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MorningReportSection;
