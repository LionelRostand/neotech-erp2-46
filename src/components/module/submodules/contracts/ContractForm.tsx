
import React, { useEffect, useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEmployeeData } from '@/hooks/useEmployeeData';

interface ContractFormProps {
  initialData?: any;
  onFormDataChange: (data: any) => void;
}

const ContractForm: React.FC<ContractFormProps> = ({
  initialData,
  onFormDataChange,
}) => {
  const { employees, departments } = useEmployeeData();
  
  const [formData, setFormData] = useState({
    employeeId: '',
    type: 'CDI',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    position: '',
    salary: '',
    department: '',
  });

  // Initialiser le formulaire avec les données existantes si fournies
  useEffect(() => {
    if (initialData) {
      setFormData({
        employeeId: initialData.employeeId || '',
        type: initialData.type || 'CDI',
        startDate: initialData.startDate ? initialData.startDate.split('T')[0] : new Date().toISOString().split('T')[0],
        endDate: initialData.endDate ? initialData.endDate.split('T')[0] : '',
        position: initialData.position || '',
        salary: initialData.salary ? String(initialData.salary) : '',
        department: initialData.department || '',
      });
    }
  }, [initialData]);

  // Mettre à jour les données du formulaire et notifier le parent
  const handleChange = (field: string, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    
    // On envoie directement les données brutes au parent
    // La conversion se fera lors de la soumission
    onFormDataChange(updatedData);
  };

  // Memoize departments to filter out duplicates
  const uniqueDepartments = useMemo(() => {
    if (!departments || !Array.isArray(departments)) return [];

    // Create a map to store unique departments by ID
    const uniqueDeptMap = new Map();
    
    departments.forEach(dept => {
      if (dept && dept.id && !uniqueDeptMap.has(dept.id)) {
        uniqueDeptMap.set(dept.id, dept);
      }
    });
    
    // Convert the map back to an array
    return Array.from(uniqueDeptMap.values());
  }, [departments]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="employeeId">Employé</Label>
        <Select
          value={formData.employeeId}
          onValueChange={(value) => handleChange('employeeId', value)}
          disabled={!!initialData} // Désactiver si c'est une mise à jour
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionner un employé" />
          </SelectTrigger>
          <SelectContent>
            {Array.isArray(employees) && employees.map((employee) => (
              employee && employee.id ? (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.firstName} {employee.lastName}
                </SelectItem>
              ) : null
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="department">Département</Label>
        <Select
          value={formData.department}
          onValueChange={(value) => handleChange('department', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionner un département" />
          </SelectTrigger>
          <SelectContent>
            {uniqueDepartments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="position">Poste</Label>
        <Input
          id="position"
          value={formData.position}
          onChange={(e) => handleChange('position', e.target.value)}
          placeholder="Ex: Développeur Web Senior"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Type de contrat</Label>
        <Select
          value={formData.type}
          onValueChange={(value) => handleChange('type', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Type de contrat" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CDI">CDI</SelectItem>
            <SelectItem value="CDD">CDD</SelectItem>
            <SelectItem value="Intérim">Intérim</SelectItem>
            <SelectItem value="Stage">Stage</SelectItem>
            <SelectItem value="Alternance">Alternance</SelectItem>
            <SelectItem value="Freelance">Freelance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="salary">Salaire annuel (€)</Label>
        <Input
          id="salary"
          type="number"
          value={formData.salary}
          onChange={(e) => handleChange('salary', e.target.value)}
          placeholder="Ex: 45000"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="startDate">Date de début</Label>
        <Input
          id="startDate"
          type="date"
          value={formData.startDate}
          onChange={(e) => handleChange('startDate', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="endDate">Date de fin (si applicable)</Label>
        <Input
          id="endDate"
          type="date"
          value={formData.endDate}
          onChange={(e) => handleChange('endDate', e.target.value)}
        />
      </div>
    </div>
  );
};

export default ContractForm;
