
export interface TimeReport {
  id?: string;
  title: string;
  employeeId: string;
  employeeName: string;
  employeePhoto?: string;
  managerId?: string;
  managerName?: string;
  departmentId?: string;
  departmentName?: string;
  startDate: string;
  endDate: string;
  status: 'En cours' | 'Soumis' | 'Validé' | 'Rejeté';
  totalHours: number;
  weeklyHours?: {
    [week: string]: number;
  };
  comments?: string;
  lastUpdateBy?: string;
  lastUpdateText?: string;
  lastUpdateDate?: string;
  createdAt?: string;
  updatedAt?: string;
}
