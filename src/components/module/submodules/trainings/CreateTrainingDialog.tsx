
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Employee } from '@/types/employee';
import { addDocument } from '@/hooks/firestore/firestore-utils';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { Form, FormProvider, useForm } from 'react-hook-form';

export interface CreateTrainingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onSubmit: () => void;
  employees: Employee[];
}

const trainingTypes = [
  { value: 'technical', label: 'Technique' },
  { value: 'management', label: 'Management' },
  { value: 'soft_skills', label: 'Soft Skills' },
  { value: 'certification', label: 'Certification' },
  { value: 'compliance', label: 'Conformité' },
  { value: 'other', label: 'Autre' }
];

const CreateTrainingDialog: React.FC<CreateTrainingDialogProps> = ({
  open,
  onOpenChange,
  onClose,
  onSubmit,
  employees
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [provider, setProvider] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize the form
  const form = useForm({
    defaultValues: {
      title: '',
      type: '',
      employeeId: '',
      provider: '',
      location: '',
      startDate: '',
      endDate: '',
      description: ''
    }
  });

  const resetForm = () => {
    setTitle('');
    setType('');
    setEmployeeId('');
    setProvider('');
    setLocation('');
    setStartDate('');
    setEndDate('');
    setDescription('');
    form.reset();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !type || !employeeId || !startDate) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const selectedEmployee = employees.find(emp => emp.id === employeeId);
      
      const trainingData = {
        title,
        type,
        employeeId,
        employeeName: selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : '',
        provider,
        location,
        startDate,
        endDate: endDate || null,
        description,
        status: 'Planifiée',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await addDocument(COLLECTIONS.HR.TRAININGS, trainingData);
      toast.success('Formation créée avec succès');
      resetForm();
      onSubmit();
    } catch (error) {
      console.error('Erreur lors de la création de la formation:', error);
      toast.error('Erreur lors de la création de la formation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle formation</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer une nouvelle formation.
          </DialogDescription>
        </DialogHeader>
        
        <FormProvider {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre de la formation *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre de la formation"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type de formation *</Label>
                <Select value={type} onValueChange={setType} required>
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {trainingTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="employee">Employé *</Label>
                <Select value={employeeId} onValueChange={setEmployeeId} required>
                  <SelectTrigger id="employee" className="w-full">
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
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="provider">Organisme de formation</Label>
                <Input
                  id="provider"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  placeholder="Organisme de formation"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Lieu</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Lieu de la formation"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Date de début *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">Date de fin</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description de la formation"
                rows={3}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Création...' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTrainingDialog;
