
import { ReactNode } from 'react';

export interface SubModule {
  id: string;
  name: string;
  href: string;
  icon: ReactNode;
}

export interface SubmoduleProps {
  submoduleId?: string;
  submodule?: SubModule;
}

export interface AppModule {
  id: number;
  name: string;
  description: string;
  href: string;
  icon: ReactNode;
  category: string;
  submodules?: SubModule[];
}

// Helper function to create icon components
export const createIcon = (Icon: any): ReactNode => <Icon className="h-5 w-5" />;

export interface GarageMaintenance {
  id: string;
  vehicleId: string;
  clientId: string;
  mechanicId: string;
  description: string;
  date: string;
  status: string;
  totalCost: number;
  services: Array<{
    serviceId: string;
    quantity: number;
    cost: number;
  }>;
  notes?: string;
}

