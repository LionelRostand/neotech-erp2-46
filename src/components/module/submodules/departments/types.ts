
export interface Department {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
  managerName?: string;
  employeesCount?: number;
  employeeIds?: string[];
  budget?: number;
  color?: string;
  createdAt?: string;
  updatedAt?: string;
}
