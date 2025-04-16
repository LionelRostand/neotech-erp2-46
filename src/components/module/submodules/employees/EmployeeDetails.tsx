
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { Employee } from '@/types/employee';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import EmployeeProfileView from './EmployeeProfileView';
import { Skeleton } from '@/components/ui/skeleton';

const EmployeeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { employees } = useHrModuleData();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && employees.length > 0) {
      const foundEmployee = employees.find(emp => emp.id === id);
      if (foundEmployee) {
        setEmployee(foundEmployee);
      }
      setLoading(false);
    }
  }, [id, employees]);

  const handleBack = () => {
    navigate('/modules/employees/profiles');
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Button variant="ghost" onClick={handleBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        
        <Skeleton className="h-[300px] w-full rounded-md" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="container mx-auto p-6">
        <Button variant="ghost" onClick={handleBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <h2 className="text-2xl font-bold mb-2">Employé non trouvé</h2>
          <p className="text-gray-500 mb-6">
            L'employé avec l'identifiant {id} n'existe pas ou n'est plus disponible.
          </p>
          <Button onClick={handleBack}>
            Retourner à la liste des employés
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={handleBack}>
        <ChevronLeft className="mr-2 h-4 w-4" />
        Retour à la liste des employés
      </Button>
      
      <EmployeeProfileView employee={employee} />
    </div>
  );
};

export default EmployeeDetails;
