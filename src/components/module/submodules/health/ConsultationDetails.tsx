
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { X, User, Calendar, Clock, Tag, FileText, Stethoscope, Activity, ClipboardList } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Consultation, Patient, Doctor } from './types/health-types';

interface ConsultationDetailsProps {
  open: boolean;
  onClose: () => void;
  consultation: Consultation;
  patient: Patient | undefined;
  doctor: Doctor | undefined;
}

const ConsultationDetails: React.FC<ConsultationDetailsProps> = ({
  open,
  onClose,
  consultation,
  patient,
  doctor
}) => {
  if (!consultation) return null;

  // Format consultation date
  const formattedDate = consultation.date
    ? format(new Date(consultation.date), 'dd MMMM yyyy', { locale: fr })
    : '';

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-500">Programmée</Badge>;
      case 'in-progress':
        return <Badge className="bg-yellow-500">En cours</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Terminée</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Annulée</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Détails de la consultation</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Fermer</span>
          </DialogClose>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Patient & Doctor Info */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-md font-medium flex items-center gap-2 mb-3">
                <User className="h-5 w-5 text-primary" />
                Information patient
              </h3>
              <div className="space-y-2">
                <p className="font-semibold text-lg">
                  {patient ? `${patient.firstName} ${patient.lastName}` : 'Patient inconnu'}
                </p>
                <p className="text-sm text-gray-500">
                  {patient?.email || 'Aucun email'}
                </p>
                <p className="text-sm text-gray-500">
                  {patient?.phone || 'Aucun téléphone'}
                </p>
                <p className="text-sm text-gray-500">
                  {patient?.birthDate 
                    ? `Né(e) le ${format(new Date(patient.birthDate), 'dd/MM/yyyy', { locale: fr })}`
                    : 'Date de naissance non spécifiée'}
                </p>
                {patient?.bloodType && (
                  <p className="text-sm">
                    <span className="font-medium">Groupe sanguin:</span> {patient.bloodType}
                  </p>
                )}
                {patient?.allergies && patient.allergies.length > 0 && (
                  <div>
                    <span className="text-sm font-medium">Allergies:</span>
                    <ul className="list-disc list-inside text-sm text-gray-600 ml-2">
                      {patient.allergies.map((allergy, idx) => (
                        <li key={idx}>{allergy}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-md font-medium flex items-center gap-2 mb-3">
                <Stethoscope className="h-5 w-5 text-primary" />
                Médecin
              </h3>
              <div className="space-y-2">
                <p className="font-semibold text-lg">
                  {doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Médecin inconnu'}
                </p>
                {doctor?.specialty && (
                  <p className="text-sm text-gray-600">
                    Spécialité: {doctor.specialty}
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  {doctor?.email || 'Aucun email'}
                </p>
                <p className="text-sm text-gray-500">
                  {doctor?.phone || 'Aucun téléphone'}
                </p>
              </div>
            </div>
          </div>

          {/* Middle & Right columns - Consultation details */}
          <div className="col-span-2 space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="text-md font-medium flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Date
                  </h3>
                  <p>{formattedDate}</p>
                </div>
                <div>
                  <h3 className="text-md font-medium flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Heure
                  </h3>
                  <p>{consultation.time}</p>
                </div>
                <div>
                  <h3 className="text-md font-medium flex items-center gap-2">
                    <Tag className="h-5 w-5 text-primary" />
                    Type
                  </h3>
                  <p className="capitalize">{consultation.consultationType}</p>
                </div>
                <div>
                  <h3 className="text-md font-medium flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Statut
                  </h3>
                  <div className="mt-1">{getStatusBadge(consultation.status)}</div>
                </div>
              </div>
            </div>

            {consultation.chiefComplaint && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-md font-medium flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Motif principal
                </h3>
                <p className="text-sm">{consultation.chiefComplaint}</p>
              </div>
            )}

            {consultation.symptoms && consultation.symptoms.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-md font-medium flex items-center gap-2 mb-2">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  Symptômes
                </h3>
                <ul className="list-disc list-inside text-sm">
                  {consultation.symptoms.map((symptom, index) => (
                    <li key={index} className="text-gray-700">{symptom}</li>
                  ))}
                </ul>
              </div>
            )}

            {consultation.notes && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-md font-medium flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Notes
                </h3>
                <p className="text-sm">{consultation.notes}</p>
              </div>
            )}

            {consultation.diagnosis && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-md font-medium flex items-center gap-2 mb-2">
                  <Stethoscope className="h-5 w-5 text-green-700" />
                  Diagnostic
                </h3>
                <p className="text-sm">{consultation.diagnosis}</p>
              </div>
            )}

            {consultation.treatment && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-md font-medium flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-blue-700" />
                  Traitement
                </h3>
                <p className="text-sm">{consultation.treatment}</p>
              </div>
            )}

            {consultation.followUp && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-md font-medium flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Suivi recommandé
                </h3>
                <p className="text-sm">{consultation.followUp}</p>
              </div>
            )}
          </div>
        </div>

        <Separator className="my-4" />
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Fermer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationDetails;
