
import React from 'react';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';
import DashboardPage from '../library/DashboardPage';
import BooksPage from '../library/BooksPage';
import { SubModule } from '@/data/types/modules';

export const renderLibrarySubmodule = (submoduleId: string, submodule: SubModule) => {
  switch (submoduleId) {
    case 'library-dashboard':
      return <DashboardPage />;
    case 'library-books':
      return <BooksPage />;
    case 'library-catalog':
    case 'library-members':
    case 'library-settings':
      return <DefaultSubmoduleContent submodule={submodule} />;
    default:
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};
