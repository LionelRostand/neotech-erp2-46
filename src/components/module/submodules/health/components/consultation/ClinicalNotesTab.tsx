
import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useConsultationForm } from "../../context/ConsultationFormContext";

const ClinicalNotesTab: React.FC = () => {
  const { form } = useConsultationForm();

  if (!form) return null;

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="physicalExam"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Examen physique</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Observations de l'examen physique..."
                className="min-h-[100px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="assessment"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Évaluation</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Évaluation clinique..."
                className="min-h-[100px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="diagnosis"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Diagnostic</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Diagnostic du patient..."
                className="min-h-[100px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="plan"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Plan de traitement</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Plan de traitement proposé..."
                className="min-h-[100px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="treatment"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Traitement</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Traitement prescrit..."
                className="min-h-[100px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notes supplémentaires</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Notes additionnelles..."
                className="min-h-[100px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ClinicalNotesTab;
