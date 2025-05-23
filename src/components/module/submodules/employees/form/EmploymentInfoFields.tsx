
import React, { useEffect, useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFirebaseCompanies } from '@/hooks/useFirebaseCompanies';
import { useFirebaseDepartments } from '@/hooks/useFirebaseDepartments';
import { Loader2, Mail } from 'lucide-react';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { Department } from '@/components/module/submodules/departments/types';

const EmploymentInfoFields = () => {
  const { companies, isLoading } = useFirebaseCompanies();
  const { departments, isLoading: loadingDepartments } = useFirebaseDepartments();
  const { employees, isLoading: loadingEmployees } = useEmployeeData();
  const [formattedCompanies, setFormattedCompanies] = useState<{id: string, name: string}[]>([]);
  const [formattedDepartments, setFormattedDepartments] = useState<{id: string, name: string}[]>([]);
  const [managers, setManagers] = useState<{id: string, name: string}[]>([]);
  
  useEffect(() => {
    if (companies && companies.length > 0) {
      // Format companies for select dropdown
      const formatted = companies.map(company => ({
        id: company.id,
        name: company.name || `Entreprise (${company.id})`
      }));
      setFormattedCompanies(formatted);
    }
  }, [companies]);

  useEffect(() => {
    if (departments && departments.length > 0) {
      // Format departments for select dropdown
      const formatted = departments.map(department => ({
        id: department.id,
        name: department.name || `Département (${department.id})`
      }));
      setFormattedDepartments(formatted);
    }
  }, [departments]);

  // Filtrer et formater les managers à partir de la liste des employés
  useEffect(() => {
    if (employees && employees.length > 0) {
      // Filtrer pour obtenir uniquement les managers (vous pouvez ajuster ce filtre selon votre logique)
      const managersList = employees.filter(emp => 
        emp.isManager === true || 
        (emp.position && (
          emp.position.toLowerCase().includes('manager') || 
          emp.position.toLowerCase().includes('responsable') || 
          emp.position.toLowerCase().includes('directeur')
        ))
      );
      
      // Formater pour le dropdown
      const formattedManagers = managersList.map(manager => ({
        id: manager.id,
        name: `${manager.firstName} ${manager.lastName}`
      }));
      
      setManagers(formattedManagers);
    }
  }, [employees]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Département</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingDepartments ? "Chargement..." : "Sélectionner un département"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {loadingDepartments ? (
                    <div className="flex items-center justify-center p-2">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Chargement des départements...
                    </div>
                  ) : formattedDepartments.length > 0 ? (
                    formattedDepartments.map((department) => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      Aucun département disponible
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poste</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Poste" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Entreprise</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isLoading ? "Chargement..." : "Sélectionner une entreprise"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center p-2">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Chargement des entreprises...
                    </div>
                  ) : formattedCompanies.length > 0 ? (
                    formattedCompanies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      Aucune entreprise disponible
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          name="contract"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de contrat</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value || "CDI"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type de contrat" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="CDI">CDI</SelectItem>
                  <SelectItem value="CDD">CDD</SelectItem>
                  <SelectItem value="Interim">Intérim</SelectItem>
                  <SelectItem value="Stage">Stage</SelectItem>
                  <SelectItem value="Apprentissage">Apprentissage</SelectItem>
                  <SelectItem value="Freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          name="hireDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date d'embauche</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          name="managerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsable</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingEmployees ? "Chargement..." : "Sélectionner un responsable"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {loadingEmployees ? (
                    <div className="flex items-center justify-center p-2">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Chargement des responsables...
                    </div>
                  ) : managers.length > 0 ? (
                    managers.map((manager) => (
                      <SelectItem key={manager.id} value={manager.id}>
                        {manager.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      Aucun responsable disponible
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        name="professionalEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email professionnel</FormLabel>
            <FormControl>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <Input 
                  type="email" 
                  placeholder="email.professionnel@entreprise.com" 
                  {...field} 
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Statut</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value || "Actif"}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Actif">Actif</SelectItem>
                <SelectItem value="En congé">En congé</SelectItem>
                <SelectItem value="Suspendu">Suspendu</SelectItem>
                <SelectItem value="Inactif">Inactif</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default EmploymentInfoFields;
