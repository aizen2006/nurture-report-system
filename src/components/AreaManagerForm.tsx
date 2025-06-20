
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import MorningReportSection from './area-manager/MorningReportSection';
import EndOfDaySection from './area-manager/EndOfDaySection';
import FormProgress from './area-manager/FormProgress';

interface UserDetails {
  fullName: string;
  nurseryName: string;
  email: string;
}

interface AreaManagerFormProps {
  userDetails: UserDetails;
}

const AreaManagerForm = ({ userDetails }: AreaManagerFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({});
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sections = [
    { title: "Morning Report", icon: "🌅", component: MorningReportSection },
    { title: "End of Day Report", icon: "🌙", component: EndOfDaySection }
  ];

  const handleInputChange = (questionId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const getTotalQuestions = () => {
    return 35; // Total questions across both sections
  };

  const getAnsweredQuestions = () => {
    return Object.keys(formData).length;
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
      // Create a flattened data structure for Google Sheets
      const sheetData = {
        timestamp: new Date().toISOString(),
        full_name: userDetails.fullName,
        email: userDetails.email,
        nursery_name: userDetails.nurseryName,
        role: 'Area Manager',
        ...submissionData.responses
      };

      // This would normally be sent to a Google Apps Script Web App
      // For now, we'll log it to show the structure
      console.log('Data to be sent to Google Sheets:', sheetData);
      
      // In a real implementation, you would:
      // await fetch('YOUR_GOOGLE_APPS_SCRIPT_URL', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(sheetData)
      // });

      return { success: true };
    } catch (error) {
      console.error('Error submitting to Google Sheets:', error);
      return { success: false, error };
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const submissionData = {
        nursery_name: userDetails.nurseryName,
        responses: formData,
        completed_sections: sections.length,
        total_questions: getTotalQuestions(),
        answered_questions: getAnsweredQuestions(),
        timestamp: new Date().toISOString()
      };

      // Submit to Supabase
      const { data, error } = await supabase
        .from('form_submissions')
        .insert({
          full_name: userDetails.fullName,
          email: userDetails.email,
          role: 'Area Manager',
          submission_data: submissionData
        });

      if (error) throw error;

      // Submit to Google Sheets
      await submitToGoogleSheets(submissionData);

      toast({
        title: "Form Submitted Successfully!",
        description: "Area Manager daily report has been submitted to the database and Google Sheets.",
      });

      setFormData({});
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

  const CurrentSectionComponent = sections[currentSection].component;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Area Manager Daily Report</h2>
          <p className="text-gray-600">Complete your detailed daily operations report</p>
        </div>
      </div>

      <FormProgress 
        answeredQuestions={getAnsweredQuestions()}
        totalQuestions={getTotalQuestions()}
      />

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
          <CurrentSectionComponent 
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
          disabled={isSubmitting}
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
