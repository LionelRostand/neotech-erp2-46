
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Employee } from '@/types/employee';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { toast } from 'sonner';
import { useEmployeeService } from '@/hooks/useEmployeeService';
import { Loader2 } from 'lucide-react';

interface EditCompanyPositionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee;
  onEmployeeUpdated: (employee: Employee) => void;
}

export function EditCompanyPositionDialog({
  open,
  onOpenChange,
  employee,
  onEmployeeUpdated
}: EditCompanyPositionDialogProps) {
  const { companies } = useHrModuleData();
  const { updateEmployee, isLoading } = useEmployeeService();
  
  const [position, setPosition] = useState(employee?.position || '');
  const [companyId, setCompanyId] = useState(typeof employee?.company === 'string' 
    ? employee.company 
    : employee?.company?.id || '');

  // Reset form when employee changes
  useEffect(() => {
    if (employee) {
      setPosition(employee.position || '');
      setCompanyId(typeof employee.company === 'string' 
        ? employee.company 
        : employee?.company?.id || '');
    }
  }, [employee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!employee || !employee.id) {
      toast.error("Impossible de mettre à jour l'employé: ID manquant");
      return;
    }

    try {
      console.log("Mise à jour de l'employé avec les données:", { position, company: companyId });
      
      const updatedEmployee = await updateEmployee(employee.id, {
        position,
        company: companyId
      });
      
      if (updatedEmployee) {
        // Use the callback to update the UI
        onEmployeeUpdated({
          ...employee,
          position,
          company: companyId
        });
        
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error("Une erreur est survenue lors de la mise à jour");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le poste et l'entreprise</DialogTitle>
          <DialogDescription>
            Modifiez le poste et l'entreprise de l'employé
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="position">Poste</Label>
              <Input
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Poste de l'employé"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="company">Entreprise</Label>
              <Select 
                value={companyId}
                onValueChange={(value) => setCompanyId(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une entreprise" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                'Enregistrer'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
