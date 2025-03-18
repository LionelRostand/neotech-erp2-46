
import React from 'react';
import DefaultSubmoduleContent from './submodules/DefaultSubmoduleContent';
import SubmoduleHeader from './submodules/SubmoduleHeader';
import { modules } from '@/data/modules';
import EmployeesAttendance from './submodules/EmployeesAttendance';
import EmployeesBadges from './submodules/EmployeesBadges';
import EmployeesDashboard from './submodules/EmployeesDashboard';
import EmployeesDepartments from './submodules/EmployeesDepartments';
import EmployeesHierarchy from './submodules/EmployeesHierarchy';
import EmployeesProfiles from './submodules/EmployeesProfiles';
import EmployeesTimesheet from './submodules/EmployeesTimesheet';
import EmployeesReports from './submodules/EmployeesReports';
import EmployeesLeaves from './submodules/EmployeesLeaves';
import FreightDashboard from './submodules/FreightDashboard';
import FreightShipments from './submodules/FreightShipments';

interface SubmodulePageProps {
  moduleId: number;
  submoduleId: string;
}

const SubmodulePage: React.FC<SubmodulePageProps> = ({ moduleId, submoduleId }) => {
  // Find the module
  const module = modules.find(m => m.id === moduleId);
  if (!module) return <div>Module not found</div>;
  
  // Find the submodule
  const submodule = module.submodules.find(sm => sm.id === submoduleId);
  if (!submodule) return <div>Submodule not found</div>;
  
  // Render the appropriate component based on submoduleId
  const renderSubmoduleContent = () => {
    switch (submoduleId) {
      // Employees module
      case 'employees-dashboard':
        return <EmployeesDashboard />;
      case 'employees-profiles':
        return <EmployeesProfiles />;
      case 'employees-badges':
        return <EmployeesBadges />;
      case 'employees-departments':
        return <EmployeesDepartments />;
      case 'employees-hierarchy':
        return <EmployeesHierarchy />;
      case 'employees-attendance':
        return <EmployeesAttendance />;
      case 'employees-timesheet':
        return <EmployeesTimesheet />;
      case 'employees-leaves':
        return <EmployeesLeaves />;
      case 'employees-reports':
        return <EmployeesReports />;
      
      // Freight module
      case 'freight-dashboard':
        return <FreightDashboard />;
      case 'freight-shipments':
        return <FreightShipments />;
      
      // Default fallback
      default:
        return <DefaultSubmoduleContent submoduleName={submodule.name} />;
    }
  };

  return (
    <div className="space-y-6">
      <SubmoduleHeader 
        moduleName={module.name}
        submoduleName={submodule.name}
        icon={submodule.icon}
      />
      {renderSubmoduleContent()}
    </div>
  );
};

export default SubmodulePage;
