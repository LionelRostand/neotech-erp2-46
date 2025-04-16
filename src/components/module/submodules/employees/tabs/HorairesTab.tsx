import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Clock, Save } from 'lucide-react';
import { Employee } from '@/types/employee';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { updateDocument } from '@/hooks/firestore/update-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

interface HorairesTabProps {
  employee: Employee;
  isEditing?: boolean;
  onFinishEditing?: () => void;
}

const HorairesTab: React.FC<HorairesTabProps> = ({ 
  employee, 
  isEditing = false,
  onFinishEditing 
}) => {
  const defaultSchedule = {
    monday: '09:00 - 18:00',
    tuesday: '09:00 - 18:00',
    wednesday: '09:00 - 18:00',
    thursday: '09:00 - 18:00',
    friday: '09:00 - 17:00',
    saturday: '',
    sunday: ''
  };

  const [workSchedule, setWorkSchedule] = useState(employee.workSchedule || defaultSchedule);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setWorkSchedule(employee.workSchedule || defaultSchedule);
  }, [employee]);

  const handleScheduleChange = (day: string, value: string) => {
    setWorkSchedule({
      ...workSchedule,
      [day]: value
    });
  };

  const handleSaveSchedule = async () => {
    if (!employee.id) return;
    
    setIsSubmitting(true);
    try {
      await updateDocument(COLLECTIONS.HR.EMPLOYEES, employee.id, {
        workSchedule
      });
      
      toast.success('Horaires mis à jour avec succès');
      if (onFinishEditing) {
        onFinishEditing();
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des horaires:', error);
      toast.error('Erreur lors de la mise à jour des horaires');
    } finally {
      setIsSubmitting(false);
    }
  };

  const days = [
    { key: 'monday', label: 'Lundi' },
    { key: 'tuesday', label: 'Mardi' },
    { key: 'wednesday', label: 'Mercredi' },
    { key: 'thursday', label: 'Jeudi' },
    { key: 'friday', label: 'Vendredi' },
    { key: 'saturday', label: 'Samedi' },
    { key: 'sunday', label: 'Dimanche' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Horaires de travail</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {days.map(day => (
            <div key={day.key} className={`p-4 border rounded-md ${(day.key === 'saturday' || day.key === 'sunday') && !workSchedule[day.key] ? 'opacity-70' : ''}`}>
              <p className="text-sm font-medium text-gray-500 mb-2">
                {day.label}
              </p>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <Input
                    value={workSchedule[day.key as keyof typeof workSchedule] || ''}
                    onChange={(e) => handleScheduleChange(day.key, e.target.value)}
                    placeholder="09:00 - 18:00"
                    className="h-8 text-sm"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>{workSchedule[day.key as keyof typeof workSchedule] || 'Jour non travaillé'}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      
      {isEditing && (
        <CardFooter className="border-t px-6 py-4 bg-muted/20">
          <div className="ml-auto flex gap-2">
            <Button 
              variant="outline" 
              onClick={onFinishEditing}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleSaveSchedule}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enregistrement...
                </span>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default HorairesTab;
