
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, FileEdit, Trash2, Calendar } from 'lucide-react';

interface DoctorsListProps {
  searchQuery?: string;
}

// Données de démonstration
const doctors = [
  {
    id: 'DOC001',
    firstName: 'Philippe',
    lastName: 'Laurent',
    speciality: 'Médecine générale',
    phone: '06 12 34 56 78',
    email: 'philippe.laurent@clinique.fr',
    licenseNumber: 'FR-MED-123456',
    availability: 'full-time',
    status: 'active'
  },
  {
    id: 'DOC002',
    firstName: 'Marie',
    lastName: 'Moreau',
    speciality: 'Cardiologie',
    phone: '06 23 45 67 89',
    email: 'marie.moreau@clinique.fr',
    licenseNumber: 'FR-MED-234567',
    availability: 'part-time',
    status: 'active'
  },
  {
    id: 'DOC003',
    firstName: 'Jean',
    lastName: 'Petit',
    speciality: 'Pédiatrie',
    phone: '06 34 56 78 90',
    email: 'jean.petit@clinique.fr',
    licenseNumber: 'FR-MED-345678',
    availability: 'full-time',
    status: 'active'
  },
  {
    id: 'DOC004',
    firstName: 'Émilie',
    lastName: 'Dubois',
    speciality: 'Dermatologie',
    phone: '06 45 67 89 01',
    email: 'emilie.dubois@clinique.fr',
    licenseNumber: 'FR-MED-456789',
    availability: 'part-time',
    status: 'on-leave'
  }
];

const DoctorsList: React.FC<DoctorsListProps> = ({ searchQuery = '' }) => {
  // Filtre des médecins basé sur la recherche
  const filteredDoctors = doctors.filter(doctor => {
    const fullName = `${doctor.firstName} ${doctor.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || 
           doctor.speciality.toLowerCase().includes(query) || 
           doctor.id.toLowerCase().includes(query);
  });

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Spécialité</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Disponibilité</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDoctors.map((doctor) => (
            <TableRow key={doctor.id}>
              <TableCell className="font-medium">{doctor.id}</TableCell>
              <TableCell>{`Dr. ${doctor.firstName} ${doctor.lastName}`}</TableCell>
              <TableCell>{doctor.speciality}</TableCell>
              <TableCell>
                <div>{doctor.phone}</div>
                <div className="text-xs text-muted-foreground">{doctor.email}</div>
              </TableCell>
              <TableCell>
                {doctor.status === 'active' ? (
                  <Badge className="bg-green-500 hover:bg-green-600">Actif</Badge>
                ) : doctor.status === 'on-leave' ? (
                  <Badge variant="outline" className="text-amber-500 border-amber-500">En congé</Badge>
                ) : (
                  <Badge variant="outline">Inactif</Badge>
                )}
              </TableCell>
              <TableCell>
                {doctor.availability === 'full-time' ? (
                  <span>Temps plein</span>
                ) : (
                  <span>Temps partiel</span>
                )}
              </TableCell>
              <TableCell className="text-right space-x-1">
                <Button variant="ghost" size="icon" title="Planning">
                  <Calendar className="h-4 w-4" />
                </Button>
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

export default DoctorsList;
