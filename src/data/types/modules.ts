
import React from 'react';

export interface AppModule {
  id: number;
  name: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  category: 'business' | 'services' | 'digital' | 'communication';  // Nouvelle propriété de catégorie
  submodules?: SubModule[];
}

export interface SubModule {
  id: string;
  name: string;
  href: string;
  icon: React.ReactNode;
  description?: string; // Added description property as optional
}

// Helper function to create icons without JSX syntax in .ts files
export const createIcon = (Icon: any) => React.createElement(Icon, { size: 24 });

