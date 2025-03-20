
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileEdit, Trash2, Calendar } from "lucide-react";

interface StaffListProps {
  searchQuery?: string;
}

// Sample staff data
const staffMembers = [
  {
    id: 'STAFF001',
    firstName: 'Sophie',
    lastName: 'Martin',
    role: 'Médecin',
    specialty: 'Cardiologie',
    phone: '06 12 34 56 78',
    email: 'sophie.martin@clinique.fr',
    status: 'active'
  },
  {
    id: 'STAFF002',
    firstName: 'Pierre',
    lastName: 'Dupont',
    role: 'Infirmier',
    specialty: 'Soins généraux',
    phone: '06 23 45 67 89',
    email: 'pierre.dupont@clinique.fr',
    status: 'active'
  },
  {
    id: 'STAFF003',
    firstName: 'Marie',
    lastName: 'Dubois',
    role: 'Secrétaire médicale',
    specialty: 'Administration',
    phone: '06 34 56 78 90',
    email: 'marie.dubois@clinique.fr',
    status: 'active'
  },
  {
    id: 'STAFF004',
    firstName: 'Jean',
    lastName: 'Lambert',
    role: 'Technicien',
    specialty: 'Radiologie',
    phone: '06 45 67 89 01',
    email: 'jean.lambert@clinique.fr',
    status: 'on-leave'
  },
  {
    id: 'STAFF005',
    firstName: 'Claire',
    lastName: 'Moreau',
    role: 'Médecin',
    specialty: 'Pédiatrie',
    phone: '06 56 78 90 12',
    email: 'claire.moreau@clinique.fr',
    status: 'active'
  }
];

const StaffList: React.FC<StaffListProps> = ({ searchQuery = '' }) => {
  // Filter staff based on search query
  const filteredStaff = staffMembers.filter(staff => {
    const fullName = `${staff.firstName} ${staff.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || 
           staff.role.toLowerCase().includes(query) || 
           staff.specialty.toLowerCase().includes(query) ||
           staff.id.toLowerCase().includes(query);
  });

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Spécialité</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStaff.map((staff) => (
            <TableRow key={staff.id}>
              <TableCell className="font-medium">{staff.id}</TableCell>
              <TableCell>{staff.firstName} {staff.lastName}</TableCell>
              <TableCell>{staff.role}</TableCell>
              <TableCell>{staff.specialty}</TableCell>
              <TableCell>
                <div>{staff.phone}</div>
                <div className="text-xs text-muted-foreground">{staff.email}</div>
              </TableCell>
              <TableCell>
                {staff.status === 'active' ? (
                  <Badge className="bg-green-500 hover:bg-green-600">Actif</Badge>
                ) : staff.status === 'on-leave' ? (
                  <Badge variant="outline" className="text-amber-500 border-amber-500">En congé</Badge>
                ) : (
                  <Badge variant="outline">Inactif</Badge>
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

      {filteredStaff.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">Aucun membre du personnel trouvé</p>
        </div>
      )}
    </div>
  );
};

export default StaffList;
