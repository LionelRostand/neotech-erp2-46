
import React, { useEffect, useState, useMemo } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';

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
  
  // Memoize the filtered companies to avoid re-renders
  const activeCompanies = useMemo(() => {
    if (!Array.isArray(companies)) return [];
    return companies.filter(company => company && company.status === 'active');
  }, [companies]);
  
  // Update department name display when ID changes
  useEffect(() => {
    if (!selectedDepartmentId || !Array.isArray(departments) || !departments.length) {
      return;
    }
    
    const dept = departments.find(d => d && d.id === selectedDepartmentId);
    if (dept) {
      setSelectedDepartmentName(dept.name || '');
    }
  }, [selectedDepartmentId, departments]);

  // Handle company change
  const handleCompanyChange = (value: string) => {
    setValue('company', value);
    // Reset department when company changes
    setValue('department', '');
    setSelectedDepartmentName('');
  };
  
  // Handle department change
  const handleDepartmentChange = (value: string) => {
    setValue('department', value);
    if (Array.isArray(departments)) {
      const dept = departments.find(d => d && d.id === value);
      if (dept) {
        setSelectedDepartmentName(dept.name || '');
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company">Entreprise</Label>
          {isLoadingCompanies ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select
              onValueChange={handleCompanyChange}
              value={selectedCompany || ''}
              disabled={isLoadingCompanies}
            >
              <SelectTrigger id="company" className="bg-background">
                <SelectValue placeholder="Sélectionner une entreprise" />
              </SelectTrigger>
              <SelectContent className="bg-popover border z-50">
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
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="position">Poste</Label>
          <Input
            id="position"
            placeholder="Poste"
            {...register('position')}
            className="bg-background"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="department">Département</Label>
        {isLoadingDepartments && selectedCompany ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select
            onValueChange={handleDepartmentChange}
            value={selectedDepartmentId || ''}
            disabled={isLoadingDepartments || !selectedCompany}
          >
            <SelectTrigger id="department" className="bg-background">
              <SelectValue placeholder="Sélectionner un département" />
            </SelectTrigger>
            <SelectContent className="bg-popover border z-50 max-h-[300px]">
              {Array.isArray(departments) && departments.length > 0 ? (
                departments.map((department) => (
                  department && department.id ? (
                    <SelectItem 
                      key={department.id} 
                      value={department.id}
                      className="flex items-center gap-2"
                    >
                      {department.name || ''}
                      {department.color && (
                        <span 
                          className="w-3 h-3 rounded-full inline-block" 
                          style={{ backgroundColor: department.color }}
                        />
                      )}
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
        )}
      </div>
    </div>
  );
};

export default CompanyDepartmentFields;
