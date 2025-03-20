
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

// Définition du schéma de validation
const doctorSchema = z.object({
  firstName: z.string().min(2, { message: 'Le prénom doit contenir au moins 2 caractères' }),
  lastName: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
  speciality: z.string().min(2, { message: 'La spécialité est requise' }),
  licenseNumber: z.string().min(5, { message: 'Le numéro de licence est requis' }),
  email: z.string().email({ message: 'Adresse email invalide' }),
  phone: z.string().min(10, { message: 'Numéro de téléphone invalide' }),
  address: z.string().min(5, { message: 'L\'adresse doit contenir au moins 5 caractères' }),
  availability: z.enum(['full-time', 'part-time']),
  bio: z.string().optional(),
});

type DoctorFormValues = z.infer<typeof doctorSchema>;

interface DoctorFormProps {
  onSuccess?: () => void;
}

const specialities = [
  { value: 'general', label: 'Médecine Générale' },
  { value: 'cardiology', label: 'Cardiologie' },
  { value: 'dermatology', label: 'Dermatologie' },
  { value: 'neurology', label: 'Neurologie' },
  { value: 'pediatrics', label: 'Pédiatrie' },
  { value: 'orthopedics', label: 'Orthopédie' },
  { value: 'gynecology', label: 'Gynécologie' },
  { value: 'ophthalmology', label: 'Ophtalmologie' },
  { value: 'urology', label: 'Urologie' },
  { value: 'psychiatry', label: 'Psychiatrie' },
];

const DoctorForm: React.FC<DoctorFormProps> = ({ onSuccess }) => {
  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      speciality: '',
      licenseNumber: '',
      email: '',
      phone: '',
      address: '',
      availability: 'full-time',
      bio: '',
    }
  });

  const onSubmit = async (data: DoctorFormValues) => {
    try {
      // Simulation d'envoi à l'API
      console.log('Doctor data submitted:', data);
      
      // Simuler une attente
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Médecin enregistré avec succès');
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving doctor:', error);
      toast.error('Erreur lors de l\'enregistrement du médecin');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input placeholder="Prénom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Nom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="speciality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Spécialité</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une spécialité" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {specialities.map((speciality) => (
                      <SelectItem key={speciality.value} value={speciality.value}>
                        {speciality.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="licenseNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro de licence</FormLabel>
                <FormControl>
                  <Input placeholder="Numéro de licence" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone</FormLabel>
                <FormControl>
                  <Input placeholder="Téléphone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse</FormLabel>
              <FormControl>
                <Input placeholder="Adresse" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="availability"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Disponibilité</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex gap-4"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="full-time" />
                    </FormControl>
                    <FormLabel className="font-normal">Temps plein</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="part-time" />
                    </FormControl>
                    <FormLabel className="font-normal">Temps partiel</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biographie et compétences</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Biographie, formations, compétences spécifiques..."
                  className="resize-none min-h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={() => form.reset()}>
            Réinitialiser
          </Button>
          <Button type="submit">Enregistrer le médecin</Button>
        </div>
      </form>
    </Form>
  );
};

export default DoctorForm;
