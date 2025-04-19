
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, FileEdit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useCollectionData } from '@/hooks/useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Patient } from '../types/health-types';
import { orderBy } from 'firebase/firestore';

interface PatientsTableProps {
  searchQuery?: string;
}

const PatientsTable: React.FC<PatientsTableProps> = ({ searchQuery = '' }) => {
  const { data: patients, isLoading } = useCollectionData<Patient>(
    COLLECTIONS.HEALTH.PATIENTS,
    [orderBy('lastName')]
  );

  // Filter patients based on search query
  const filteredPatients = patients?.filter(patient => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || 
           patient.id?.toLowerCase().includes(searchQuery.toLowerCase());
  }) || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (filteredPatients.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 mb-2">Aucun patient trouvé</p>
        <p className="text-gray-400 text-sm">Ajoutez votre premier patient en cliquant sur le bouton "Nouveau Patient"</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Nom</TableHead>
          <TableHead>Date de naissance</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Pathologies</TableHead>
          <TableHead>Dernière visite</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredPatients.map((patient) => (
          <TableRow key={patient.id}>
            <TableCell className="font-medium">{patient.id}</TableCell>
            <TableCell>{`${patient.firstName} ${patient.lastName}`}</TableCell>
            <TableCell>{patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('fr-FR') : '-'}</TableCell>
            <TableCell>
              <div>{patient.phone || '-'}</div>
              <div className="text-xs text-muted-foreground">{patient.email || '-'}</div>
            </TableCell>
            <TableCell>
              {patient.medicalConditions?.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {patient.medicalConditions.map((condition, index) => (
                    <Badge key={index} variant="outline">{condition}</Badge>
                  ))}
                </div>
              ) : (
                <span className="text-muted-foreground text-sm">Aucune</span>
              )}
            </TableCell>
            <TableCell>{patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString('fr-FR') : '-'}</TableCell>
            <TableCell className="text-right space-x-1">
              <Button variant="ghost" size="icon" title="Voir">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" title="Modifier">
                <FileEdit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" title="Supprimer">
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PatientsTable;
