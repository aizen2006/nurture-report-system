
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Users, Calendar, Shield, RefreshCw } from 'lucide-react';
import { parseSubmissionData } from './utils/dataProcessing';
import { generateAISuggestionsText } from './utils/textFormatting';

interface Suggestion {
  type: 'warning' | 'success' | 'info';
  icon: React.ReactNode;
  message: string;
  priority: 'high' | 'medium' | 'low';
  textFormat: string;
}

const AISuggestions = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const { data: submissions, isLoading, error } = useQuery({
    queryKey: ['form_submissions_ai'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching submissions:', error);
        throw error;
      }
      return data;
    },
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  const generateSuggestions = (): Suggestion[] => {
    if (!submissions || submissions.length === 0) {
      return [{
        type: 'info',
        icon: <Users className="h-4 w-4" />,
        message: 'No data available for analysis. Submit forms to get AI suggestions.',
        priority: 'low',
        textFormat: 'INFO: No data available for analysis'
      }];
    }

    const suggestions: Suggestion[] = [];
    const textSuggestions = generateAISuggestionsText(submissions);

    try {
      // Analyze each submission
      submissions.forEach(sub => {
        try {
          const data = parseSubmissionData(sub.submission_data);
          const responses = data.responses || {};
          const nurseryName = data.nursery_name || 'Unknown Branch';

          // Check for understaffing based on ratio status
          Object.keys(responses).forEach(key => {
            if (key.includes('ratio_status') && responses[key] === 'Incorrect Ratio') {
              const roomMatch = key.match(/room_(\d+)/);
              const roomNumber = roomMatch ? roomMatch[1] : 'Unknown';
              
              suggestions.push({
                type: 'warning',
                icon: <AlertTriangle className="h-4 w-4" />,
                message: `🔴 ${nurseryName}, Room ${roomNumber} is understaffed. Hire 1 more staff member.`,
                priority: 'high',
                textFormat: `HIGH PRIORITY: ${nurseryName}, Room ${roomNumber} understaffed - hire 1 more staff`
              });
            }
          });

          // Check for first aid certification
          if (responses.first_aid_certified === 'no') {
            suggestions.push({
              type: 'warning',
              icon: <Shield className="h-4 w-4" />,
              message: `⚠️ First-aid certification is missing in ${nurseryName}. Complete training immediately.`,
              priority: 'high',
              textFormat: `HIGH PRIORITY: ${nurseryName} missing first-aid certification`
            });
          }

          // Check for staff training
          if (responses.staff_training_complete === 'no') {
            suggestions.push({
              type: 'warning',
              icon: <Calendar className="h-4 w-4" />,
              message: `⚠️ Staff training incomplete in ${nurseryName}. Schedule training sessions.`,
              priority: 'medium',
              textFormat: `MEDIUM PRIORITY: ${nurseryName} staff training incomplete`
            });
          }

          // Check for safeguarding concerns
          if (responses.safeguarding_concerns === 'yes') {
            suggestions.push({
              type: 'warning',
              icon: <Shield className="h-4 w-4" />,
              message: `🚨 Safeguarding concern reported in ${nurseryName}. Immediate attention required.`,
              priority: 'high',
              textFormat: `URGENT: ${nurseryName} safeguarding concern reported`
            });
          }

          // Check for fire safety
          if (responses.fire_safety_check === 'no') {
            suggestions.push({
              type: 'warning',
              icon: <AlertTriangle className="h-4 w-4" />,
              message: `🔴 Fire safety check failed in ${nurseryName}. Address immediately.`,
              priority: 'high',
              textFormat: `HIGH PRIORITY: ${nurseryName} fire safety check failed`
            });
          }

          // Check for staff absences
          if (responses.staff_absences && responses.staff_absences.trim()) {
            suggestions.push({
              type: 'info',
              icon: <Users className="h-4 w-4" />,
              message: `🟡 Staff absences reported in ${nurseryName}: ${responses.staff_absences}. Consider temporary coverage.`,
              priority: 'medium',
              textFormat: `MEDIUM PRIORITY: ${nurseryName} staff absences - ${responses.staff_absences}`
            });
          }

          // Check for attendance trends
          if (responses.attendance_trend === 'increasing') {
            suggestions.push({
              type: 'info',
              icon: <Users className="h-4 w-4" />,
              message: `🟡 Attendance rising in ${nurseryName}. Consider additional part-time staff.`,
              priority: 'medium',
              textFormat: `MEDIUM PRIORITY: ${nurseryName} attendance rising - consider part-time staff`
            });
          } else if (responses.attendance_trend === 'decreasing') {
            suggestions.push({
              type: 'warning',
              icon: <Users className="h-4 w-4" />,
              message: `🟠 Attendance declining in ${nurseryName}. Investigate causes.`,
              priority: 'medium',
              textFormat: `MEDIUM PRIORITY: ${nurseryName} attendance declining`
            });
          }

          // Check for fully compliant branches
          const isFullyCompliant = responses.fire_safety_check === 'yes' &&
                                  responses.first_aid_certified === 'yes' &&
                                  responses.staff_training_complete === 'yes' &&
                                  responses.safeguarding_concerns === 'no' &&
                                  !Object.keys(responses).some(key => 
                                    key.includes('ratio_status') && responses[key] === 'Incorrect Ratio'
                                  );

          if (isFullyCompliant) {
            suggestions.push({
              type: 'success',
              icon: <CheckCircle className="h-4 w-4" />,
              message: `✅ ${nurseryName} is fully compliant and operating optimally.`,
              priority: 'low',
              textFormat: `SUCCESS: ${nurseryName} fully compliant and optimal`
            });
          }
        } catch (subError) {
          console.error('Error processing submission:', subError);
        }
      });

      // Remove duplicates and sort by priority
      const uniqueSuggestions = suggestions.filter((suggestion, index, self) => 
        index === self.findIndex(s => s.message === suggestion.message)
      );

      return uniqueSuggestions
        .sort((a, b) => {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        })
        .slice(0, 8); // Show top 8 suggestions

    } catch (processingError) {
      console.error('Error generating suggestions:', processingError);
      return [{
        type: 'warning',
        icon: <AlertTriangle className="h-4 w-4" />,
        message: 'Error analyzing data. Please refresh to try again.',
        priority: 'medium',
        textFormat: 'ERROR: Failed to analyze data'
      }];
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ['form_submissions_ai'] });
      // Add a delay to show the refresh animation
      setTimeout(() => setIsRefreshing(false), 1500);
    } catch (error) {
      console.error('Error refreshing suggestions:', error);
      setIsRefreshing(false);
    }
  };

  const getCardStyle = (type: string, priority: string) => {
    const baseStyle = "p-4 rounded-lg border-l-4 ";
    
    if (priority === 'high') {
      return baseStyle + "bg-red-50 border-l-red-500";
    } else if (type === 'warning') {
      return baseStyle + "bg-yellow-50 border-l-yellow-500";
    } else if (type === 'success') {
      return baseStyle + "bg-green-50 border-l-green-500";
    } else {
      return baseStyle + "bg-blue-50 border-l-blue-500";
    }
  };

  const getIconColor = (type: string, priority: string) => {
    if (priority === 'high') return 'text-red-600';
    if (type === 'warning') return 'text-yellow-600';
    if (type === 'success') return 'text-green-600';
    return 'text-blue-600';
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 text-xs">🚨 High Priority</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs">⚠️ Medium Priority</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800 text-xs">✅ Low Priority</Badge>;
      default:
        return null;
    }
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              AI-Based Suggestions
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600">Failed to load suggestions</p>
            <p className="text-sm text-gray-500 mt-1">Please check your connection and try again</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const suggestions = generateSuggestions();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            AI-Based Suggestions
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Reanalyze
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            <span className="ml-2 text-gray-600">Analyzing data...</span>
          </div>
        ) : (
          <>
            {suggestions.map((suggestion, index) => (
              <div key={index} className={getCardStyle(suggestion.type, suggestion.priority)}>
                <div className="flex items-start gap-3">
                  <div className={getIconColor(suggestion.type, suggestion.priority)}>
                    {suggestion.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 mb-2">{suggestion.message}</p>
                    {getPriorityBadge(suggestion.priority)}
                  </div>
                </div>
              </div>
            ))}
            
            <div className="text-xs text-gray-500 border-t pt-3">
              <p>Last updated: {new Date().toLocaleTimeString()}</p>
              <p>Analyzed {submissions?.length || 0} form submissions</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AISuggestions;
