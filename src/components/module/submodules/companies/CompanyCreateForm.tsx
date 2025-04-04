import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useCompanyService } from './services/companyService';
import { Company } from './types';

// Define the form schema using Zod
const companyFormSchema = z.object({
  name: z.string().min(2, { message: "Le nom de l'entreprise doit comporter au moins 2 caractères." }),
  street: z.string().optional(),
  city: z.string().min(2, { message: "La ville doit comporter au moins 2 caractères." }),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  siret: z.string().optional(),
  industry: z.string().optional(),
  size: z.string().optional(),
  employeesCount: z.string().optional(),
  email: z.string().email({ message: "Format d'email invalide." }).optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending']).optional(),
  contactName: z.string().optional(),
  contactEmail: z.string().email({ message: "Format d'email invalide." }).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

type CompanyFormData = z.infer<typeof companyFormSchema>;

const CompanyCreateForm = () => {
  const router = useRouter();
  const [isSubmitting, setSubmitting] = useState(false);
  const { createCompany } = useCompanyService();

  // Initialize the form with useForm hook
  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: '',
      street: '',
      city: '',
      postalCode: '',
      country: 'France',
      siret: '',
      industry: '',
      size: '',
      employeesCount: '',
      email: '',
      phone: '',
      website: '',
      status: 'active',
      contactName: '',
      contactEmail: '',
      createdAt: new Date(),
      updatedAt: new Date()
    },
  });

  // When submitting the form
  const handleSubmit = async (data: CompanyFormData) => {
    try {
      setSubmitting(true);
      
      // Format the data for API
      const companyData: Omit<Company, 'id' | 'createdAt' | 'updatedAt'> = {
        name: data.name,
        address: {
          street: data.street,
          city: data.city,
          postalCode: data.postalCode,
          country: data.country
        },
        siret: data.siret,
        industry: data.industry,
        size: data.size,
        employeesCount: parseInt(data.employeesCount, 10) || 0,
        email: data.email,
        phone: data.phone,
        website: data.website,
        status: data.status,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        // Convert Date objects to ISO strings for consistent storage
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Create the company
      await createCompany(companyData);
      
      // Reset form and navigate to list
      form.reset();
      router.push('/modules/companies/list');
    } catch (error) {
      console.error('Error creating company:', error);
      toast.error('Erreur lors de la création de l\'entreprise');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nom de l'entreprise
        </Label>
        <Input
          type="text"
          id="name"
          className="mt-1 block w-full"
          {...form.register('name')}
        />
        {form.formState.errors.name && (
          <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="street" className="block text-sm font-medium text-gray-700">
          Adresse
        </Label>
        <Input
          type="text"
          id="street"
          className="mt-1 block w-full"
          {...form.register('street')}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="city" className="block text-sm font-medium text-gray-700">
            Ville
          </Label>
          <Input
            type="text"
            id="city"
            className="mt-1 block w-full"
            {...form.register('city')}
          />
          {form.formState.errors.city && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.city.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
            Code Postal
          </Label>
          <Input
            type="text"
            id="postalCode"
            className="mt-1 block w-full"
            {...form.register('postalCode')}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="country" className="block text-sm font-medium text-gray-700">
          Pays
        </Label>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionner un pays" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="France">France</SelectItem>
            <SelectItem value="Belgique">Belgique</SelectItem>
            <SelectItem value="Suisse">Suisse</SelectItem>
            <SelectItem value="Canada">Canada</SelectItem>
            <SelectItem value="Luxembourg">Luxembourg</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="siret" className="block text-sm font-medium text-gray-700">
          SIRET
        </Label>
        <Input
          type="text"
          id="siret"
          className="mt-1 block w-full"
          {...form.register('siret')}
        />
      </div>

      <div>
        <Label htmlFor="industry" className="block text-sm font-medium text-gray-700">
          Secteur d'activité
        </Label>
        <Input
          type="text"
          id="industry"
          className="mt-1 block w-full"
          {...form.register('industry')}
        />
      </div>

      <div>
        <Label htmlFor="size" className="block text-sm font-medium text-gray-700">
          Taille de l'entreprise
        </Label>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionner la taille" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="micro">Micro (1-9 employés)</SelectItem>
            <SelectItem value="small">Petite (10-49 employés)</SelectItem>
            <SelectItem value="medium">Moyenne (50-249 employés)</SelectItem>
            <SelectItem value="large">Grande (250+ employés)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="employeesCount" className="block text-sm font-medium text-gray-700">
          Nombre d'employés
        </Label>
        <Input
          type="number"
          id="employeesCount"
          className="mt-1 block w-full"
          {...form.register('employeesCount')}
        />
      </div>

      <div>
        <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </Label>
        <Input
          type="email"
          id="email"
          className="mt-1 block w-full"
          {...form.register('email')}
        />
        {form.formState.errors.email && (
          <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Téléphone
        </Label>
        <Input
          type="tel"
          id="phone"
          className="mt-1 block w-full"
          {...form.register('phone')}
        />
      </div>

      <div>
        <Label htmlFor="website" className="block text-sm font-medium text-gray-700">
          Site web
        </Label>
        <Input
          type="url"
          id="website"
          className="mt-1 block w-full"
          {...form.register('website')}
        />
      </div>

      <div>
        <Label htmlFor="contactName" className="block text-sm font-medium text-gray-700">
          Nom du contact
        </Label>
        <Input
          type="text"
          id="contactName"
          className="mt-1 block w-full"
          {...form.register('contactName')}
        />
      </div>

      <div>
        <Label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
          Email du contact
        </Label>
        <Input
          type="email"
          id="contactEmail"
          className="mt-1 block w-full"
          {...form.register('contactEmail')}
        />
        {form.formState.errors.contactEmail && (
          <p className="text-red-500 text-sm mt-1">{form.formState.errors.contactEmail.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Création...' : 'Créer l\'entreprise'}
      </Button>
    </form>
  );
};

export default CompanyCreateForm;
