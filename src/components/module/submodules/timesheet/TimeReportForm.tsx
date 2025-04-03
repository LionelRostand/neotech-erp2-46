
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { TimeReport, TimeReportStatus } from '@/types/timesheet';
import { toast } from 'sonner';

interface TimeReportFormProps {
  onSubmit: (report: Omit<TimeReport, 'id' | 'lastUpdated'>) => void;
  onCancel: () => void;
}

const TimeReportForm: React.FC<TimeReportFormProps> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [employeeId, setEmployeeId] = useState('');  // Added employeeId state
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [totalHours, setTotalHours] = useState('');
  const [status, setStatus] = useState<TimeReportStatus>('En cours');
  const [activities, setActivities] = useState('');
  const [validationStep, setValidationStep] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !employeeName || !employeeId || !startDate || !endDate || !totalHours) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    if (Number(totalHours) <= 0) {
      toast.error('Le nombre d\'heures doit être supérieur à 0');
      return;
    }
    
    const formattedStartDate = startDate ? format(startDate, 'yyyy-MM-dd') : '';
    const formattedEndDate = endDate ? format(endDate, 'yyyy-MM-dd') : '';
    
    onSubmit({
      title,
      employeeName,
      employeeId,  // Include employeeId in submission
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      totalHours: Number(totalHours),
      status,
      // Add remaining required fields with default values
      lastUpdateText: ''
    });
    
    // Reset form
    setTitle('');
    setEmployeeName('');
    setEmployeeId('');
    setStartDate(new Date());
    setEndDate(new Date());
    setTotalHours('');
    setStatus('En cours');
    setActivities('');
    setValidationStep(1);
  };

  const goToNextStep = () => {
    if (!title || !employeeName || !employeeId || !startDate || !endDate) {
      toast.error('Veuillez remplir tous les champs obligatoires avant de continuer');
      return;
    }
    setValidationStep(2);
  };

  const goToPreviousStep = () => {
    setValidationStep(1);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-6">Créer un nouveau rapport d'activité</h3>
        
        <form onSubmit={handleSubmit}>
          {validationStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="block mb-2">
                  Titre du rapport <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full"
                  placeholder="Ex: Rapport hebdomadaire"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="employee" className="block mb-2">
                  Employé <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="employee"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  className="w-full"
                  placeholder="Nom de l'employé"
                  required
                />
              </div>
              
              {/* Added employeeId field */}
              <div>
                <Label htmlFor="employeeId" className="block mb-2">
                  ID Employé <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="employeeId"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full"
                  placeholder="Ex: EMP001"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate" className="block mb-2">
                    Date de début <span className="text-red-500">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        id="startDate"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? (
                          format(startDate, 'dd MMMM yyyy', { locale: fr })
                        ) : (
                          <span>Sélectionner une date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        locale={fr}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <Label htmlFor="endDate" className="block mb-2">
                    Date de fin <span className="text-red-500">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        id="endDate"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? (
                          format(endDate, 'dd MMMM yyyy', { locale: fr })
                        ) : (
                          <span>Sélectionner une date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        locale={fr}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Annuler
                </Button>
                <Button 
                  type="button" 
                  onClick={goToNextStep}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Continuer
                </Button>
              </div>
            </div>
          )}
          
          {validationStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="totalHours" className="block mb-2">
                  Nombre total d'heures <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="totalHours"
                  type="number"
                  value={totalHours}
                  onChange={(e) => setTotalHours(e.target.value)}
                  className="w-full"
                  placeholder="Ex: 40"
                  min="1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="status" className="block mb-2">
                  Statut
                </Label>
                <Select value={status} onValueChange={(value) => setStatus(value as TimeReportStatus)}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="En cours">En cours</SelectItem>
                    <SelectItem value="Soumis">Soumis</SelectItem>
                    <SelectItem value="Validé">Validé</SelectItem>
                    <SelectItem value="Rejeté">Rejeté</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="activities" className="block mb-2">
                  Description des activités
                </Label>
                <Textarea
                  id="activities"
                  value={activities}
                  onChange={(e) => setActivities(e.target.value)}
                  className="w-full min-h-[120px]"
                  placeholder="Décrivez les activités réalisées pendant cette période..."
                />
              </div>
              
              <div className="pt-4 flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={goToPreviousStep}>
                  Retour
                </Button>
                <Button 
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Enregistrer le rapport
                </Button>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default TimeReportForm;
