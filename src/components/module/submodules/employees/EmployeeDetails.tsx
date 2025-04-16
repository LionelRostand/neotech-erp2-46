
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { getEmployee } from './services/employeeService';
import { Employee } from '@/types/employee';
import { toast } from 'sonner';
import { updateEmployeeDoc } from '@/services/employeeService';
import EmployeeProfileView from './EmployeeProfileView';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Loader2 } from 'lucide-react';

export interface EmployeeDetailsProps {
  employee?: Employee;
  onExportPdf?: () => void;
  onEdit?: () => void;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ 
  employee: propEmployee, 
  onExportPdf,
  onEdit
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(propEmployee || null);
  const [loading, setLoading] = useState<boolean>(!propEmployee);

  useEffect(() => {
    if (id) {
      fetchEmployeeData(id);
    }
  }, [id]);

  const fetchEmployeeData = async (employeeId: string) => {
    try {
      setLoading(true);
      
      // First try to get the employee from the direct route
      const docRef = doc(db, COLLECTIONS.HR.EMPLOYEES, employeeId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = {
          id: docSnap.id,
          ...docSnap.data()
        } as Employee;
        
        console.log('Employee data fetched:', data);
        setEmployee(data);
      } else {
        // Try to get from the service as a fallback
        const serviceData = await getEmployee(employeeId);
        if (serviceData) {
          setEmployee(serviceData);
        } else {
          toast.error("Impossible de trouver cet employé");
          navigate('/modules/employees/profiles');
        }
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
      toast.error("Une erreur s'est produite lors de la récupération des données de l'employé");
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeUpdated = async () => {
    if (id) {
      await fetchEmployeeData(id);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center text-red-500">
          Employé non trouvé
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <EmployeeProfileView 
        employee={employee} 
        isLoading={loading}
        onEmployeeUpdated={handleEmployeeUpdated}
      />
    </div>
  );
};

export default EmployeeDetails;
