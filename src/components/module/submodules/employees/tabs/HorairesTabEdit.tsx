
import React, { useState } from 'react';
import { Employee } from '@/types/employee';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface HorairesTabEditProps {
  employee: Employee;
  onSave: (data: Partial<Employee>) => void;
  onCancel: () => void;
}

const HorairesTabEdit: React.FC<HorairesTabEditProps> = ({ 
  employee, 
  onSave, 
  onCancel 
}) => {
  const initialWorkSchedule = employee.workSchedule || {
    monday: '09:00 - 18:00',
    tuesday: '09:00 - 18:00',
    wednesday: '09:00 - 18:00',
    thursday: '09:00 - 18:00',
    friday: '09:00 - 17:00',
    saturday: 'Repos',
    sunday: 'Repos'
  };

  const [workSchedule, setWorkSchedule] = useState(initialWorkSchedule);

  const handleInputChange = (day: string, value: string) => {
    setWorkSchedule(prev => ({
      ...prev,
      [day]: value
    }));
  };

  const handleSubmit = () => {
    onSave({ workSchedule });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Horaires de travail</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="monday">Lundi</Label>
          <Input 
            id="monday"
            value={workSchedule.monday || ''}
            onChange={(e) => handleInputChange('monday', e.target.value)}
            placeholder="Ex: 09:00 - 18:00"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tuesday">Mardi</Label>
          <Input 
            id="tuesday"
            value={workSchedule.tuesday || ''}
            onChange={(e) => handleInputChange('tuesday', e.target.value)}
            placeholder="Ex: 09:00 - 18:00"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="wednesday">Mercredi</Label>
          <Input 
            id="wednesday"
            value={workSchedule.wednesday || ''}
            onChange={(e) => handleInputChange('wednesday', e.target.value)}
            placeholder="Ex: 09:00 - 18:00"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="thursday">Jeudi</Label>
          <Input 
            id="thursday"
            value={workSchedule.thursday || ''}
            onChange={(e) => handleInputChange('thursday', e.target.value)}
            placeholder="Ex: 09:00 - 18:00"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="friday">Vendredi</Label>
          <Input 
            id="friday"
            value={workSchedule.friday || ''}
            onChange={(e) => handleInputChange('friday', e.target.value)}
            placeholder="Ex: 09:00 - 18:00"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="saturday">Samedi</Label>
          <Input 
            id="saturday"
            value={workSchedule.saturday || ''}
            onChange={(e) => handleInputChange('saturday', e.target.value)}
            placeholder="Ex: Repos ou 10:00 - 16:00"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sunday">Dimanche</Label>
          <Input 
            id="sunday"
            value={workSchedule.sunday || ''}
            onChange={(e) => handleInputChange('sunday', e.target.value)}
            placeholder="Ex: Repos"
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button onClick={handleSubmit}>
          Sauvegarder
        </Button>
      </div>
    </div>
  );
};

export default HorairesTabEdit;
