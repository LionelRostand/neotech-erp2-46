
import React, { createContext, useContext } from 'react';
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { Consultation } from '../types/health-types';

// Schema defined here for sharing between components
export const consultationFormSchema = z.object({
  patientId: z.string({
    required_error: "Le patient est requis",
  }),
  doctorId: z.string({
    required_error: "Le médecin est requis",
  }),
  chiefComplaint: z.string({
    required_error: "Le motif principal est requis",
  }).min(3, {
    message: "Le motif doit contenir au moins 3 caractères",
  }),
  symptoms: z.string({
    required_error: "Les symptômes sont requis",
  }).min(3, {
    message: "Les symptômes doivent contenir au moins 3 caractères",
  }),
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
  notes: z.string().optional(),
  physicalExam: z.string().optional(),
  assessment: z.string().optional(),
  plan: z.string().optional(),
  medicalHistory: z.string().optional(),
  // Nested objects for vital signs
  temperature: z.string().optional(),
  heartRate: z.string().optional(),
  systolic: z.string().optional(),
  diastolic: z.string().optional(),
  respiratoryRate: z.string().optional(),
  oxygenSaturation: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  pain: z.string().optional(),
});

export type ConsultationFormValues = z.infer<typeof consultationFormSchema>;

type ConsultationFormContextType = {
  form: UseFormReturn<ConsultationFormValues> | null;
  isEditing: boolean;
  consultation?: Consultation;
};

const ConsultationFormContext = createContext<ConsultationFormContextType>({
  form: null,
  isEditing: false,
});

export const useConsultationForm = () => useContext(ConsultationFormContext);

export const ConsultationFormProvider: React.FC<{
  children: React.ReactNode;
  form: UseFormReturn<ConsultationFormValues>;
  isEditing: boolean;
  consultation?: Consultation;
}> = ({ children, form, isEditing, consultation }) => {
  return (
    <ConsultationFormContext.Provider value={{ form, isEditing, consultation }}>
      {children}
    </ConsultationFormContext.Provider>
  );
};
