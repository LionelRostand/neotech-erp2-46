
import * as z from 'zod';

export const patientFormSchema = z.object({
  firstName: z.string().min(1, { message: 'Le prénom est requis' }),
  lastName: z.string().min(1, { message: 'Le nom de famille est requis' }),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email({ message: 'Email invalide' }).optional().or(z.literal('')),
  bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  allergies: z.array(z.string()).optional(),
  medicalConditions: z.array(z.string()).optional(),
});

export const appointmentFormSchema = z.object({
  patientId: z.string().min(1, { message: 'Le patient est requis' }),
  doctorId: z.string().min(1, { message: 'Le médecin est requis' }),
  date: z.string().min(1, { message: 'La date est requise' }),
  time: z.string().min(1, { message: 'L\'heure est requise' }),
  duration: z.number().min(15).default(30),
  type: z.enum(['consultation', 'followup', 'emergency']),
  status: z.enum(['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show']).default('scheduled'),
  notes: z.string().optional(),
});

export const consultationFormSchema = z.object({
  patientId: z.string().min(1, { message: 'Le patient est requis' }),
  doctorId: z.string().min(1, { message: 'Le médecin est requis' }),
  date: z.string().min(1, { message: 'La date est requise' }),
  time: z.string().min(1, { message: 'L\'heure est requise' }),
  chiefComplaint: z.string().min(1, { message: 'Le motif principal de consultation est requis' }),
  symptoms: z.string().min(1, { message: 'Les symptômes sont requis' }),
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
  notes: z.string().optional(),
  followUp: z.string().optional(),
  status: z.enum(['scheduled', 'in-progress', 'completed', 'cancelled']).default('scheduled'),
});

export const medicalRecordFormSchema = z.object({
  patientId: z.string().min(1, { message: 'Le patient est requis' }),
  type: z.string().min(1, { message: 'Le type de dossier est requis' }),
  date: z.string().min(1, { message: 'La date est requise' }),
  diagnosis: z.string().min(1, { message: 'Le diagnostic est requis' }),
  treatment: z.string().min(1, { message: 'Le traitement est requis' }),
  notes: z.string().optional(),
});

// Adding the missing doctorFormSchema
export const doctorFormSchema = z.object({
  firstName: z.string().min(1, { message: 'Le prénom est requis' }),
  lastName: z.string().min(1, { message: 'Le nom de famille est requis' }),
  specialty: z.string().min(1, { message: 'La spécialité est requise' }),
  licenseNumber: z.string().min(1, { message: 'Le numéro de licence est requis' }),
  email: z.string().email({ message: 'Email invalide' }).optional().or(z.literal('')),
  phone: z.string().optional(),
  department: z.string().optional(),
  status: z.enum(['active', 'inactive', 'on-leave']).default('active'),
});

export type PatientFormValues = z.infer<typeof patientFormSchema>;
export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;
export type ConsultationFormValues = z.infer<typeof consultationFormSchema>;
export type MedicalRecordFormValues = z.infer<typeof medicalRecordFormSchema>;
export type DoctorFormValues = z.infer<typeof doctorFormSchema>;
