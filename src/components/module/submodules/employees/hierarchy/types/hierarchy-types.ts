
import type { Employee } from '@/types/employee';

export interface HierarchyNode {
  employee: Employee;
  children: HierarchyNode[];
}

export type { Employee };
