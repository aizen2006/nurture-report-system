
import { parseSubmissionData } from './dataProcessing';
import { formatSubmissionDataAsText, generateAISuggestionsText } from './textFormatting';

// Create CSV content from data array
export const createCSVFromData = (data: any[]) => {
  if (!data || data.length === 0) return '';
  
  const headers = ['ID', 'Timestamp', 'Full Name', 'Email', 'Role', 'Nursery', 'Total Questions', 'Answered Questions', 'Compliance Rate', 'Response Summary'];
  const csvRows = [
    headers.join(','),
    ...data.map(row => [
      row.id,
      row.timestamp,
      `"${row.full_name || ''}"`,
      `"${row.email || ''}"`,
      `"${row.role || ''}"`,
      `"${row.nursery_name || ''}"`,
      row.total_questions || 0,
      row.answered_questions || 0,
      `${row.compliance_rate || 0}%`,
      `"${row.response_summary || ''}"`
    ].join(','))
  ];
  
  return csvRows.join('\n');
};

// Create AI Suggestions CSV
export const createAISuggestionsCSV = (submissions: any[]) => {
  const suggestions = generateAISuggestionsText(submissions);
  
  const headers = ['Priority', 'Suggestion', 'Timestamp'];
  const csvRows = [
    headers.join(','),
    ...suggestions.map((suggestion, index) => [
      `"${suggestion.includes('HIGH PRIORITY') ? 'High'
        : suggestion.includes('MEDIUM PRIORITY') ? 'Medium'
        : suggestion.includes('URGENT') ? 'Urgent'
        : 'Low'}"`,
      `"${suggestion}"`,
      `"${new Date().toISOString()}"`
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

// Format submissions data for CSV export with enhanced text format
export const formatSubmissionsForCSV = (submissions: any[]) => {
  return formatSubmissionDataAsText(submissions);
};
