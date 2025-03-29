
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { EmployeeFormValues } from './employeeFormSchema';

interface AccountCreationSectionProps {
  form: UseFormReturn<EmployeeFormValues>;
  createAccount: boolean;
  onCreateAccountChange: (value: boolean) => void;
  generateProfessionalEmail: () => void;
}

const AccountCreationSection: React.FC<AccountCreationSectionProps> = ({
  form,
  createAccount,
  onCreateAccountChange,
  generateProfessionalEmail
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="create-account" 
          checked={createAccount}
          onCheckedChange={onCreateAccountChange}
        />
        <Label htmlFor="create-account">
          Créer un compte utilisateur pour cet employé
        </Label>
      </div>
      
      {createAccount && (
        <div className="space-y-4">
          <Alert variant="outline" className="bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription>
              Un email sera envoyé à l'adresse professionnelle pour configurer le mot de passe.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="professional-email">Email professionnel</Label>
            <div className="flex gap-2">
              <input
                id="professional-email"
                {...form.register('professionalEmail')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="prenom.nom@entreprise.com"
              />
              <button
                type="button"
                onClick={generateProfessionalEmail}
                className="h-10 px-3 py-2 bg-gray-100 rounded-md text-sm font-medium"
              >
                Générer
              </button>
            </div>
            {form.formState.errors.professionalEmail && (
              <p className="text-sm text-red-500">
                {form.formState.errors.professionalEmail.message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountCreationSection;
