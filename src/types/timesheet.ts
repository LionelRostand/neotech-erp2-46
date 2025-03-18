
export type TimeReportStatus = "En cours" | "Soumis" | "Validé" | "Rejeté";

export interface TimeReport {
  id: string;
  title: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  totalHours: number;
  status: TimeReportStatus;
  lastUpdated: string;
}
