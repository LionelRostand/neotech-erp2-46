
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Employee } from '@/types/employee';
import { addTrainingDocument } from '@/hooks/firestore/firestore-utils';
import { toast } from 'sonner';

export interface CreateTrainingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onSubmit: () => void;
  employees: Employee[];
}

const trainingTypes = [
  'Formation professionnelle',
  'Formation réglementaire',
  'Formation en ligne',
  'Séminaire',
  'Workshop',
  'Conférence',
];

const CreateTrainingDialog: React.FC<CreateTrainingDialogProps> = ({
  open,
  onOpenChange,
  onClose,
  onSubmit,
  employees,
}) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    title: '',
    description: '',
    type: 'Formation professionnelle',
    startDate: new Date(),
    endDate: new Date(),
    provider: '',
    location: '',
    status: 'Planifiée',
    cost: 0,
    certificate: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, [name]: date }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, certificate: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.employeeId || !formData.title || !formData.type) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Format dates to ISO strings for Firestore
      const trainingData = {
        ...formData,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
        createdAt: new Date().toISOString(),
      };
      
      await addTrainingDocument(trainingData);
      toast.success('Formation ajoutée avec succès');
      onSubmit();
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la formation:', error);
      toast.error('Erreur lors de l\'ajout de la formation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter une formation</DialogTitle>
          <DialogDescription>
            Saisissez les informations de la formation à ajouter
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="employeeId">Employé</Label>
            <Select 
              value={formData.employeeId} 
              onValueChange={(value) => handleSelectChange('employeeId', value)}
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

          <div className="space-y-2">
            <Label htmlFor="title">Titre de la formation</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Titre de la formation"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description de la formation"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type de formation</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {trainingTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planifiée">Planifiée</SelectItem>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="Terminée">Terminée</SelectItem>
                  <SelectItem value="Annulée">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date de début</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? (
                      format(formData.startDate, "PPP")
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => handleDateChange('startDate', date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Date de fin</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? (
                      format(formData.endDate, "PPP")
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => handleDateChange('endDate', date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="provider">Organisme de formation</Label>
              <Input
                id="provider"
                name="provider"
                value={formData.provider}
                onChange={handleInputChange}
                placeholder="Organisme de formation"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Lieu</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Lieu de la formation"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost">Coût (€)</Label>
              <Input
                id="cost"
                name="cost"
                type="number"
                value={formData.cost.toString()}
                onChange={handleInputChange}
                placeholder="Coût de la formation"
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-6">
              <Checkbox 
                id="certificate" 
                checked={formData.certificate}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="certificate">
                Formation certifiante
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">◌</span>
                  Création...
                </>
              ) : (
                'Créer la formation'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTrainingDialog;
