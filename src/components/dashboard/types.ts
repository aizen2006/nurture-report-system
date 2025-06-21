
// Type definitions for dashboard components
export interface SubmissionData {
  nursery_name?: string;
  total_questions?: number;
  answered_questions?: number;
  responses?: Record<string, any>;
  [key: string]: any;
}

export interface RecentEntry {
  role: string;
  location: string;
  status: string;
  time: string;
}

export interface Alert {
  type: string;
  message: string;
  severity: string;
}

export interface ComplianceData {
  overall: number;
  managers: number;
  deputies: number;
  roomLeaders: number;
  areaManagers: number;
}
