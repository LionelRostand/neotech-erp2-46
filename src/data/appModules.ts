
import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Warehouse, 
  PackageOpen, 
  LineChart, 
  Users, 
  Truck, 
  Settings,
  AppWindow,
  Database,
  FileText
} from 'lucide-react';

export interface AppModule {
  id: number;
  name: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

// Create icon elements as functions to avoid JSX syntax in .ts file
const createIcon = (Icon: any) => React.createElement(Icon, { size: 24 });

// Empty modules array - all modules have been removed
export const modules: AppModule[] = [];
