
import { AlertTriangle, CheckCircle, Users, Calendar, Shield } from 'lucide-react';
import { parseSubmissionData } from '../utils/dataProcessing';

interface Suggestion {
  type: 'warning' | 'success' | 'info';
  icon: React.ReactNode;
  message: string;
  priority: 'high' | 'medium' | 'low';
  textFormat: string;
}

export const generateSuggestions = (submissions: any[]): Suggestion[] => {
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
