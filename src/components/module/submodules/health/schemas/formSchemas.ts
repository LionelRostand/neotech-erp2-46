
import * as z from "zod";

export const patientFormSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  dateOfBirth: z.string().min(1, "La date de naissance est requise"),
  email: z.string().email("Email invalide").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  gender: z.enum(["male", "female", "other"]),
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

export const appointmentFormSchema = z.object({
  patientId: z.string().min(1, "Le patient est requis"),
  doctorId: z.string().min(1, "Le médecin est requis"),
  date: z.string().min(1, "La date est requise"),
  time: z.string().min(1, "L'heure est requise"),
  type: z.string().min(1, "Le type de rendez-vous est requis"),
  status: z.enum(["scheduled", "confirmed", "completed", "cancelled"]).default("scheduled"),
  notes: z.string().optional(),
  duration: z.number().min(15).default(30),
});

export const doctorFormSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  specialty: z.string().min(1, "La spécialité est requise"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  department: z.string().optional(),
  status: z.string().default("active"),
  licenseNumber: z.string().min(1, "Le numéro de licence est requis"),
});

export const staffFormSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  role: z.string().min(1, "Le rôle est requis"),
  department: z.string().optional(),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  status: z.string().default("active"),
  position: z.string().optional(),
});

export const nurseFormSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  department: z.string().min(1, "Le service est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  status: z.string().default("active"),
  licenseNumber: z.string().min(1, "Le numéro de licence est requis"),
});

export type PatientFormValues = z.infer<typeof patientFormSchema>;
export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;
export type DoctorFormValues = z.infer<typeof doctorFormSchema>;
export type StaffFormValues = z.infer<typeof staffFormSchema>;
export type NurseFormValues = z.infer<typeof nurseFormSchema>;
