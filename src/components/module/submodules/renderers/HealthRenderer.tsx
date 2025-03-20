
import React from 'react';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';
import ConsultationsPage from '../health/ConsultationsPage';
import { SubModule } from '@/data/types/modules';

export const renderHealthSubmodule = (submoduleId: string, submodule: SubModule) => {
  switch (submoduleId) {
    case 'health-consultations':
      return <ConsultationsPage />;
    default:
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};
