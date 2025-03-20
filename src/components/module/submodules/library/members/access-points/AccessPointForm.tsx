
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form,
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AccessPoint } from './types';

const accessPointSchema = z.object({
  name: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
  address: z.string().min(5, "L'adresse doit comporter au moins 5 caractères"),
  contact: z.string().min(5, "Le contact doit comporter au moins 5 caractères").optional(),
  description: z.string().optional(),
  login: z.string().min(3, "L'identifiant doit comporter au moins 3 caractères"),
  password: z.string().min(6, "Le mot de passe doit comporter au moins 6 caractères"),
});

type AccessPointFormValues = z.infer<typeof accessPointSchema>;

interface AccessPointFormProps {
  accessPoint?: AccessPoint;
  onSubmit: (data: AccessPointFormValues) => void;
  onCancel: () => void;
}

const AccessPointForm: React.FC<AccessPointFormProps> = ({
  accessPoint,
  onSubmit,
  onCancel
}) => {
  const form = useForm<AccessPointFormValues>({
    resolver: zodResolver(accessPointSchema),
    defaultValues: {
      name: accessPoint?.name || '',
      address: accessPoint?.address || '',
      contact: accessPoint?.contact || '',
      description: accessPoint?.description || '',
      login: accessPoint?.login || '',
      password: accessPoint?.password || '',
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du point d'accès</FormLabel>
              <FormControl>
                <Input placeholder="Bibliothèque principale" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse</FormLabel>
              <FormControl>
                <Input placeholder="123 rue de la Bibliothèque, 75000 Paris" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact</FormLabel>
              <FormControl>
                <Input placeholder="01 23 45 67 89" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Description du point d'accès"
                  className="min-h-20"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-medium mb-3">Identifiants d'accès</h3>
          
          <FormField
            control={form.control}
            name="login"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Identifiant</FormLabel>
                <FormControl>
                  <Input placeholder="admin" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            {accessPoint ? 'Mettre à jour' : 'Ajouter'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AccessPointForm;
