
export type TimeReportStatus = "En cours" | "Soumis" | "Validé" | "Rejeté";

export interface TimeReport {
  id: string;
  title: string;
  employeeId: string;
  employeeName: string;
  employeePhoto?: string;
  startDate: string;
  endDate: string;
  totalHours: number;
  status: TimeReportStatus;
  createdAt?: string;
  updatedAt?: string;
  lastUpdated: string;
  lastUpdateText: string;
  submittedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  comments?: string;
  details?: TimeReportDetail[];
}

export interface TimeReportDetail {
  date: string;
  hours: number;
  project?: string;
  description?: string;
}

export interface TimeSheetEntry {
  day: string;
  date: string;
  hours: number;
  project?: string;
  task?: string;
}

export interface WeekReport {
  weekStartDate: string;
  weekEndDate: string;
  entries: TimeSheetEntry[];
  totalHours: number;
  status: TimeReportStatus;
}
