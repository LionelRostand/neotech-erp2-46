
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeFormSchema, EmployeeFormValues } from './employeeFormSchema';
import { prepareEmployeeData } from './employeeUtils';
import { createEmployeeWithAccount } from '@/services/userService';
import { toast } from 'sonner';
import { Employee } from '@/types/employee';

interface UseEmployeeFormProps {
  employee?: Employee;
  isEditing?: boolean;
  onSubmit: (data: Partial<Employee>) => void;
  onClose: () => void;
}

export const useEmployeeForm = ({ 
  employee, 
  isEditing = false, 
  onSubmit,
  onClose
}: UseEmployeeFormProps) => {
  const [createAccount, setCreateAccount] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      department: '',
      position: '',
      contract: 'CDI',
      hireDate: '',
      manager: '',
      status: 'Actif',
      professionalEmail: '',
    },
  });

  // Load employee data when editing
  useEffect(() => {
    if (isEditing && employee) {
      form.reset({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        address: employee.address,
        department: employee.department,
        position: employee.position,
        contract: employee.contract,
        hireDate: employee.hireDate,
        manager: employee.manager,
        status: employee.status,
        professionalEmail: employee.professionalEmail || '',
      });
    } else {
      form.reset({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        department: '',
        position: '',
        contract: 'CDI',
        hireDate: '',
        manager: '',
        status: 'Actif',
        professionalEmail: '',
      });
    }
  }, [isEditing, employee, form]);

  // Generate professional email based on name and surname
  const generateProfessionalEmail = () => {
    const firstName = form.getValues('firstName').toLowerCase();
    const lastName = form.getValues('lastName').toLowerCase();
    
    if (firstName && lastName) {
      const professionalEmail = `${firstName.charAt(0)}.${lastName}@entreprise.com`;
      form.setValue('professionalEmail', professionalEmail);
    }
  };

  // Form submission handler
  const handleSubmit = async (data: EmployeeFormValues) => {
    setIsSubmitting(true);
    
    try {
      if (createAccount && !isEditing) {
        // Check for professional email when creating an account
        if (!data.professionalEmail) {
          toast.error("L'email professionnel est requis pour créer un compte utilisateur");
          setIsSubmitting(false);
          return;
        }
        
        // Create employee with user account
        const employeeData = prepareEmployeeData(data);
        const result = await createEmployeeWithAccount(employeeData, data.professionalEmail);
        
        if (result.success) {
          onSubmit(result.employee);
          toast.success(
            "Employé créé avec succès. Un email a été envoyé à l'adresse professionnelle pour configurer le mot de passe."
          );
        } else {
          toast.error("Erreur lors de la création du compte utilisateur");
        }
      } else {
        // Create or update employee without user account
        const employeeData = isEditing 
          ? data
          : prepareEmployeeData(data);
        
        onSubmit(employeeData);
        toast.success(`Employé ${isEditing ? 'mis à jour' : 'ajouté'} avec succès`);
      }
      
      form.reset();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error);
      toast.error("Une erreur est survenue lors de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    createAccount,
    setCreateAccount,
    isSubmitting,
    handleSubmit,
    generateProfessionalEmail
  };
};
