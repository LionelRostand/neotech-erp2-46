
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
export const createIcon = (Icon: any) => <Icon className="h-5 w-5" />;
