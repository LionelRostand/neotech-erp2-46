
export interface Department {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
  managerName?: string;
  color?: string;
  employeeCount?: number;
  createdAt?: string;
  updatedAt?: string;
  parentDepartmentId?: string;
}
