
import React from 'react';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';
import DashboardPage from '../library/DashboardPage';
import BooksPage from '../library/BooksPage';
import CatalogPage from '../library/CatalogPage';
import MembersPage from '../library/MembersPage';
import SettingsPage from '../library/SettingsPage';
import { SubModule } from '@/data/types/modules';

export const renderLibrarySubmodule = (submoduleId: string, submodule: SubModule) => {
  console.log(`Rendering library submodule: ${submoduleId}`);
  
  switch (submoduleId) {
    case 'library-dashboard':
      return <DashboardPage />;
    case 'library-books':
      return <BooksPage />;
    case 'library-catalog':
      return <CatalogPage />;
    case 'library-members':
      console.log('Rendering MembersPage component');
      return <MembersPage />;
    case 'library-settings':
      return <SettingsPage />;
    default:
      console.warn(`Unknown library submodule: ${submoduleId}`);
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};
