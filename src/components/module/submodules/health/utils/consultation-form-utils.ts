
import { Consultation, VitalSigns } from "../types/health-types";
import { ConsultationFormValues } from "../context/ConsultationFormContext";

export const processConsultationFormData = (
  values: ConsultationFormValues, 
  isEditing: boolean, 
  existingConsultation?: Consultation
): Partial<Consultation> => {
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
    status: isEditing ? existingConsultation?.status : 'in-progress',
    date: isEditing ? existingConsultation?.date : new Date(),
  };

  return consultationData;
};
