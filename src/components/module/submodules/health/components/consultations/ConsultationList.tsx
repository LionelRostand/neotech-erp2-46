
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, FileEdit, Trash } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { fetchCollectionData } from '../../utils/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import type { Consultation, Patient, Doctor } from '../../types/health-types';

const ConsultationsList: React.FC = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [patients, setPatients] = useState<Record<string, Patient>>({});
  const [doctors, setDoctors] = useState<Record<string, Doctor>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch consultations
        const consultationsData = await fetchCollectionData<Consultation>(
          COLLECTIONS.HEALTH.CONSULTATIONS
        );
        
        // Fetch patients and doctors for reference
        const patientsData = await fetchCollectionData<Patient>(
          COLLECTIONS.HEALTH.PATIENTS
        );
        
        const doctorsData = await fetchCollectionData<Doctor>(
          COLLECTIONS.HEALTH.DOCTORS
        );
        
        // Create lookup objects for faster access
        const patientsMap: Record<string, Patient> = {};
        patientsData.forEach(patient => {
          patientsMap[patient.id] = patient;
        });
        
        const doctorsMap: Record<string, Doctor> = {};
        doctorsData.forEach(doctor => {
          doctorsMap[doctor.id] = doctor;
        });
        
        setConsultations(consultationsData);
        setPatients(patientsMap);
        setDoctors(doctorsMap);
      } catch (error) {
        console.error('Error fetching consultations:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const getConsultationStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Terminée</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-500">Planifiée</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Annulée</Badge>;
      case 'in-progress':
        return <Badge className="bg-orange-500">En cours</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  const getPatientName = (patientId: string) => {
    const patient = patients[patientId];
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Patient inconnu';
  };

  const getDoctorName = (doctorId: string) => {
    const doctor = doctors[doctorId];
    return doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Médecin inconnu';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="w-full">
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (consultations.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 mb-2">Aucune consultation trouvée</p>
        <p className="text-gray-400 text-sm">Ajoutez votre première consultation en cliquant sur le bouton "Nouvelle Consultation"</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Patient</TableHead>
          <TableHead>Médecin</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {consultations.map((consultation) => (
          <TableRow key={consultation.id}>
            <TableCell>
              {consultation.date && format(new Date(consultation.date), 'PPP', { locale: fr })}
              <div className="text-sm text-gray-500">{consultation.time}</div>
            </TableCell>
            <TableCell>{getPatientName(consultation.patientId)}</TableCell>
            <TableCell>{getDoctorName(consultation.doctorId)}</TableCell>
            <TableCell>{consultation.consultationType}</TableCell>
            <TableCell>{getConsultationStatusBadge(consultation.status)}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <FileEdit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ConsultationsList;
