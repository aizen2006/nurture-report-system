
import { SubmissionData, ComplianceData, RecentEntry, Alert } from '../types';

// Helper function to safely parse submission data
export const parseSubmissionData = (data: any): SubmissionData => {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return {};
    }
  }
  return data || {};
};

// Calculate compliance data from submissions
export const calculateComplianceData = (submissions: any[]): ComplianceData => {
  if (!submissions || submissions.length === 0) {
    return {
      overall: 0,
      managers: 0,
      deputies: 0,
      roomLeaders: 0,
      areaManagers: 0
    };
  }

  const roleGroups = submissions.reduce((acc, submission) => {
    const role = submission.role;
    if (!acc[role]) acc[role] = [];
    acc[role].push(submission);
    return acc;
  }, {} as Record<string, any[]>);

  const calculateRoleCompliance = (roleSubmissions: any[]) => {
    if (roleSubmissions.length === 0) return 0;
    const totalQuestions = roleSubmissions.reduce((sum, sub) => {
      const parsedData = parseSubmissionData(sub.submission_data);
      return sum + (parsedData.total_questions || 0);
    }, 0);
    const answeredQuestions = roleSubmissions.reduce((sum, sub) => {
      const parsedData = parseSubmissionData(sub.submission_data);
      return sum + (parsedData.answered_questions || 0);
    }, 0);
    return totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
  };

  const totalQuestions = submissions.reduce((sum, sub) => {
    const parsedData = parseSubmissionData(sub.submission_data);
    return sum + (parsedData.total_questions || 0);
  }, 0);
  
  const totalAnswered = submissions.reduce((sum, sub) => {
    const parsedData = parseSubmissionData(sub.submission_data);
    return sum + (parsedData.answered_questions || 0);
  }, 0);

  return {
    overall: totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0,
    managers: calculateRoleCompliance(roleGroups['Manager'] || []),
    deputies: calculateRoleCompliance(roleGroups['Deputy Manager'] || []),
    roomLeaders: calculateRoleCompliance(roleGroups['Room Leader'] || []),
    areaManagers: calculateRoleCompliance(roleGroups['Area Manager'] || [])
  };
};

// Get recent entries from submissions
export const getRecentEntries = (submissions: any[]): RecentEntry[] => {
  if (!submissions) return [];
  return submissions.slice(0, 4).map(sub => {
    const parsedData = parseSubmissionData(sub.submission_data);
    return {
      role: sub.role,
      location: parsedData.nursery_name || 'Unknown',
      status: 'complete',
      time: new Date(sub.submitted_at).toLocaleString()
    };
  });
};

// Get alerts from submissions
export const getAlertsFromSubmissions = (submissions: any[]): Alert[] => {
  if (!submissions) return [];
  const alerts: Alert[] = [];
  
  submissions.forEach(sub => {
    const parsedData = parseSubmissionData(sub.submission_data);
    const responses = parsedData.responses || {};
    
    // Check for safeguarding concerns
    if (responses.safeguarding_concerns === 'yes') {
      alerts.push({
        type: 'safeguarding',
        message: `Safeguarding concern reported by ${sub.full_name}`,
        severity: 'high'
      });
    }
    
    // Check for staff absences
    const absenceFields = Object.keys(responses).filter(key => key.includes('absences'));
    const hasAbsences = absenceFields.some(field => responses[field] && responses[field].trim());
    if (hasAbsences) {
      alerts.push({
        type: 'staffing',
        message: `Staff absences reported by ${sub.full_name}`,
        severity: 'medium'
      });
    }
    
    // Check for ratio issues
    const ratioFields = Object.keys(responses).filter(key => key.includes('ratio_status'));
    const hasIncorrectRatios = ratioFields.some(field => responses[field] === 'Incorrect Ratio');
    if (hasIncorrectRatios) {
      alerts.push({
        type: 'ratio',
        message: `Incorrect staff ratios reported by ${sub.full_name}`,
        severity: 'high'
      });
    }
  });
  
  return alerts.slice(0, 5); // Show only latest 5 alerts
};
