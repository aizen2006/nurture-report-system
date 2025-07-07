
import { parseSubmissionData } from './dataProcessing';

// Convert complete JSON submission data to readable text format
export const formatCompleteSubmissionData = (submissionData: any) => {
  if (!submissionData || typeof submissionData !== 'object') {
    return 'No data available';
  }

  const formatValue = (value: any, depth = 0): string => {
    const indent = '  '.repeat(depth);
    
    if (value === null || value === undefined) {
      return 'N/A';
    }
    
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    if (typeof value === 'string' || typeof value === 'number') {
      return String(value);
    }
    
    if (Array.isArray(value)) {
      if (value.length === 0) return '[]';
      return '[\n' + value.map(item => indent + '  - ' + formatValue(item, depth + 1)).join('\n') + '\n' + indent + ']';
    }
    
    if (typeof value === 'object') {
      const entries = Object.entries(value);
      if (entries.length === 0) return '{}';
      return '{\n' + entries.map(([key, val]) => 
        indent + '  ' + key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + ': ' + formatValue(val, depth + 1)
      ).join('\n') + '\n' + indent + '}';
    }
    
    return String(value);
  };

  const formattedEntries = Object.entries(submissionData)
    .map(([key, value]) => {
      const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      return `${formattedKey}: ${formatValue(value)}`;
    });

  return formattedEntries.join('\n\n');
};

// Convert form submission data to text format for CSV export (LEGACY - kept for compatibility)
export const formatSubmissionDataAsText = (submissions: any[]) => {
  return submissions.map((sub, index) => {
    const parsedData = parseSubmissionData(sub.submission_data);
    
    return {
      id: index + 1,
      timestamp: sub.submitted_at,
      full_name: sub.full_name,
      email: sub.email,
      role: sub.role,
      nursery_name: parsedData.nursery_name || '',
      total_questions: parsedData.total_questions || 0,
      answered_questions: parsedData.answered_questions || 0,
      compliance_rate: parsedData.total_questions > 0 
        ? Math.round((parsedData.answered_questions / parsedData.total_questions) * 100) 
        : 0,
      complete_form_data: formatCompleteSubmissionData(sub.submission_data)
    };
  });
};

// Generate AI suggestions in text format
export const generateAISuggestionsText = (submissions: any[]) => {
  if (!submissions || submissions.length === 0) {
    return ['No data available for analysis. Submit forms to get AI suggestions.'];
  }

  const suggestions: string[] = [];

  submissions.forEach(sub => {
    const data = parseSubmissionData(sub.submission_data);
    const responses = data.responses || {};
    const nurseryName = data.nursery_name || 'Unknown Branch';

    // Check for understaffing
    Object.keys(responses).forEach(key => {
      if (key.includes('ratio_status') && responses[key] === 'Incorrect Ratio') {
        const roomMatch = key.match(/room_(\d+)/);
        const roomNumber = roomMatch ? roomMatch[1] : 'Unknown';
        suggestions.push(`HIGH PRIORITY: ${nurseryName}, Room ${roomNumber} is understaffed. Hire 1 more staff member.`);
      }
    });

    // Check compliance issues
    if (responses.first_aid_certified === 'no') {
      suggestions.push(`HIGH PRIORITY: First-aid certification missing in ${nurseryName}. Complete training immediately.`);
    }

    if (responses.staff_training_complete === 'no') {
      suggestions.push(`MEDIUM PRIORITY: Staff training incomplete in ${nurseryName}. Schedule training sessions.`);
    }

    if (responses.safeguarding_concerns === 'yes') {
      suggestions.push(`URGENT: Safeguarding concern reported in ${nurseryName}. Immediate attention required.`);
    }

    if (responses.fire_safety_check === 'no') {
      suggestions.push(`HIGH PRIORITY: Fire safety check failed in ${nurseryName}. Address immediately.`);
    }

    // Check for staff absences
    if (responses.staff_absences && responses.staff_absences.trim()) {
      suggestions.push(`MEDIUM PRIORITY: Staff absences reported in ${nurseryName}. Consider temporary staff coverage.`);
    }

    // Check attendance trends
    if (responses.attendance_trend === 'increasing') {
      suggestions.push(`INFO: Attendance rising in ${nurseryName}. Consider additional part-time staff.`);
    } else if (responses.attendance_trend === 'decreasing') {
      suggestions.push(`MEDIUM PRIORITY: Attendance declining in ${nurseryName}. Investigate causes.`);
    }
  });

  // Remove duplicates and return unique suggestions
  return [...new Set(suggestions)].slice(0, 10);
};
