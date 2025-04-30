
import React, { useState, useEffect } from 'react';
import { Employee } from '@/types/employee';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { OrganizationChart } from './OrganizationChart';
import { Skeleton } from '@/components/ui/skeleton';
import { OrgChartNode } from './types';

const EmployeesHierarchy: React.FC = () => {
  const { employees, isLoading } = useEmployeeData();
  const [orgData, setOrgData] = useState<OrgChartNode | null>(null);
  
  // Transformation des données des employés en hiérarchie
  useEffect(() => {
    if (!employees || employees.length === 0) return;
    
    // Créer la hiérarchie
    buildOrgChart();
  }, [employees]);
  
  const buildOrgChart = () => {
    // Vérifier que nous avons des données
    if (!employees || !Array.isArray(employees) || employees.length === 0) {
      console.log("No employee data available to build hierarchy");
      return;
    }
    
    // Trouver le PDG/directeur (sans manager)
    const topLevelManagers = employees.filter(emp => 
      !emp.managerId && (emp.isManager || emp.position?.toLowerCase().includes('directeur') || emp.position?.toLowerCase().includes('ceo'))
    );
    
    // Si aucun employé de haut niveau n'est trouvé, utiliser le premier employé
    let root: Employee;
    if (topLevelManagers.length === 0) {
      console.log("No top level manager found, using first employee as root");
      root = employees[0];
    } else {
      root = topLevelManagers[0];
    }
    
    // Construire la hiérarchie récursivement
    const rootNode = buildHierarchyNode(root);
    setOrgData(rootNode);
  };
  
  const buildHierarchyNode = (employee: Employee): OrgChartNode => {
    // Trouver les subordonnés directs
    const subordinates = employees.filter(emp => 
      emp.managerId === employee.id || emp.manager === employee.id
    );
    
    return {
      id: employee.id,
      name: `${employee.firstName} ${employee.lastName}`,
      title: employee.position || "Non spécifié",
      photo: employee.photoURL || employee.photo,
      department: employee.department,
      email: employee.email,
      phone: employee.phone,
      children: subordinates.map(sub => buildHierarchyNode(sub))
    };
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Hiérarchie</h1>
        <div className="flex flex-col gap-4 items-center">
          <Skeleton className="h-12 w-full max-w-sm" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Hiérarchie</h1>
      
      {employees && employees.length > 0 ? (
        orgData ? (
          <OrganizationChart data={orgData} />
        ) : (
          <div className="text-center py-12 border rounded-md bg-slate-50">
            <p className="text-lg text-muted-foreground">
              Construction de l'organigramme en cours...
            </p>
          </div>
        )
      ) : (
        <div className="text-center py-12 border rounded-md bg-slate-50">
          <p className="text-lg text-muted-foreground">
            Aucune donnée d'employé disponible pour créer l'organigramme.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Ajoutez des employés avec leurs relations managériales pour visualiser la structure.
          </p>
        </div>
      )}
    </div>
  );
};

export default EmployeesHierarchy;
