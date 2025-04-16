
import React from 'react';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { Card, CardContent } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import { Department } from '../../departments/types';

interface DepartmentNodeProps {
  department: Department;
  level?: number;
  allDepartments: Department[];
}

const DepartmentNode: React.FC<DepartmentNodeProps> = ({ department, level = 0, allDepartments }) => {
  // Find child departments that have this department as their parent
  const childDepartments = allDepartments.filter(dept => dept.parentId === department.id);

  return (
    <div style={{ marginLeft: `${level * 40}px` }} className="mb-4">
      <Card className="border-l-4" style={{ borderLeftColor: department.color || '#4f46e5' }}>
        <CardContent className="flex items-center p-4">
          <Building2 className="h-6 w-6 mr-3 text-gray-500" />
          <div>
            <h3 className="font-medium">{department.name}</h3>
            {department.managerName && (
              <p className="text-sm text-gray-500">Manager: {department.managerName}</p>
            )}
            <p className="text-xs text-gray-400">{department.employeesCount} employés</p>
          </div>
        </CardContent>
      </Card>
      
      {childDepartments.length > 0 && (
        <div className="pl-4 mt-2 border-l border-gray-200">
          {childDepartments.map((childDept) => (
            <DepartmentNode 
              key={childDept.id}
              department={childDept}
              level={level + 1}
              allDepartments={allDepartments}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const DepartmentHierarchy: React.FC = () => {
  const { departments } = useEmployeeData();
  const rootDepartments = departments.filter(dept => !dept.parentId);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-6">Hiérarchie des Départements</h2>
      <div className="space-y-4">
        {rootDepartments.map(dept => (
          <DepartmentNode 
            key={dept.id} 
            department={dept} 
            allDepartments={departments} 
          />
        ))}
      </div>
    </div>
  );
};

export default DepartmentHierarchy;
