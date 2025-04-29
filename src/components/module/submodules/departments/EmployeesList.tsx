
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Employee } from '@/types/employee';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useEmployeeActions } from '@/hooks/useEmployeeActions';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface EmployeesListProps {
  employees?: Employee[];
  selectedEmployees: string[];
  onEmployeeSelection: (employeeId: string, checked: boolean) => void;
  id: string;
}

const EmployeesList: React.FC<EmployeesListProps> = ({ 
  employees: providedEmployees, 
  selectedEmployees, 
  onEmployeeSelection,
  id
}) => {
  // État pour gérer la boîte de dialogue de confirmation
  const [employeeToDelete, setEmployeeToDelete] = React.useState<Employee | null>(null);
  const { deleteEmployee, isLoading } = useEmployeeActions();
  
  // Use the hook to get employees if none are provided
  const { employees: hookEmployees = [] } = useEmployeeData() || {};
  
  // Use provided employees or fall back to hook data
  const employees = Array.isArray(providedEmployees) && providedEmployees.length > 0 
    ? providedEmployees 
    : (Array.isArray(hookEmployees) ? hookEmployees : []);

  if (!employees || employees.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucun employé disponible</p>
      </div>
    );
  }
  
  // Ensure selectedEmployees is always an array
  const safeSelectedEmployees = Array.isArray(selectedEmployees) ? selectedEmployees : [];
  
  // Fonction pour gérer la suppression
  const handleDeleteClick = (employee: Employee) => {
    setEmployeeToDelete(employee);
  };
  
  // Fonction pour confirmer la suppression
  const confirmDelete = async () => {
    if (!employeeToDelete || !employeeToDelete.id) return;
    
    try {
      await deleteEmployee(employeeToDelete.id);
      toast.success(`L'employé ${employeeToDelete.firstName} ${employeeToDelete.lastName} a été supprimé`);
      setEmployeeToDelete(null);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("La suppression a échoué. Veuillez réessayer.");
    }
  };
  
  // Fonction pour annuler la suppression
  const cancelDelete = () => {
    setEmployeeToDelete(null);
  };
  
  return (
    <>
      <ScrollArea className="h-[300px] border rounded-md p-4">
        <div className="space-y-4">
          {employees.map((employee) => {
            if (!employee || !employee.id) {
              return null; // Skip invalid employees
            }
            
            const isSelected = safeSelectedEmployees.includes(employee.id);
            return (
              <div 
                key={employee.id}
                className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-md"
              >
                <Checkbox 
                  id={`${id}-employee-${employee.id}`}
                  checked={isSelected}
                  onCheckedChange={(checked) => onEmployeeSelection(employee.id, !!checked)}
                />
                <Avatar className="h-8 w-8">
                  {(employee.photoURL || employee.photo) ? (
                    <AvatarImage src={employee.photoURL || employee.photo} alt={`${employee.firstName || ''} ${employee.lastName || ''}`} />
                  ) : null}
                  <AvatarFallback>
                    {employee.firstName?.[0] || ''}{employee.lastName?.[0] || ''}
                  </AvatarFallback>
                </Avatar>
                <label 
                  htmlFor={`${id}-employee-${employee.id}`}
                  className="text-sm font-medium leading-none cursor-pointer flex-1"
                >
                  {employee.firstName || ''} {employee.lastName || ''}
                  <br />
                  <span className="text-xs text-muted-foreground">
                    {employee.title || employee.position || "Sans poste"}
                  </span>
                </label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDeleteClick(employee)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      </ScrollArea>
      
      {/* Boîte de dialogue de confirmation de suppression */}
      <AlertDialog open={!!employeeToDelete} onOpenChange={open => !open && setEmployeeToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l'employé {employeeToDelete?.firstName} {employeeToDelete?.lastName} ?
              <br />
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600" 
              onClick={confirmDelete}
              disabled={isLoading}
            >
              {isLoading ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EmployeesList;
