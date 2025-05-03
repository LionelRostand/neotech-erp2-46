
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm, Controller } from 'react-hook-form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { useHrModuleData } from '@/hooks/useHrModuleData';

// Timesheet form data interface
interface TimesheetFormData {
  title: string;
  employeeId: string;
  startDate: Date;
  endDate: Date;
  totalHours: number;
  comments?: string;
  status: 'En cours' | 'Soumis' | 'Validé' | 'Rejeté';
  details: {
    date: string;
    hours: number;
    project?: string;
    description?: string;
  }[];
  createdBy: string;
  createdByRole: 'RH' | 'Manager' | 'Employé';
}

interface TimesheetFormProps {
  onSubmit: (data: TimesheetFormData) => void;
  onCancel: () => void;
  initialData?: Partial<TimesheetFormData>;
}

const TimesheetForm: React.FC<TimesheetFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const { employees } = useHrModuleData();
  const [activeTab, setActiveTab] = useState('details');
  const [creationMode, setCreationMode] = useState<'month' | 'week'>('month');

  // Set up react-hook-form
  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<TimesheetFormData>({
    defaultValues: {
      title: initialData?.title || '',
      employeeId: initialData?.employeeId || '',
      startDate: initialData?.startDate ? new Date(initialData.startDate) : new Date(),
      endDate: initialData?.endDate ? new Date(initialData.endDate) : new Date(),
      totalHours: initialData?.totalHours || 0,
      comments: initialData?.comments || '',
      status: initialData?.status || 'En cours',
      details: initialData?.details || [],
      createdBy: initialData?.createdBy || 'RH', // Default to RH
      createdByRole: initialData?.createdByRole || 'RH'
    }
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const employeeId = watch('employeeId');

  // Generate default details when dates change
  useEffect(() => {
    if (startDate && endDate) {
      if (creationMode === 'month') {
        // For monthly timesheet, create weekly entries
        const startYear = startDate.getFullYear();
        const startMonth = startDate.getMonth();
        
        // Create entries for each week of the month
        const details = [];
        const firstDay = new Date(startYear, startMonth, 1);
        const lastDay = new Date(startYear, startMonth + 1, 0);
        
        // Divide the month into weeks
        const currentDate = new Date(firstDay);
        while (currentDate <= lastDay) {
          const weekStart = new Date(currentDate);
          // Move to end of week or end of month
          const weekEnd = new Date(currentDate);
          weekEnd.setDate(weekEnd.getDate() + 6);
          
          if (weekEnd > lastDay) {
            weekEnd.setTime(lastDay.getTime());
          }
          
          details.push({
            date: `${format(weekStart, 'dd/MM/yyyy')} - ${format(weekEnd, 'dd/MM/yyyy')}`,
            hours: 0,
            project: '',
            description: `Semaine du ${format(weekStart, 'dd')} au ${format(weekEnd, 'dd MMMM yyyy', { locale: fr })}`
          });
          
          // Move to the next week
          currentDate.setDate(currentDate.getDate() + 7);
        }
        
        setValue('details', details);
      } else {
        // For weekly timesheet (legacy mode)
        const days = Math.min(7, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);
        const details = [];
        
        for (let i = 0; i < days; i++) {
          const date = new Date(startDate);
          date.setDate(date.getDate() + i);
          details.push({
            date: format(date, 'yyyy-MM-dd'),
            hours: 0,
            project: '',
            description: ''
          });
        }
        
        setValue('details', details);
      }
    }
  }, [startDate, endDate, creationMode, setValue]);

  const onFormSubmit = (data: TimesheetFormData) => {
    // Calculate total hours
    const totalHours = data.details.reduce((sum, entry) => sum + (entry.hours || 0), 0);
    data.totalHours = totalHours;
    
    onSubmit(data);
  };

  const getEmployeeName = (id: string) => {
    const employee = employees.find(emp => emp.id === id);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Employé inconnu';
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-4">
          <TabsTrigger value="details" className="flex-1">Détails généraux</TabsTrigger>
          <TabsTrigger value="entries" className="flex-1">Saisie des heures</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4">
          {/* Mode de création */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Mode de création</label>
            <div className="flex space-x-4">
              <button
                type="button"
                className={`px-4 py-2 rounded-md ${creationMode === 'month' ? 'bg-primary text-white' : 'bg-gray-100'}`}
                onClick={() => setCreationMode('month')}
              >
                Mois complet
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-md ${creationMode === 'week' ? 'bg-primary text-white' : 'bg-gray-100'}`}
                onClick={() => setCreationMode('week')}
              >
                Semaine
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Titre</label>
            <Controller
              name="title"
              control={control}
              rules={{ required: "Le titre est requis" }}
              render={({ field }) => (
                <Input 
                  {...field} 
                  placeholder="Titre de la feuille de temps"
                  className={errors.title ? "border-red-500" : ""}
                />
              )}
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>

          {/* Employee selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Employé</label>
            <Controller
              name="employeeId"
              control={control}
              rules={{ required: "L'employé est requis" }}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className={errors.employeeId ? "border-red-500" : ""}>
                    <SelectValue placeholder="Sélectionner un employé" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map(employee => (
                      <SelectItem 
                        key={employee.id} 
                        value={employee.id}
                      >
                        {`${employee.firstName} ${employee.lastName}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.employeeId && <p className="text-red-500 text-sm">{errors.employeeId.message}</p>}
          </div>

          {/* Date range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date de début</label>
              <Controller
                name="startDate"
                control={control}
                rules={{ required: "La date de début est requise" }}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${
                          errors.startDate ? "border-red-500" : ""
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, 'dd MMMM yyyy', { locale: fr })
                        ) : (
                          <span>Choisir une date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Date de fin</label>
              <Controller
                name="endDate"
                control={control}
                rules={{ required: "La date de fin est requise" }}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${
                          errors.endDate ? "border-red-500" : ""
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, 'dd MMMM yyyy', { locale: fr })
                        ) : (
                          <span>Choisir une date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < startDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate.message}</p>}
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Commentaires</label>
            <Controller
              name="comments"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  placeholder="Commentaires ou observations supplémentaires"
                  className="w-full p-2 border rounded-md min-h-[100px]"
                />
              )}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Statut</label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="En cours">En cours</SelectItem>
                    <SelectItem value="Soumis">Soumis</SelectItem>
                    <SelectItem value="Validé">Validé</SelectItem>
                    <SelectItem value="Rejeté">Rejeté</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="entries" className="space-y-4">
          {employeeId ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Saisie d'heures pour {getEmployeeName(employeeId)}</h4>
              </div>
              
              <Controller
                name="details"
                control={control}
                render={({ field }) => (
                  <div className="space-y-4">
                    {field.value.map((detail, index) => (
                      <div key={index} className="border p-4 rounded-md space-y-3">
                        <div className="font-medium">{detail.date}</div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Heures travaillées</label>
                            <Input
                              type="number"
                              value={detail.hours}
                              onChange={(e) => {
                                const updatedDetails = [...field.value];
                                updatedDetails[index].hours = parseFloat(e.target.value);
                                field.onChange(updatedDetails);
                              }}
                              placeholder="Nombre d'heures"
                              min="0"
                              step="0.5"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Projet</label>
                            <Input
                              value={detail.project || ''}
                              onChange={(e) => {
                                const updatedDetails = [...field.value];
                                updatedDetails[index].project = e.target.value;
                                field.onChange(updatedDetails);
                              }}
                              placeholder="Nom du projet (optionnel)"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Description</label>
                          <textarea
                            value={detail.description || ''}
                            onChange={(e) => {
                              const updatedDetails = [...field.value];
                              updatedDetails[index].description = e.target.value;
                              field.onChange(updatedDetails);
                            }}
                            placeholder="Description des tâches effectuées"
                            className="w-full p-2 border rounded-md min-h-[60px]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              />
              
              <div className="text-right">
                <p className="font-medium">
                  Total des heures: {watch('details').reduce((sum, detail) => sum + (detail.hours || 0), 0)}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              Veuillez d'abord sélectionner un employé dans l'onglet "Détails généraux".
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          Enregistrer
        </Button>
      </div>
    </form>
  );
};

export default TimesheetForm;
