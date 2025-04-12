
export interface Department {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
  managerName?: string;
  employeesCount?: number;
  color?: string;
  employeeIds?: string[];
  createdAt?: string;
  updatedAt?: string;
  parentDepartmentId?: string;
}
