
import type { Employee } from '@/types/employee';

export interface HierarchyNode {
  id: string;
  name?: string;
  title?: string;
  position?: string;
  department?: string;
  departmentColor?: string;
  imageUrl?: string;
  employee: Employee;
  children: HierarchyNode[];
}

export type ChartNode = Omit<HierarchyNode, 'employee'> & {
  id: string;
  name: string;
  position: string;
  department?: string;
  departmentColor?: string;
  imageUrl?: string;
  children: ChartNode[];
};

export type { Employee };
