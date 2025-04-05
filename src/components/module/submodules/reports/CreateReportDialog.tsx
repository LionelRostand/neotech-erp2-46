
import React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface CreateReportDialogProps {
  onClose: () => void;
}

const formSchema = z.object({
  title: z.string().min(3, { message: "Le titre doit contenir au moins 3 caractères" }),
  type: z.string({ required_error: "Veuillez sélectionner un type de rapport" }),
  format: z.string({ required_error: "Veuillez sélectionner un format" }),
  description: z.string().optional(),
  period: z.string().optional(),
});

const CreateReportDialog: React.FC<CreateReportDialogProps> = ({ onClose }) => {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "social",
      format: "PDF",
      description: "",
      period: "month",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Simuler l'envoi de données 
    const newReport = {
      id: uuidv4(),
      title: data.title,
      type: data.type,
      format: data.format,
      description: data.description,
      period: data.period,
      createdDate: new Date().toISOString(),
      createdBy: "current-user",
      status: "En traitement",
      views: 0
    };

    console.log("Nouveau rapport à générer:", newReport);

    toast({
      title: "Rapport créé",
      description: "Votre rapport est en cours de génération"
    });

    onClose();
  };

  const reportTypes = [
    { id: "social", name: "Bilan social" },
    { id: "salaries", name: "Analyse des salaires" },
    { id: "absences", name: "Suivi des absences" },
    { id: "turnover", name: "Turnover" },
    { id: "formations", name: "Formation et compétences" },
    { id: "custom", name: "Rapport personnalisé" }
  ];

  const periods = [
    { id: "month", name: "Ce mois-ci" },
    { id: "quarter", name: "Ce trimestre" },
    { id: "year", name: "Cette année" },
    { id: "custom", name: "Période personnalisée" }
  ];

  const formats = [
    { id: "PDF", name: "PDF" },
    { id: "Excel", name: "Excel" },
    { id: "CSV", name: "CSV" }
  ];

  return (
    <>
      <DialogHeader>
        <DialogTitle>Nouveau rapport</DialogTitle>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titre du rapport</FormLabel>
                <FormControl>
                  <Input placeholder="Saisissez un titre pour ce rapport" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de rapport</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {reportTypes.map(type => (
                        <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Format</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {formats.map(format => (
                        <SelectItem key={format.id} value={format.id}>{format.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Période</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une période" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {periods.map(period => (
                      <SelectItem key={period.id} value={period.id}>{period.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (optionnelle)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Description ou paramètres supplémentaires"
                    className="resize-none h-20"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter className="pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              Générer le rapport
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};

export default CreateReportDialog;
