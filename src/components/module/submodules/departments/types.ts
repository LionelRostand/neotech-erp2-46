
export interface Department {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
  managerName?: string | null;
  employeeIds?: string[];
  employeesCount?: number;
  color?: string;
  companyId?: string;
}
