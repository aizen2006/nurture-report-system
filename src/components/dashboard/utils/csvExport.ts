
import { parseSubmissionData } from './dataProcessing';
import { formatSubmissionDataAsText, generateAISuggestionsText } from './textFormatting';

// Extract all unique response fields from submissions
const extractAllResponseFields = (submissions: any[]): string[] => {
  const fieldsSet = new Set<string>();
  
  submissions.forEach(submission => {
    const parsedData = parseSubmissionData(submission);
    if (parsedData.responses) {
      Object.keys(parsedData.responses).forEach(field => fieldsSet.add(field));
    }
  });
  
  return Array.from(fieldsSet).sort();
};

// Format field name for column header
const formatFieldName = (fieldName: string): string => {
  return fieldName
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
};

// Create CSV content from submissions with each field as column
export const createCSVFromSubmissions = (submissions: any[]) => {
  if (!submissions || submissions.length === 0) return '';
  
  // Extract all unique response fields
  const responseFields = extractAllResponseFields(submissions);
  
  // Create headers: base fields + all response fields
  const baseHeaders = ['ID', 'Timestamp', 'Full Name', 'Email', 'Role', 'Nursery Name'];
  const responseHeaders = responseFields.map(formatFieldName);
  const headers = [...baseHeaders, ...responseHeaders];
  
  // Create rows
  const csvRows = [
    headers.join(','),
    ...submissions.map((submission, index) => {
      const parsedData = parseSubmissionData(submission);
      
      // Base row data
      const baseRow = [
        index + 1,
        parsedData.timestamp || submission.submitted_at,
        `"${submission.full_name || ''}"`,
        `"${submission.email || ''}"`,
        `"${submission.role || ''}"`,
        `"${parsedData.nursery_name || ''}"`,
      ];
      
      // Response data for each field
      const responseRow = responseFields.map(field => {
        const value = parsedData.responses?.[field];
        if (value === undefined || value === null) return '""';
        if (typeof value === 'boolean') return `"${value ? 'Yes' : 'No'}"`;
        if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
        return `"${String(value).replace(/"/g, '""')}"`;
      });
      
      return [...baseRow, ...responseRow].join(',');
    })
  ];
  
  return csvRows.join('\n');
};

// Legacy function for backward compatibility
export const createCSVFromData = (data: any[]) => {
  if (!data || data.length === 0) return '';
  
  const headers = ['ID', 'Timestamp', 'Full Name', 'Email', 'Role', 'Nursery', 'Total Questions', 'Answered Questions', 'Compliance Rate', 'Complete Form Data'];
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
      `"${(row.complete_form_data || '').replace(/"/g, '""')}"`
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
