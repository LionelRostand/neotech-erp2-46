
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Consultation, VitalSigns, MedicalImage } from './types/health-types';
import { addDocument, updateDocument } from "@/hooks/firestore/firestore-utils";
import { COLLECTIONS } from "@/lib/firebase-collections";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { FileImage, FilePlus, Monitor, Stethoscope, 
  Thermometer, Heart, Activity, Lungs, PenLine } from "lucide-react";

const formSchema = z.object({
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

// Mock data
const mockPatients = [
  { id: "pat-1", name: "Jean Dupont" },
  { id: "pat-2", name: "Marie Martin" },
  { id: "pat-3", name: "Pierre Durand" },
];

const mockDoctors = [
  { id: "doc-1", name: "Dr. Sophie Martin" },
  { id: "doc-2", name: "Dr. Thomas Dubois" },
];

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      // Construire l'objet des signes vitaux
      const vitalSigns: VitalSigns = {};
      
      if (values.temperature) vitalSigns.temperature = parseFloat(values.temperature);
      if (values.heartRate) vitalSigns.heartRate = parseFloat(values.heartRate);
      if (values.systolic && values.diastolic) {
        vitalSigns.bloodPressure = {
          systolic: parseFloat(values.systolic),
          diastolic: parseFloat(values.diastolic)
        };
      }
      if (values.respiratoryRate) vitalSigns.respiratoryRate = parseFloat(values.respiratoryRate);
      if (values.oxygenSaturation) vitalSigns.oxygenSaturation = parseFloat(values.oxygenSaturation);
      if (values.height) vitalSigns.height = parseFloat(values.height);
      if (values.weight) vitalSigns.weight = parseFloat(values.weight);
      if (values.pain) vitalSigns.pain = parseFloat(values.pain);
      
      // Calculer l'IMC si taille et poids sont présents
      if (vitalSigns.height && vitalSigns.weight) {
        const heightInMeters = vitalSigns.height / 100;
        vitalSigns.bmi = parseFloat((vitalSigns.weight / (heightInMeters * heightInMeters)).toFixed(1));
      }

      // Construire l'objet consultation
      const consultationData: Partial<Consultation> = {
        patientId: values.patientId,
        doctorId: values.doctorId,
        chiefComplaint: values.chiefComplaint,
        symptoms: values.symptoms,
        diagnosis: values.diagnosis || undefined,
        treatment: values.treatment || undefined,
        notes: values.notes || undefined,
        physicalExam: values.physicalExam || undefined,
        assessment: values.assessment || undefined,
        plan: values.plan || undefined,
        medicalHistory: values.medicalHistory || undefined,
        vitalSigns: Object.keys(vitalSigns).length > 0 ? vitalSigns : undefined,
        status: isEditing ? consultation.status : 'in-progress',
        date: isEditing ? consultation.date : new Date(),
      };

      if (isEditing) {
        await updateDocument(COLLECTIONS.HEALTH_CONSULTATIONS, consultation.id, consultationData);
        toast.success("Consultation mise à jour avec succès");
      } else {
        await addDocument(COLLECTIONS.HEALTH_CONSULTATIONS, consultationData);
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

            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="patientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un patient" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockPatients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id}>
                              {patient.name}
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
                  name="doctorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Médecin</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un médecin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockDoctors.map((doctor) => (
                            <SelectItem key={doctor.id} value={doctor.id}>
                              {doctor.name}
                            </SelectItem>
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
                name="chiefComplaint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motif principal de consultation</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Raison principale pour laquelle le patient consulte
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symptômes</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Décrivez les symptômes du patient..."
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="medicalHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Antécédents médicaux pertinents</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Antécédents médicaux liés à la consultation..."
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value="vitals" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Thermometer className="mr-2 h-4 w-4 text-red-500" />
                      Température
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="temperature"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <div className="flex items-center">
                            <FormControl>
                              <Input {...field} type="number" step="0.1" placeholder="37.0" />
                            </FormControl>
                            <span className="ml-2">°C</span>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Heart className="mr-2 h-4 w-4 text-red-500" />
                      Fréquence cardiaque
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="heartRate"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <div className="flex items-center">
                            <FormControl>
                              <Input {...field} type="number" placeholder="75" />
                            </FormControl>
                            <span className="ml-2">bpm</span>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Activity className="mr-2 h-4 w-4 text-red-500" />
                      Tension artérielle
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-2">
                      <FormField
                        control={form.control}
                        name="systolic"
                        render={({ field }) => (
                          <FormItem className="space-y-1 flex-1">
                            <FormControl>
                              <Input {...field} type="number" placeholder="120" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <span className="mt-2">/</span>
                      <FormField
                        control={form.control}
                        name="diastolic"
                        render={({ field }) => (
                          <FormItem className="space-y-1 flex-1">
                            <FormControl>
                              <Input {...field} type="number" placeholder="80" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <span className="mt-2">mmHg</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Lungs className="mr-2 h-4 w-4 text-blue-500" />
                      Fréquence respiratoire
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="respiratoryRate"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <div className="flex items-center">
                            <FormControl>
                              <Input {...field} type="number" placeholder="16" />
                            </FormControl>
                            <span className="ml-2">resp/min</span>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Activity className="mr-2 h-4 w-4 text-blue-500" />
                      Saturation en oxygène
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="oxygenSaturation"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <div className="flex items-center">
                            <FormControl>
                              <Input {...field} type="number" placeholder="98" />
                            </FormControl>
                            <span className="ml-2">%</span>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Douleur (0-10)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="pain"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormControl>
                            <Input {...field} type="number" min="0" max="10" placeholder="0" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Taille
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <div className="flex items-center">
                            <FormControl>
                              <Input {...field} type="number" placeholder="170" />
                            </FormControl>
                            <span className="ml-2">cm</span>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Poids
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <div className="flex items-center">
                            <FormControl>
                              <Input {...field} type="number" placeholder="70" />
                            </FormControl>
                            <span className="ml-2">kg</span>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
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
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Images et documents médicaux</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <FilePlus className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Cliquez pour ajouter des images ou documents</p>
                    <p className="text-xs text-gray-400 mt-1">Formats acceptés: JPEG, PNG, PDF, DICOM</p>
                    <Button className="mt-4" variant="outline" type="button">
                      Ajouter un document
                    </Button>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-2">Documents associés</h4>
                    <p className="text-sm text-gray-500 italic">Aucun document associé à cette consultation</p>
                  </div>
                </CardContent>
              </Card>
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
    </div>
  );
};

export default ConsultationDetailsForm;
