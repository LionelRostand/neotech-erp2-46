
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileEdit, Eye, Trash2 } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Input } from "@/components/ui/input";
import { useCollectionData } from '@/hooks/useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { orderBy } from 'firebase/firestore';
import { Consultation, Patient, Doctor } from '../../types/health-types';

const ConsultationList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch consultations data
  const { 
    data: consultations,
    isLoading: isConsultationsLoading
  } = useCollectionData<Consultation>(
    COLLECTIONS.HEALTH.CONSULTATIONS,
    [orderBy('date', 'desc')]
  );
  
  // Fetch patients data to display patient names
  const { 
    data: patients,
    isLoading: isPatientsLoading
  } = useCollectionData<Patient>(
    COLLECTIONS.HEALTH.PATIENTS,
    []
  );
  
  // Fetch doctors data to display doctor names
  const { 
    data: doctors,
    isLoading: isDoctorsLoading
  } = useCollectionData<Doctor>(
    COLLECTIONS.HEALTH.DOCTORS,
    []
  );
  
  const isLoading = isConsultationsLoading || isPatientsLoading || isDoctorsLoading;
  
  // Find patient and doctor names based on IDs
  const getPatientName = (patientId: string) => {
    const patient = patients?.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Patient inconnu';
  };
  
  const getDoctorName = (doctorId: string) => {
    const doctor = doctors?.find(d => d.id === doctorId);
    return doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Médecin inconnu';
  };
  
  // Filter consultations based on search term
  const filteredConsultations = consultations?.filter(consultation => {
    if (!searchTerm) return true;
    
    const patientName = getPatientName(consultation.patientId).toLowerCase();
    const doctorName = getDoctorName(consultation.doctorId).toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return (
      patientName.includes(searchLower) ||
      doctorName.includes(searchLower) ||
      consultation.consultationType?.toLowerCase().includes(searchLower) ||
      consultation.status?.toLowerCase().includes(searchLower)
    );
  });
  
  // Status badge colors
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
  
  // Type badge colors
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'urgent':
        return <Badge variant="outline" className="border-red-500 text-red-500">Urgence</Badge>;
      case 'followup':
        return <Badge variant="outline" className="border-green-500 text-green-500">Suivi</Badge>;
      case 'specialist':
        return <Badge variant="outline" className="border-purple-500 text-purple-500">Spécialiste</Badge>;
      case 'standard':
      default:
        return <Badge variant="outline">Standard</Badge>;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Calendar className="h-4 w-4 text-gray-500" />
          </div>
          <Input
            type="text"
            placeholder="Rechercher une consultation..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-16" />
          ))}
        </div>
      ) : filteredConsultations?.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="mt-2 text-lg font-medium text-gray-900">Aucune consultation trouvée</h3>
          <p className="mt-1 text-sm text-gray-500">Commencez par créer une nouvelle consultation.</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Patient</TableHead>
                <TableHead className="w-[180px]">Médecin</TableHead>
                <TableHead className="w-[120px]">Date</TableHead>
                <TableHead className="w-[100px]">Heure</TableHead>
                <TableHead className="w-[120px]">Type</TableHead>
                <TableHead className="w-[120px]">Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredConsultations?.map((consultation) => (
                <TableRow key={consultation.id}>
                  <TableCell className="font-medium">{getPatientName(consultation.patientId)}</TableCell>
                  <TableCell>{getDoctorName(consultation.doctorId)}</TableCell>
                  <TableCell>
                    {consultation.date ? format(new Date(consultation.date), 'dd/MM/yyyy', { locale: fr }) : ''}
                  </TableCell>
                  <TableCell>{consultation.time}</TableCell>
                  <TableCell>{getTypeBadge(consultation.consultationType)}</TableCell>
                  <TableCell>{getStatusBadge(consultation.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <FileEdit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ConsultationList;
