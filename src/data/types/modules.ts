
import React from 'react';

export interface AppModule {
  id: number;
  name: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  submodules?: SubModule[];
}

export interface SubModule {
  id: string;
  name: string;
  href: string;
  icon: React.ReactNode;
}

// Helper function to create icons without JSX syntax in .ts files
export const createIcon = (Icon: any) => React.createElement(Icon, { size: 24 });
