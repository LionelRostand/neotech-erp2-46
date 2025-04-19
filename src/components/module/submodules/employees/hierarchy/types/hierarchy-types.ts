
import type { Employee } from '@/types/employee';

export interface HierarchyNode {
  id: string;
  name?: string;
  title?: string;
  position?: string;
  department?: string;
  departmentColor?: string;
  imageUrl?: string;
  employee?: Employee; // Make employee optional
  children: HierarchyNode[];
}

export type ChartNode = {
  id: string;
  name: string;
  position: string;
  department?: string;
  departmentColor?: string;
  imageUrl?: string;
  children: ChartNode[];
  employee?: Employee; // Add employee field to ChartNode
};

export type { Employee };
