
import React from 'react';
import { Consultation, Patient, Doctor } from './types/health-types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, Edit, FileText, Printer, Trash2, 
  FileImage, Monitor, Stethoscope, PenLine } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ConsultationDetailsProps {
  consultation: Consultation;
  patient?: Patient;
  doctor?: Doctor;
  onEdit: () => void;
  onBack: () => void;
  onDelete?: () => void;
}

const ConsultationDetails: React.FC<ConsultationDetailsProps> = ({
  consultation,
  patient,
  doctor,
  onEdit,
  onBack,
  onDelete
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-yellow-500">Planifiée</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500">En cours</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Terminée</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Annulée</Badge>;
      default:
        return <Badge>Indéterminé</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h2 className="text-xl font-bold">Détails de la consultation</h2>
          {getStatusBadge(consultation.status)}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
          {consultation.status !== 'completed' && (
            <Button size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          )}
          {onDelete && (
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Informations patient</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Nom: </span>
                <span>{patient ? `${patient.firstName} ${patient.lastName}` : 'Patient inconnu'}</span>
              </div>
              {patient && patient.dateOfBirth && (
                <div>
                  <span className="font-medium">Date de naissance: </span>
                  <span>{format(new Date(patient.dateOfBirth), 'dd/MM/yyyy', { locale: fr })}</span>
                </div>
              )}
              {patient && patient.bloodType && (
                <div>
                  <span className="font-medium">Groupe sanguin: </span>
                  <span>{patient.bloodType}</span>
                </div>
              )}
              {patient && patient.allergens && patient.allergens.length > 0 && (
                <div>
                  <span className="font-medium">Allergies: </span>
                  <span>{patient.allergens.join(', ')}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Détails de la consultation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Date: </span>
                <span>{format(new Date(consultation.date), 'dd/MM/yyyy HH:mm', { locale: fr })}</span>
              </div>
              <div>
                <span className="font-medium">Médecin: </span>
                <span>{doctor ? `${doctor.firstName} ${doctor.lastName}` : 'Médecin inconnu'}</span>
              </div>
              <div>
                <span className="font-medium">Motif: </span>
                <span>{consultation.chiefComplaint}</span>
              </div>
              <div>
                <span className="font-medium">Statut: </span>
                <span>{getStatusBadge(consultation.status)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">
            <PenLine className="mr-2 h-4 w-4" />
            Consultation
          </TabsTrigger>
          <TabsTrigger value="vitals">
            <Monitor className="mr-2 h-4 w-4" />
            Signes vitaux
          </TabsTrigger>
          <TabsTrigger value="notes">
            <Stethoscope className="mr-2 h-4 w-4" />
            Notes cliniques
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileImage className="mr-2 h-4 w-4" />
            Documents
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-medium">Motif principal</h3>
                  <p>{consultation.chiefComplaint}</p>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h3 className="font-medium">Symptômes rapportés</h3>
                  <p className="whitespace-pre-line">{consultation.symptoms}</p>
                </div>
                
                <Separator />
                
                {consultation.medicalHistory && (
                  <>
                    <div className="space-y-3">
                      <h3 className="font-medium">Antécédents médicaux pertinents</h3>
                      <p className="whitespace-pre-line">{consultation.medicalHistory}</p>
                    </div>
                    <Separator />
                  </>
                )}
                
                {consultation.diagnosis && (
                  <>
                    <div className="space-y-3">
                      <h3 className="font-medium">Diagnostic</h3>
                      <p className="whitespace-pre-line">{consultation.diagnosis}</p>
                    </div>
                    <Separator />
                  </>
                )}
                
                {consultation.treatment && (
                  <>
                    <div className="space-y-3">
                      <h3 className="font-medium">Traitement</h3>
                      <p className="whitespace-pre-line">{consultation.treatment}</p>
                    </div>
                    <Separator />
                  </>
                )}
                
                {consultation.followUp && (
                  <>
                    <div className="space-y-3">
                      <h3 className="font-medium">Suivi prévu</h3>
                      <p>{format(new Date(consultation.followUp), 'dd/MM/yyyy', { locale: fr })}</p>
                    </div>
                    <Separator />
                  </>
                )}
                
                {consultation.notes && (
                  <div className="space-y-3">
                    <h3 className="font-medium">Notes supplémentaires</h3>
                    <p className="whitespace-pre-line">{consultation.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="vitals">
          <Card>
            <CardContent className="pt-6">
              {consultation.vitalSigns ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {consultation.vitalSigns.temperature && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Température</h3>
                      <p className="text-2xl">{consultation.vitalSigns.temperature} °C</p>
                    </div>
                  )}
                  
                  {consultation.vitalSigns.heartRate && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Fréquence cardiaque</h3>
                      <p className="text-2xl">{consultation.vitalSigns.heartRate} bpm</p>
                    </div>
                  )}
                  
                  {consultation.vitalSigns.bloodPressure && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Tension artérielle</h3>
                      <p className="text-2xl">{consultation.vitalSigns.bloodPressure.systolic}/{consultation.vitalSigns.bloodPressure.diastolic} mmHg</p>
                    </div>
                  )}
                  
                  {consultation.vitalSigns.respiratoryRate && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Fréquence respiratoire</h3>
                      <p className="text-2xl">{consultation.vitalSigns.respiratoryRate} resp/min</p>
                    </div>
                  )}
                  
                  {consultation.vitalSigns.oxygenSaturation && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Saturation en oxygène</h3>
                      <p className="text-2xl">{consultation.vitalSigns.oxygenSaturation} %</p>
                    </div>
                  )}
                  
                  {consultation.vitalSigns.height && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Taille</h3>
                      <p className="text-2xl">{consultation.vitalSigns.height} cm</p>
                    </div>
                  )}
                  
                  {consultation.vitalSigns.weight && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Poids</h3>
                      <p className="text-2xl">{consultation.vitalSigns.weight} kg</p>
                    </div>
                  )}
                  
                  {consultation.vitalSigns.bmi && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">IMC</h3>
                      <p className="text-2xl">{consultation.vitalSigns.bmi}</p>
                    </div>
                  )}
                  
                  {consultation.vitalSigns.pain !== undefined && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Douleur (0-10)</h3>
                      <p className="text-2xl">{consultation.vitalSigns.pain}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 italic">Aucun signe vital enregistré pour cette consultation</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {consultation.physicalExam ? (
                  <div className="space-y-3">
                    <h3 className="font-medium">Examen physique</h3>
                    <p className="whitespace-pre-line">{consultation.physicalExam}</p>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Aucun examen physique enregistré</p>
                )}
                
                {consultation.physicalExam && <Separator />}
                
                {consultation.assessment ? (
                  <div className="space-y-3">
                    <h3 className="font-medium">Évaluation</h3>
                    <p className="whitespace-pre-line">{consultation.assessment}</p>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Aucune évaluation enregistrée</p>
                )}
                
                {consultation.assessment && consultation.plan && <Separator />}
                
                {consultation.plan ? (
                  <div className="space-y-3">
                    <h3 className="font-medium">Plan</h3>
                    <p className="whitespace-pre-line">{consultation.plan}</p>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Aucun plan enregistré</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents">
          <Card>
            <CardContent className="pt-6">
              {consultation.medicalImages && consultation.medicalImages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {consultation.medicalImages.map((image) => (
                    <div key={image.id} className="border rounded-lg overflow-hidden">
                      <div className="aspect-video bg-gray-100 flex items-center justify-center">
                        <FileText className="h-12 w-12 text-gray-400" />
                      </div>
                      <div className="p-3">
                        <h4 className="font-medium">{image.type.toUpperCase()} - {image.bodyPart}</h4>
                        <p className="text-sm text-gray-500">{format(new Date(image.date), 'dd/MM/yyyy', { locale: fr })}</p>
                        {image.description && <p className="text-sm mt-1">{image.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <FileImage className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucun document</h3>
                  <p className="mt-1 text-sm text-gray-500">Aucun document n'a été associé à cette consultation</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConsultationDetails;
