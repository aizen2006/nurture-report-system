
import { parseSubmissionData } from './dataProcessing';

// Create CSV content from data array
export const createCSVFromData = (data: any[]) => {
  if (!data || data.length === 0) return '';
  
  const headers = ['ID', 'Timestamp', 'Full Name', 'Email', 'Role', 'Nursery', 'Total Questions', 'Answered Questions', 'Compliance Rate'];
  const csvRows = [
    headers.join(','),
    ...data.map(row => [
      row.id,
      row.timestamp,
      `"${row.full_name}"`,
      row.email,
      `"${row.role}"`,
      `"${row.nursery_name}"`,
      row.total_questions,
      row.answered_questions,
      `${row.compliance_rate}%`
    ].join(','))
  ];
  
  return csvRows.join('\n');
};

// Download CSV file
export const downloadCSV = (csvContent: string, filename: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Format submissions data for CSV export
export const formatSubmissionsForCSV = (submissions: any[]) => {
  return submissions.map((sub, index) => {
    const parsedData = parseSubmissionData(sub.submission_data);
    return {
      id: index + 1, // Use index as ID since there's no actual ID field
      timestamp: sub.submitted_at,
      full_name: sub.full_name,
      email: sub.email,
      role: sub.role,
      nursery_name: parsedData.nursery_name || '',
      total_questions: parsedData.total_questions || 0,
      answered_questions: parsedData.answered_questions || 0,
      compliance_rate: parsedData.total_questions > 0 
        ? Math.round((parsedData.answered_questions / parsedData.total_questions) * 100) 
        : 0
    };
  });
};
