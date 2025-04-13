
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { EmployeeFormValues } from './employeeFormSchema';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Employee } from '@/types/employee';

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting?: boolean;
  form?: UseFormReturn<EmployeeFormValues>;
  showManagerOption?: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ 
  onCancel, 
  isSubmitting = false,
  form,
  showManagerOption = true
}) => {
  const [managers, setManagers] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Récupérer la liste des employés directement depuis Firestore
  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        // Créer une requête pour récupérer les employés actifs
        const employeesRef = collection(db, COLLECTIONS.HR.EMPLOYEES);
        const employeesQuery = query(
          employeesRef, 
          // Élargir la requête pour inclure plus de statuts possibles et ne pas manquer d'employés
          where('status', 'in', ['active', 'Active', 'Actif', 'active', 'ACTIVE'])
        );
        
        const employeesSnapshot = await getDocs(employeesQuery);
        
        // Transformer les documents en objets employés
        const employeesList = employeesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Employee[];
        
        // Pour le débogage
        console.log("Liste complète des employés récupérés:", employeesList.map(e => `${e.firstName} ${e.lastName} (${e.id}) - Statut: ${e.status}`));
        
        // S'assurer que tous les employés sont inclus, même sans filtrage de statut si aucun n'est trouvé
        let finalEmployeesList = employeesList;
        if (employeesList.length === 0) {
          // Récupérer tous les employés sans filtre si la première requête ne trouve rien
          const allEmployeesRef = collection(db, COLLECTIONS.HR.EMPLOYEES);
          const allEmployeesSnapshot = await getDocs(allEmployeesRef);
          finalEmployeesList = allEmployeesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Employee[];
          console.log("Récupération de tous les employés sans filtre:", finalEmployeesList.length);
        }
        
        // Trier les employés par nom
        const sortedEmployees = finalEmployeesList.sort((a, b) => 
          `${a.lastName || ''} ${a.firstName || ''}`.localeCompare(`${b.lastName || ''} ${b.firstName || ''}`)
        );
        
        console.log(`Employés récupérés depuis Firestore: ${sortedEmployees.length}`);
        
        // Vérifier si LIONEL DJOSSA est dans la liste
        const lionelExists = sortedEmployees.some(
          emp => emp.firstName?.toLowerCase().includes('lionel') && 
                 emp.lastName?.toLowerCase().includes('djossa')
        );
        console.log("LIONEL DJOSSA est-il dans la liste?", lionelExists);
        
        setManagers(sortedEmployees);
      } catch (error) {
        console.error('Erreur lors de la récupération des employés:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (showManagerOption && form) {
      fetchEmployees();
    }
  }, [showManagerOption, form]);
  
  return (
    <div className="space-y-4">
      {form && showManagerOption && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="managerId" className="text-right">
            Responsable
          </Label>
          <div className="col-span-3">
            <Select
              value={form.getValues('managerId') || ''}
              onValueChange={(value) => form.setValue('managerId', value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoading ? "Chargement..." : "Sélectionner un responsable"} />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="">Aucun responsable</SelectItem>
                {managers.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {`${employee.lastName || ''} ${employee.firstName || ''}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="button" 
          variant="secondary" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            'Enregistrer'
          )}
        </Button>
      </div>
    </div>
  );
};

export default FormActions;
