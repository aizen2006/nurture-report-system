
import { parseSubmissionData } from './dataProcessing';

// Convert form submission data to text format for CSV export
export const formatSubmissionDataAsText = (submissions: any[]) => {
  return submissions.map((sub, index) => {
    const parsedData = parseSubmissionData(sub.submission_data);
    const responses = parsedData.responses || {};
    
    // Create a readable text summary
    const complianceItems = [];
    if (responses.fire_safety_check === 'yes') complianceItems.push('Fire Safety: ✓');
    else if (responses.fire_safety_check === 'no') complianceItems.push('Fire Safety: ✗');
    
    if (responses.first_aid_certified === 'yes') complianceItems.push('First Aid: ✓');
    else if (responses.first_aid_certified === 'no') complianceItems.push('First Aid: ✗');
    
    if (responses.staff_training_complete === 'yes') complianceItems.push('Training: ✓');
    else if (responses.staff_training_complete === 'no') complianceItems.push('Training: ✗');
    
    if (responses.safeguarding_concerns === 'no') complianceItems.push('Safeguarding: ✓');
    else if (responses.safeguarding_concerns === 'yes') complianceItems.push('Safeguarding: CONCERN');

    // Room ratios
    const roomInfo = [];
    Object.keys(responses).forEach(key => {
      if (key.includes('_children') && !key.includes('ratio')) {
        const roomMatch = key.match(/room_(\d+)_children/);
        if (roomMatch) {
          const roomNum = roomMatch[1];
          const children = responses[key];
          const staff = responses[`room_${roomNum}_staff`];
          const status = responses[`room_${roomNum}_ratio_status`];
          if (children && staff) {
            roomInfo.push(`Room ${roomNum}: ${children} children, ${staff} staff (${status || 'Unknown'})`);
          }
        }
      }
    });

    const textSummary = [
      `Branch: ${parsedData.nursery_name || 'Unknown'}`,
      `Compliance: ${complianceItems.join(', ')}`,
      `Rooms: ${roomInfo.join(' | ')}`,
      `Staff Absences: ${responses.staff_absences || 'None'}`,
      `Attendance Trend: ${responses.attendance_trend || 'Unknown'}`,
      `Weekly Attendance: ${responses.weekly_attendance || 'N/A'}`,
      `Monthly Enrollment: ${responses.monthly_enrollment || 'N/A'}`
    ].join(' | ');

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
      response_summary: textSummary
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
