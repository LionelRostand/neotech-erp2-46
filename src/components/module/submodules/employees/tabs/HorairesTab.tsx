
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Employee } from '@/types/employee';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Check, PenLine } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface HorairesTabProps {
  employee: Employee;
  editMode?: boolean;
  onScheduleUpdated?: (schedule: any) => void;
}

const HorairesTab: React.FC<HorairesTabProps> = ({ 
  employee,
  editMode = false,
  onScheduleUpdated
}) => {
  const defaultSchedule = {
    monday: '09:00 - 18:00',
    tuesday: '09:00 - 18:00',
    wednesday: '09:00 - 18:00',
    thursday: '09:00 - 18:00',
    friday: '09:00 - 17:00',
    saturday: '-',
    sunday: '-'
  };

  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [schedule, setSchedule] = useState(employee.workSchedule || defaultSchedule);

  const handleScheduleChange = (day: string, value: string) => {
    setSchedule((prev: any) => ({ ...prev, [day]: value }));
  };

  const handleSaveSchedule = () => {
    if (onScheduleUpdated) {
      onScheduleUpdated(schedule);
    }
    setIsEditingSchedule(false);
  };

  const cancelEditing = () => {
    setSchedule(employee.workSchedule || defaultSchedule);
    setIsEditingSchedule(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Horaires de travail</CardTitle>
          {editMode && !isEditingSchedule && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditingSchedule(true)}
            >
              <PenLine className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          )}
          {editMode && isEditingSchedule && (
            <div className="flex space-x-2">
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleSaveSchedule}
              >
                <Check className="h-4 w-4 mr-2" />
                Enregistrer
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={cancelEditing}
              >
                Annuler
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jour</TableHead>
                <TableHead>Horaires</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                const dayNames: {[key: string]: string} = {
                  monday: 'Lundi',
                  tuesday: 'Mardi',
                  wednesday: 'Mercredi',
                  thursday: 'Jeudi',
                  friday: 'Vendredi',
                  saturday: 'Samedi',
                  sunday: 'Dimanche'
                };
                
                return (
                  <TableRow key={day}>
                    <TableCell className="font-medium">{dayNames[day]}</TableCell>
                    <TableCell>
                      {isEditingSchedule ? (
                        <Input 
                          value={(schedule as any)[day] || '-'} 
                          onChange={(e) => handleScheduleChange(day, e.target.value)}
                          placeholder="08:00 - 17:00"
                        />
                      ) : (
                        (schedule as any)[day] || '-'
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Présence récente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500">
            Données de présence non disponibles
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HorairesTab;
