
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCompanyService } from './services/companyService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Building2, MapPin, Phone, AtSign, Upload } from 'lucide-react';
import { Company } from './types';

// Définition du schéma de validation
const companyFormSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  siret: z.string().min(9, "Le SIRET doit contenir au moins 9 caractères").optional(),
  registrationNumber: z.string().optional(),
  type: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending']).default('active'),
  description: z.string().optional(),
  website: z.string().url("Veuillez entrer une URL valide").optional().or(z.literal('')),
  
  // Contact info
  contactName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  contactEmail: z.string().email("Email invalide"),
  contactPhone: z.string().optional(),
  
  // Address
  street: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().default('France'),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

const CompanyCreateForm: React.FC = () => {
  const navigate = useNavigate();
  const { createCompany } = useCompanyService();
  
  // Initialiser le formulaire
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: '',
      siret: '',
      registrationNumber: '',
      type: '',
      status: 'active',
      description: '',
      website: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      street: '',
      city: '',
      postalCode: '',
      country: 'France',
    },
  });
  
  const onSubmit = async (data: CompanyFormValues) => {
    try {
      // Reformater les données pour correspondre à la structure Company
      const companyData: Partial<Company> = {
        name: data.name,
        siret: data.siret,
        registrationNumber: data.registrationNumber,
        type: data.type,
        status: data.status,
        description: data.description,
        website: data.website,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        address: {
          street: data.street,
          city: data.city,
          postalCode: data.postalCode,
          country: data.country,
        },
      };
      
      const result = await createCompany(companyData);
      
      if (result) {
        toast.success("Entreprise créée avec succès");
        navigate('/modules/companies/list');
      }
    } catch (error) {
      console.error('Error creating company:', error);
      toast.error("Échec de la création de l'entreprise");
    }
  };
  
  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="general">Informations générales</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="address">Adresse</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            
            {/* Onglet Informations générales */}
            <TabsContent value="general">
              <Card className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4 md:col-span-2">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-5 w-5 text-gray-500" />
                      <h3 className="text-lg font-medium">Informations de l'entreprise</h3>
                    </div>
                    <Separator />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom de l'entreprise</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom de l'entreprise" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="siret"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numéro SIRET</FormLabel>
                        <FormControl>
                          <Input placeholder="123 456 789 00012" {...field} />
                        </FormControl>
                        <FormDescription>
                          Numéro d'identification français (14 chiffres)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="registrationNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numéro d'enregistrement</FormLabel>
                        <FormControl>
                          <Input placeholder="ABC123456" {...field} />
                        </FormControl>
                        <FormDescription>
                          Numéro d'enregistrement commercial
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type d'entreprise</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="sarl">SARL</SelectItem>
                            <SelectItem value="sas">SAS</SelectItem>
                            <SelectItem value="sa">SA</SelectItem>
                            <SelectItem value="ei">Entreprise Individuelle</SelectItem>
                            <SelectItem value="eurl">EURL</SelectItem>
                            <SelectItem value="sci">SCI</SelectItem>
                            <SelectItem value="sasu">SASU</SelectItem>
                            <SelectItem value="other">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Statut</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un statut" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Actif</SelectItem>
                            <SelectItem value="inactive">Inactif</SelectItem>
                            <SelectItem value="pending">En attente</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site web</FormLabel>
                        <FormControl>
                          <Input placeholder="https://www.entreprise.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Description de l'entreprise" 
                              className="min-h-32" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            {/* Onglet Contact */}
            <TabsContent value="contact">
              <Card className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4 md:col-span-2">
                    <div className="flex items-center space-x-2">
                      <AtSign className="h-5 w-5 text-gray-500" />
                      <h3 className="text-lg font-medium">Contact principal</h3>
                    </div>
                    <Separator />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom du contact</FormLabel>
                        <FormControl>
                          <Input placeholder="Jean Dupont" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email du contact</FormLabel>
                        <FormControl>
                          <Input placeholder="contact@entreprise.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone du contact</FormLabel>
                        <FormControl>
                          <Input placeholder="+33 1 23 45 67 89" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Card>
            </TabsContent>
            
            {/* Onglet Adresse */}
            <TabsContent value="address">
              <Card className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4 md:col-span-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <h3 className="text-lg font-medium">Adresse</h3>
                    </div>
                    <Separator />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rue</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Rue de Paris" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ville</FormLabel>
                        <FormControl>
                          <Input placeholder="Paris" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code postal</FormLabel>
                        <FormControl>
                          <Input placeholder="75001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pays</FormLabel>
                        <FormControl>
                          <Input placeholder="France" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Card>
            </TabsContent>
            
            {/* Onglet Documents */}
            <TabsContent value="documents">
              <Card className="p-6">
                <div className="grid gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Upload className="h-5 w-5 text-gray-500" />
                      <h3 className="text-lg font-medium">Documents justificatifs</h3>
                    </div>
                    <Separator />
                  </div>
                  
                  <div className="border border-dashed rounded-lg p-10 text-center">
                    <div className="flex flex-col items-center space-y-4">
                      <Upload className="h-10 w-10 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">
                          Glissez-déposez des fichiers ici ou
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Formats acceptés: PDF, JPG, PNG (max. 10 Mo)
                        </p>
                      </div>
                      <Button type="button" variant="outline">
                        Parcourir les fichiers
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    <p>Documents suggérés :</p>
                    <ul className="list-disc list-inside mt-2">
                      <li>Extrait Kbis</li>
                      <li>Justificatif d'identité du dirigeant</li>
                      <li>Statuts de l'entreprise</li>
                      <li>RIB</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/modules/companies/list')}
            >
              Annuler
            </Button>
            <Button type="submit">Créer l'entreprise</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CompanyCreateForm;
