
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TransportDriver } from '../types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Phone, Mail, Calendar, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { updateDocument } from '@/hooks/firestore/update-operations';

// Schema de validation pour le formulaire
const driverFormSchema = z.object({
  firstName: z.string().min(1, { message: "Le prénom est requis" }),
  lastName: z.string().min(1, { message: "Le nom est requis" }),
  phone: z.string().min(1, { message: "Le numéro de téléphone est requis" }),
  email: z.string().email({ message: "Email invalide" }),
  licenseNumber: z.string().min(1, { message: "Le numéro de permis est requis" }),
  licenseExpiry: z.string().min(1, { message: "La date d'expiration est requise" }),
  available: z.boolean(),
});

interface EditDriverFormProps {
  driver: TransportDriver;
  onSave: (driver: TransportDriver) => void;
  onCancel: () => void;
}

const EditDriverForm: React.FC<EditDriverFormProps> = ({ driver, onSave, onCancel }) => {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof driverFormSchema>>({
    resolver: zodResolver(driverFormSchema),
    defaultValues: {
      firstName: driver.firstName,
      lastName: driver.lastName,
      phone: driver.phone,
      email: driver.email,
      licenseNumber: driver.licenseNumber,
      licenseExpiry: driver.licenseExpiry,
      available: driver.available,
    },
  });

  const handleSubmit = async (values: z.infer<typeof driverFormSchema>) => {
    try {
      // Mettre à jour le chauffeur avec les nouvelles valeurs tout en conservant les autres propriétés
      const updatedDriver = {
        ...driver,
        ...values,
      };
      
      // Dans une application réelle, vous utiliseriez updateDocument pour mettre à jour dans Firestore
      // await updateDocument('drivers', driver.id, values);
      
      toast({
        title: "Chauffeur mis à jour",
        description: `Les informations de ${values.firstName} ${values.lastName} ont été mises à jour.`,
      });
      
      onSave(updatedDriver);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du chauffeur:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du chauffeur.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Input {...field} />
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
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="licenseNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro de permis</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="licenseExpiry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date d'expiration</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input type="date" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="available"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Disponibilité</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="flex items-center gap-1"
          >
            <X size={16} />
            Annuler
          </Button>
          <Button 
            type="submit"
            className="flex items-center gap-1"
          >
            <Check size={16} />
            Enregistrer
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditDriverForm;
