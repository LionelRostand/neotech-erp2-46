
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Consultation } from './types/health-types';
import { addDocument, updateDocument } from "@/hooks/firestore/firestore-utils";
import { COLLECTIONS } from "@/lib/firebase-collections";
import { toast } from "sonner";
import { FileImage, PenLine, Monitor, Stethoscope } from "lucide-react";

import { 
  ConsultationFormProvider, 
  consultationFormSchema, 
  ConsultationFormValues 
} from "./context/ConsultationFormContext";
import GeneralInfoTab from "./components/consultation/GeneralInfoTab";
import VitalSignsTab from "./components/consultation/VitalSignsTab";
import ClinicalNotesTab from "./components/consultation/ClinicalNotesTab";
import DocumentsTab from "./components/consultation/DocumentsTab";
import { processConsultationFormData } from "./utils/consultation-form-utils";

interface ConsultationDetailsFormProps {
  consultation?: Consultation;
  onSuccess: () => void;
  onCancel: () => void;
}

const ConsultationDetailsForm: React.FC<ConsultationDetailsFormProps> = ({ 
  consultation, 
  onSuccess, 
  onCancel 
}) => {
  const [activeTab, setActiveTab] = useState("general");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!consultation;

  const form = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationFormSchema),
    defaultValues: {
      patientId: consultation?.patientId || "",
      doctorId: consultation?.doctorId || "",
      chiefComplaint: consultation?.chiefComplaint || "",
      symptoms: consultation?.symptoms || "",
      diagnosis: consultation?.diagnosis || "",
      treatment: consultation?.treatment || "",
      notes: consultation?.notes || "",
      physicalExam: consultation?.physicalExam || "",
      assessment: consultation?.assessment || "",
      plan: consultation?.plan || "",
      medicalHistory: consultation?.medicalHistory || "",
      temperature: consultation?.vitalSigns?.temperature?.toString() || "",
      heartRate: consultation?.vitalSigns?.heartRate?.toString() || "",
      systolic: consultation?.vitalSigns?.bloodPressure?.systolic.toString() || "",
      diastolic: consultation?.vitalSigns?.bloodPressure?.diastolic.toString() || "",
      respiratoryRate: consultation?.vitalSigns?.respiratoryRate?.toString() || "",
      oxygenSaturation: consultation?.vitalSigns?.oxygenSaturation?.toString() || "",
      height: consultation?.vitalSigns?.height?.toString() || "",
      weight: consultation?.vitalSigns?.weight?.toString() || "",
      pain: consultation?.vitalSigns?.pain?.toString() || "",
    },
  });

  async function onSubmit(values: ConsultationFormValues) {
    setIsSubmitting(true);
    try {
      const consultationData = processConsultationFormData(values, isEditing, consultation);

      if (isEditing && consultation) {
        await updateDocument(COLLECTIONS.HEALTH.CONSULTATIONS, consultation.id, consultationData);
        toast.success("Consultation mise à jour avec succès");
      } else {
        await addDocument(COLLECTIONS.HEALTH.CONSULTATIONS, consultationData);
        toast.success("Consultation créée avec succès");
      }
      
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la consultation:", error);
      toast.error("Erreur lors de l'enregistrement de la consultation");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">
          {isEditing ? "Modifier la consultation" : "Nouvelle consultation"}
        </h2>
      </div>

      <ConsultationFormProvider form={form} isEditing={isEditing} consultation={consultation}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="general">
                  <PenLine className="mr-2 h-4 w-4" />
                  Informations générales
                </TabsTrigger>
                <TabsTrigger value="vitals">
                  <Monitor className="mr-2 h-4 w-4" />
                  Signes vitaux
                </TabsTrigger>
                <TabsTrigger value="notes">
                  <Stethoscope className="mr-2 h-4 w-4" />
                  Examen clinique
                </TabsTrigger>
                <TabsTrigger value="documents">
                  <FileImage className="mr-2 h-4 w-4" />
                  Documents & Imagerie
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general">
                <GeneralInfoTab />
              </TabsContent>

              <TabsContent value="vitals">
                <VitalSignsTab />
              </TabsContent>

              <TabsContent value="notes">
                <ClinicalNotesTab />
              </TabsContent>

              <TabsContent value="documents">
                <DocumentsTab />
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={onCancel}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Enregistrement..." : isEditing ? "Mettre à jour" : "Enregistrer"}
              </Button>
            </div>
          </form>
        </Form>
      </ConsultationFormProvider>
    </div>
  );
};

export default ConsultationDetailsForm;
