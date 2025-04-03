
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useHrModuleData } from '@/hooks/useHrModuleData';

interface TimesheetFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  isEditing?: boolean;
}

const TimesheetForm: React.FC<TimesheetFormProps> = ({ 
  onSubmit, 
  onCancel,
  initialData,
  isEditing = false
}) => {
  const { employees } = useHrModuleData();
  const [activeTab, setActiveTab] = useState('details');
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    employeeId: initialData?.employeeId || '',
    startDate: initialData?.startDate ? new Date(initialData.startDate) : new Date(),
    endDate: initialData?.endDate ? new Date(initialData.endDate) : new Date(),
    totalHours: initialData?.totalHours || 40,
    status: initialData?.status || 'En cours',
    description: initialData?.description || '',
    tasks: initialData?.tasks || '',
    comments: initialData?.comments || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, [name]: date }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Transformer les dates en format ISO pour le stockage
    const dataToSubmit = {
      ...formData,
      startDate: formData.startDate.toISOString().split('T')[0],
      endDate: formData.endDate.toISOString().split('T')[0]
    };
    
    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{isEditing ? 'Modifier' : 'Créer'} une feuille de temps</DialogTitle>
      </DialogHeader>
      
      <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="pt-4">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="tasks">Tâches</TabsTrigger>
          <TabsTrigger value="comments">Commentaires</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Titre de la feuille de temps"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="employeeId">Employé</Label>
            <Select 
              value={formData.employeeId} 
              onValueChange={value => handleSelectChange('employeeId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un employé" />
              </SelectTrigger>
              <SelectContent>
                {employees?.map(employee => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date de début</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate 
                      ? format(formData.startDate, 'PPP', { locale: fr }) 
                      : "Sélectionnez une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={date => handleDateChange('startDate', date)}
                    locale={fr}
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
                    className="w-full justify-start text-left"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate 
                      ? format(formData.endDate, 'PPP', { locale: fr }) 
                      : "Sélectionnez une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={date => handleDateChange('endDate', date)}
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalHours">Heures totales</Label>
              <Input
                id="totalHours"
                name="totalHours"
                type="number"
                value={formData.totalHours}
                onChange={handleInputChange}
                min={0}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select 
                value={formData.status} 
                onValueChange={value => handleSelectChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="Soumis">Soumis</SelectItem>
                  <SelectItem value="Validé">Validé</SelectItem>
                  <SelectItem value="Rejeté">Rejeté</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description de la feuille de temps"
              className="w-full min-h-[100px] px-3 py-2 border rounded-md resize-none"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="tasks" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tasks">Tâches réalisées</Label>
            <textarea
              id="tasks"
              name="tasks"
              value={formData.tasks}
              onChange={handleInputChange}
              placeholder="Liste des tâches réalisées pendant cette période..."
              className="w-full min-h-[200px] px-3 py-2 border rounded-md resize-none"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="comments" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="comments">Commentaires</Label>
            <textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleInputChange}
              placeholder="Commentaires additionnels..."
              className="w-full min-h-[200px] px-3 py-2 border rounded-md resize-none"
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <DialogFooter className="pt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          {isEditing ? 'Mettre à jour' : 'Créer'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default TimesheetForm;
