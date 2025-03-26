
import React from 'react';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConsultationForm } from "../../context/ConsultationFormContext";

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

const GeneralInfoTab: React.FC = () => {
  const { form } = useConsultationForm();

  if (!form) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="patientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value || "none-selected"}>
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
              <Select onValueChange={field.onChange} defaultValue={field.value || "none-selected"}>
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
    </div>
  );
};

export default GeneralInfoTab;
