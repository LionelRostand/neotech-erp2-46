
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RecruitmentOffer {
  id: string;
  position: string;
  department: string;
  description: string;
  requirements: string;
  location: string;
  contractType: string;
  salary: string;
  hiringManagerId: string;
  hiringManagerName: string;
  openDate: string;
  applicationDeadline: string;
  status: string;
  priority: string;
  applicationCount: number;
}

const formSchema = z.object({
  position: z.string().min(2, 'Le poste doit contenir au moins 2 caractères'),
  department: z.string().min(1, 'Le département est requis'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  requirements: z.string().min(10, 'Les prérequis doivent contenir au moins 10 caractères'),
  location: z.string().min(2, 'Le lieu est requis'),
  contractType: z.string().min(1, 'Le type de contrat est requis'),
  salary: z.string().min(1, 'Le salaire est requis'),
  hiringManagerId: z.string().optional(),
  hiringManagerName: z.string().min(2, 'Le responsable du recrutement est requis'),
  openDate: z.date(),
  applicationDeadline: z.date(),
  status: z.string().min(1, 'Le statut est requis'),
  priority: z.string().min(1, 'La priorité est requise'),
});

type RecruitmentFormData = z.infer<typeof formSchema>;

interface RecruitmentFormProps {
  initialData?: Partial<RecruitmentFormData>;
  onSubmit: (data: RecruitmentFormData) => void;
  onCancel: () => void;
}

export const RecruitmentForm: React.FC<RecruitmentFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const defaultValues: Partial<RecruitmentFormData> = {
    position: '',
    department: '',
    description: '',
    requirements: '',
    location: '',
    contractType: '',
    salary: '',
    hiringManagerId: '',
    hiringManagerName: '',
    openDate: new Date(),
    applicationDeadline: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    status: 'Ouvert',
    priority: 'Moyenne',
    ...initialData,
  };

  const form = useForm<RecruitmentFormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (data: RecruitmentFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informations du poste */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Informations du poste</h3>
            
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intitulé du poste</FormLabel>
                  <FormControl>
                    <Input placeholder="Intitulé du poste" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
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
                        <SelectValue placeholder="Sélectionner un département" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="RH">Ressources Humaines</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                      <SelectItem value="Production">Production</SelectItem>
                      <SelectItem value="R&D">Recherche & Développement</SelectItem>
                      <SelectItem value="Juridique">Juridique</SelectItem>
                      <SelectItem value="Direction">Direction</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lieu</FormLabel>
                  <FormControl>
                    <Input placeholder="Paris, Lyon, Télétravail..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contractType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de contrat</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type de contrat" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CDI">CDI</SelectItem>
                      <SelectItem value="CDD">CDD</SelectItem>
                      <SelectItem value="Stage">Stage</SelectItem>
                      <SelectItem value="Alternance">Alternance</SelectItem>
                      <SelectItem value="Freelance">Freelance</SelectItem>
                      <SelectItem value="Interim">Intérim</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salaire</FormLabel>
                  <FormControl>
                    <Input placeholder="45-55K€ annuel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Détails et responsable */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Détails et responsable</h3>
            
            <FormField
              control={form.control}
              name="hiringManagerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsable du recrutement</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du responsable" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="openDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date d'ouverture</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "P", { locale: fr })
                          ) : (
                            <span>Choisir une date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="applicationDeadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date limite de candidature</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "P", { locale: fr })
                          ) : (
                            <span>Choisir une date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Ouvert">Ouvert</SelectItem>
                      <SelectItem value="En cours">En cours</SelectItem>
                      <SelectItem value="Clôturé">Clôturé</SelectItem>
                      <SelectItem value="Abandonné">Abandonné</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priorité</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une priorité" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Basse">Basse</SelectItem>
                      <SelectItem value="Moyenne">Moyenne</SelectItem>
                      <SelectItem value="Haute">Haute</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        {/* Description et prérequis */}
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Description et prérequis</h3>
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description du poste</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Description détaillée du poste, missions, responsabilités..." 
                    className="min-h-[120px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="requirements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prérequis et compétences</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Formation, expérience, compétences techniques, qualités personnelles..." 
                    className="min-h-[120px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            Publier l'offre
          </Button>
        </div>
      </form>
    </Form>
  );
};
