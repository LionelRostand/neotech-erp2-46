
export interface Department {
  id: string;
  name: string;
  description: string;
  managerId: string | null;
  managerName: string | null;
  employeesCount: number;
  color: string;
  employeeIds: string[];
  createdAt?: string;
  updatedAt?: string;
  parentDepartmentId?: string;
}
