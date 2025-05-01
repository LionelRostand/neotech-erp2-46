
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BadgeData } from './BadgeTypes';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Employee } from '@/types/employee';
import { nanoid } from 'nanoid';

interface CreateBadgeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onBadgeCreated: (badge: BadgeData) => void;
  employees: Employee[];
}

const CreateBadgeDialog: React.FC<CreateBadgeDialogProps> = ({
  isOpen,
  onOpenChange,
  onBadgeCreated,
  employees,
}) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [badgeId, setBadgeId] = useState<string>('');
  const [accessLevel, setAccessLevel] = useState<string>('');
  const [status, setStatus] = useState<string>('success');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idError, setIdError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      // Générer un ID de badge random de 6 caractères
      generateRandomBadgeId();
      setSelectedEmployeeId('');
      setAccessLevel('');
      setStatus('success');
      setIdError('');
    }
  }, [isOpen]);

  const generateRandomBadgeId = () => {
    // Utiliser nanoid pour générer un ID alphanumérique aléatoire et prendre les 6 premiers caractères
    const newBadgeId = nanoid(6).toUpperCase();
    setBadgeId(newBadgeId);
  };

  const handleBadgeIdChange = (value: string) => {
    if (value.length > 6) {
      setIdError('Le numéro de badge ne doit pas dépasser 6 caractères');
      setBadgeId(value.substring(0, 6));
    } else {
      setIdError('');
      setBadgeId(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!badgeId) {
      toast.error('Le numéro de badge est requis');
      return;
    }

    if (badgeId.length > 6) {
      setIdError('Le numéro de badge ne doit pas dépasser 6 caractères');
      return;
    }

    if (!selectedEmployeeId) {
      toast.error('Veuillez sélectionner un employé');
      return;
    }

    if (!accessLevel) {
      toast.error("Le niveau d'accès est requis");
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId);
      
      if (!selectedEmployee) {
        toast.error('Employé non trouvé');
        setIsSubmitting(false);
        return;
      }

      const formattedDate = new Date().toISOString().split('T')[0];

      const newBadge: BadgeData = {
        id: badgeId,
        employeeId: selectedEmployee.id,
        employeeName: `${selectedEmployee.firstName} ${selectedEmployee.lastName}`,
        department: selectedEmployee.department || '',
        company: selectedEmployee.company || '',
        accessLevel: accessLevel,
        status: status,
        date: formattedDate,
      };

      onBadgeCreated(newBadge);
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la création du badge:", error);
      toast.error("Échec de la création du badge");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Créer un nouveau badge</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="badge-id" className="text-right">
                N° Badge
              </Label>
              <div className="col-span-3 relative">
                <Input
                  id="badge-id"
                  value={badgeId}
                  onChange={(e) => handleBadgeIdChange(e.target.value)}
                  maxLength={6}
                  className={idError ? 'border-red-500' : ''}
                />
                {idError && <p className="text-xs text-red-500 mt-1">{idError}</p>}
                <p className="text-xs text-muted-foreground mt-1">Maximum 6 caractères</p>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="employee" className="text-right">
                Employé
              </Label>
              <div className="col-span-3">
                <Select
                  value={selectedEmployeeId}
                  onValueChange={setSelectedEmployeeId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un employé" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="access-level" className="text-right">
                Niveau d'accès
              </Label>
              <div className="col-span-3">
                <Select
                  value={accessLevel}
                  onValueChange={setAccessLevel}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un niveau d'accès" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Accès limité">Accès limité</SelectItem>
                    <SelectItem value="Accès standard">Accès standard</SelectItem>
                    <SelectItem value="Accès complet">Accès complet</SelectItem>
                    <SelectItem value="Accès administratif">Accès administratif</SelectItem>
                    <SelectItem value="PDG">PDG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Statut
              </Label>
              <div className="col-span-3">
                <Select
                  value={status}
                  onValueChange={setStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="success">Actif</SelectItem>
                    <SelectItem value="error">Désactivé</SelectItem>
                    <SelectItem value="warning">Expiré</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                'Créer'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBadgeDialog;
