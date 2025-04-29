
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAvailableDepartments } from '@/hooks/useAvailableDepartments';
import { useFirebaseCompanies } from '@/hooks/useFirebaseCompanies';

const CompanyDepartmentFields: React.FC = () => {
  const { register, setValue, watch } = useFormContext();
  const selectedCompany = watch('company');
  const [selectedDepartmentName, setSelectedDepartmentName] = useState<string>('');
  
  // Utiliser useFirebaseCompanies pour récupérer les entreprises
  const { companies = [], isLoading: isLoadingCompanies } = useFirebaseCompanies();
  
  // Fetch departments avec le filtre d'entreprise sélectionnée
  const { 
    departments = [], 
    isLoading: isLoadingDepartments 
  } = useAvailableDepartments(selectedCompany);
  
  // Watch for department changes
  const selectedDepartmentId = watch('department');
  
  // Update department name display when ID changes
  useEffect(() => {
    if (selectedDepartmentId && Array.isArray(departments) && departments.length > 0) {
      const dept = departments.find(d => d && d.id === selectedDepartmentId);
      if (dept) {
        setSelectedDepartmentName(dept.name || '');
      }
    }
  }, [selectedDepartmentId, departments]);

  // Filtrer les entreprises qui sont actives
  const activeCompanies = Array.isArray(companies) 
    ? companies.filter(company => company && company.status === 'active')
    : [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company">Entreprise</Label>
          <Select
            onValueChange={(value) => {
              setValue('company', value);
              // Reset department when company changes
              setValue('department', '');
              setSelectedDepartmentName('');
            }}
            value={selectedCompany || ''}
            disabled={isLoadingCompanies}
          >
            <SelectTrigger id="company">
              <SelectValue placeholder="Sélectionner une entreprise" />
            </SelectTrigger>
            <SelectContent>
              {activeCompanies && activeCompanies.length > 0 ? (
                activeCompanies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-company" disabled>
                  Aucune entreprise disponible
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="position">Poste</Label>
          <Input
            id="position"
            placeholder="Poste"
            {...register('position')}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="department">Département</Label>
        <Select
          onValueChange={(value) => {
            setValue('department', value);
            if (Array.isArray(departments)) {
              const dept = departments.find(d => d && d.id === value);
              setSelectedDepartmentName(dept?.name || '');
            }
          }}
          value={selectedDepartmentId || ''}
          disabled={isLoadingDepartments || !selectedCompany}
        >
          <SelectTrigger id="department">
            <SelectValue placeholder="Sélectionner un département" />
          </SelectTrigger>
          <SelectContent>
            {Array.isArray(departments) && departments.length > 0 ? (
              departments.map((department) => (
                department && department.id ? (
                  <SelectItem key={department.id} value={department.id}>
                    {department.name || ''}
                  </SelectItem>
                ) : null
              ))
            ) : (
              <SelectItem value="no-department" disabled>
                {selectedCompany ? 'Aucun département disponible pour cette entreprise' : 'Sélectionnez d\'abord une entreprise'}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CompanyDepartmentFields;
