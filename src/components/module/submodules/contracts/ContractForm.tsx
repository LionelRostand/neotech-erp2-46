
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useEmployeeData } from '@/hooks/useEmployeeData';

interface ContractFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const ContractForm: React.FC<ContractFormProps> = ({ onSubmit, onCancel }) => {
  // Récupérer les données des employés et des départements
  const { employees, departments, isLoading } = useEmployeeData();

  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    employeePhoto: '',
    department: '',
    departmentId: '',
    position: '',
    type: 'CDI',
    startDate: new Date(),
    endDate: null,
    salary: '',
    status: 'Actif',
    notes: '',
    createdAt: new Date(),
  });

  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  // Mettre à jour les données de l'employé sélectionné
  useEffect(() => {
    if (formData.employeeId && employees?.length > 0) {
      const selectedEmployee = employees.find(emp => emp.id === formData.employeeId);
      if (selectedEmployee) {
        setFormData(prev => ({
          ...prev,
          employeeName: `${selectedEmployee.firstName} ${selectedEmployee.lastName}`,
          employeePhoto: selectedEmployee.photoURL || selectedEmployee.photo || '',
          position: selectedEmployee.position || selectedEmployee.title || prev.position,
          department: selectedEmployee.department || prev.department,
          departmentId: selectedEmployee.departmentId || prev.departmentId
        }));
      }
    }
  }, [formData.employeeId, employees]);

  // Mettre à jour les données du département sélectionné
  useEffect(() => {
    if (formData.departmentId && departments?.length > 0) {
      const selectedDepartment = departments.find(dept => dept.id === formData.departmentId);
      if (selectedDepartment) {
        setFormData(prev => ({
          ...prev,
          department: selectedDepartment.name
        }));
      }
    }
  }, [formData.departmentId, departments]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="employeeId" className="block text-sm font-medium mb-1">
            Employé
          </label>
          <Select 
            value={formData.employeeId}
            onValueChange={(value) => handleChange('employeeId', value)}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
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
        
        <div>
          <label htmlFor="departmentId" className="block text-sm font-medium mb-1">
            Département
          </label>
          <Select 
            value={formData.departmentId}
            onValueChange={(value) => handleChange('departmentId', value)}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner un département" />
            </SelectTrigger>
            <SelectContent>
              {departments?.map(department => (
                <SelectItem key={department.id} value={department.id}>
                  {department.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="position" className="block text-sm font-medium mb-1">
            Poste
          </label>
          <Input 
            id="position" 
            placeholder="Poste"
            value={formData.position}
            onChange={(e) => handleChange('position', e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="type" className="block text-sm font-medium mb-1">
            Type de contrat
          </label>
          <Select 
            value={formData.type}
            onValueChange={(value) => handleChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CDI">CDI</SelectItem>
              <SelectItem value="CDD">CDD</SelectItem>
              <SelectItem value="Alternance">Alternance</SelectItem>
              <SelectItem value="Stage">Stage</SelectItem>
              <SelectItem value="Intérim">Intérim</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Date de début
          </label>
          <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.startDate ? format(formData.startDate, 'dd/MM/yyyy') : 'Sélectionner une date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.startDate}
                onSelect={(date) => {
                  handleChange('startDate', date);
                  setStartDateOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Date de fin (si applicable)
          </label>
          <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.endDate ? format(formData.endDate, 'dd/MM/yyyy') : 'Non définie'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.endDate}
                onSelect={(date) => {
                  handleChange('endDate', date);
                  setEndDateOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="salary" className="block text-sm font-medium mb-1">
            Salaire
          </label>
          <Input 
            id="salary" 
            placeholder="Salaire annuel"
            value={formData.salary}
            onChange={(e) => handleChange('salary', e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1">
            Statut
          </label>
          <Select 
            value={formData.status}
            onValueChange={(value) => handleChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Actif">Actif</SelectItem>
              <SelectItem value="À venir">À venir</SelectItem>
              <SelectItem value="Expiré">Expiré</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium mb-1">
          Notes
        </label>
        <Textarea 
          id="notes"
          placeholder="Notes additionnelles"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          Créer le contrat
        </Button>
      </div>
    </form>
  );
};

export default ContractForm;
