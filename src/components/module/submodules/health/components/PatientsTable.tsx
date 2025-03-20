
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, FileEdit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PatientsTableProps {
  searchQuery?: string;
}

// Données de démonstration
const patients = [
  { 
    id: 'PAT001', 
    firstName: 'Martin', 
    lastName: 'Dupont', 
    dob: '1975-05-12', 
    gender: 'Homme',
    phone: '06 12 34 56 78',
    email: 'martin.dupont@email.com',
    address: '23 rue des Lilas, 75001 Paris',
    insuranceId: 'MUT123456',
    medicalConditions: ['Hypertension', 'Diabète'],
    lastVisit: '2023-06-10'
  },
  { 
    id: 'PAT002', 
    firstName: 'Sophie', 
    lastName: 'Durand', 
    dob: '1982-09-23', 
    gender: 'Femme',
    phone: '06 98 76 54 32',
    email: 'sophie.durand@email.com',
    address: '45 avenue Victor Hugo, 75016 Paris',
    insuranceId: 'MUT789012',
    medicalConditions: ['Asthme'],
    lastVisit: '2023-07-05'
  },
  { 
    id: 'PAT003', 
    firstName: 'Philippe', 
    lastName: 'Martin', 
    dob: '1968-11-30', 
    gender: 'Homme',
    phone: '06 45 67 89 01',
    email: 'philippe.martin@email.com',
    address: '12 boulevard Saint-Michel, 75005 Paris',
    insuranceId: 'MUT345678',
    medicalConditions: ['Arthrite'],
    lastVisit: '2023-06-28'
  },
  { 
    id: 'PAT004', 
    firstName: 'Claire', 
    lastName: 'Fontaine', 
    dob: '1990-03-15', 
    gender: 'Femme',
    phone: '06 23 45 67 89',
    email: 'claire.fontaine@email.com',
    address: '8 rue de la Paix, 75002 Paris',
    insuranceId: 'MUT901234',
    medicalConditions: [],
    lastVisit: '2023-07-12'
  },
];

const PatientsTable: React.FC<PatientsTableProps> = ({ searchQuery = '' }) => {
  // Filtre des patients basé sur la recherche
  const filteredPatients = patients.filter(patient => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || patient.id.toLowerCase().includes(query);
  });

  return (
    <div>
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
              <TableCell>{new Date(patient.dob).toLocaleDateString('fr-FR')}</TableCell>
              <TableCell>
                <div>{patient.phone}</div>
                <div className="text-xs text-muted-foreground">{patient.email}</div>
              </TableCell>
              <TableCell>
                {patient.medicalConditions.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {patient.medicalConditions.map((condition, index) => (
                      <Badge key={index} variant="outline">{condition}</Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">Aucune</span>
                )}
              </TableCell>
              <TableCell>{new Date(patient.lastVisit).toLocaleDateString('fr-FR')}</TableCell>
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
    </div>
  );
};

export default PatientsTable;
