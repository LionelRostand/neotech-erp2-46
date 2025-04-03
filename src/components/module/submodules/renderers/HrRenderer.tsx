
import React from 'react';
import { SubModule } from '@/data/types/modules';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';
import EmployeesTrainings from '../EmployeesTrainings';
import EmployeesEvaluations from '../EmployeesEvaluations';
import EmployeesDocuments from '../EmployeesDocuments';
import EmployeesContracts from '../EmployeesContracts';
import SalarySlips from '../salaries/SalarySlips';

export const renderHrSubmodule = (submoduleId: string, submodule: SubModule) => {
  console.log('Rendering HR submodule:', submoduleId);
  
  switch (submoduleId) {
    case 'employees-trainings':
      return <EmployeesTrainings />;
    case 'employees-evaluations':
      return <EmployeesEvaluations />;
    case 'employees-documents':
      return <EmployeesDocuments />;
    case 'employees-contracts':
      return <EmployeesContracts />;
    case 'employees-salaries':
      return <SalarySlips />;
    default:
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};
