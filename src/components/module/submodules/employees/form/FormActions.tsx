
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
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Employee } from '@/types/employee';
import { fetchCollectionData } from '@/hooks/fetchCollectionData';

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
  
  // Récupérer la liste complète des employés depuis Firestore sans filtrage
  useEffect(() => {
    const fetchAllEmployees = async () => {
      setIsLoading(true);
      try {
        console.log("Démarrage de la récupération de tous les employés...");
        // Utiliser fetchCollectionData pour récupérer tous les employés sans filtrage
        const allEmployees = await fetchCollectionData<Employee>(COLLECTIONS.HR.EMPLOYEES);
        
        console.log(`Total d'employés récupérés: ${allEmployees.length}`);
        console.log("Liste brute des employés:", allEmployees.map(e => ({
          id: e.id,
          nom: `${e.lastName || ''} ${e.firstName || ''}`,
          status: e.status
        })));
        
        // Trier les employés par nom de famille puis prénom
        const sortedEmployees = [...allEmployees].sort((a, b) => {
          const nameA = `${a.lastName || ''} ${a.firstName || ''}`.toLowerCase();
          const nameB = `${b.lastName || ''} ${b.firstName || ''}`.toLowerCase();
          return nameA.localeCompare(nameB);
        });
        
        // Vérifier si certains employés spécifiques sont dans la liste
        const checkEmployee = (firstName: string, lastName: string) => {
          const found = sortedEmployees.some(
            emp => emp.firstName?.toLowerCase().includes(firstName.toLowerCase()) && 
                   emp.lastName?.toLowerCase().includes(lastName.toLowerCase())
          );
          console.log(`${lastName} ${firstName} est-il dans la liste?`, found);
          
          // Afficher tous les employés qui correspondent partiellement
          const matches = sortedEmployees.filter(
            emp => emp.firstName?.toLowerCase().includes(firstName.toLowerCase()) || 
                   emp.lastName?.toLowerCase().includes(lastName.toLowerCase())
          );
          if (matches.length > 0) {
            console.log(`Correspondances partielles pour ${lastName} ${firstName}:`, 
              matches.map(e => `${e.lastName || ''} ${e.firstName || ''} (${e.id}) - Status: ${e.status}`)
            );
          }
        };
        
        // Vérifier pour LIONEL DJOSSA et quelques autres noms pour le débogage
        checkEmployee('lionel', 'djossa');
        
        console.log(`Nombre final d'employés triés: ${sortedEmployees.length}`);
        setManagers(sortedEmployees);
      } catch (error) {
        console.error('Erreur lors de la récupération des employés:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (showManagerOption && form) {
      fetchAllEmployees();
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
              <SelectContent className="max-h-[300px] overflow-y-auto">
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
