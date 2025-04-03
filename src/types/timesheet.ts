
export type TimeReportStatus = "En cours" | "Soumis" | "Validé" | "Rejeté";

export interface TimeReport {
  id: string;
  title: string;
  employeeName: string;
  employeeId?: string;
  employeePhoto?: string;
  startDate: string;
  endDate: string;
  totalHours: number;
  status: TimeReportStatus;
  lastUpdated: string;
  lastUpdateText?: string;
  description?: string;
  tasks?: string;
  comments?: string;
  updatedAt?: string;
  createdAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  submittedAt?: string;
  rejectionReason?: string;
}
