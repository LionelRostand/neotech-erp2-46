
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileEdit, Trash2, Calendar } from "lucide-react";
import { StaffMember } from '../../types/health-types';

interface StaffListProps {
  searchQuery?: string;
  onViewStaff: (staff: StaffMember) => void;
  onEditStaff: (staff: StaffMember) => void;
  onDeleteStaff?: (staff: StaffMember) => void;
  onManageSchedule?: (staff: StaffMember) => void;
}

// Sample staff data
const staffMembers: StaffMember[] = [
  {
    id: 'STAFF001',
    firstName: 'Sophie',
    lastName: 'Martin',
    role: 'doctor',
    specialization: 'Cardiologie',
    phone: '06 12 34 56 78',
    email: 'sophie.martin@clinique.fr',
    status: 'active',
    dateHired: '2020-03-15',
    permissions: ['patient_read', 'patient_write', 'prescription_write'],
    department: 'Cardiologie',
    createdAt: '2020-03-15T08:00:00Z',
    updatedAt: '2022-05-10T14:30:00Z'
  },
  {
    id: 'STAFF002',
    firstName: 'Pierre',
    lastName: 'Dupont',
    role: 'nurse',
    specialization: 'Soins généraux',
    phone: '06 23 45 67 89',
    email: 'pierre.dupont@clinique.fr',
    status: 'active',
    dateHired: '2021-06-01',
    permissions: ['patient_read'],
    department: 'Soins généraux',
    createdAt: '2021-06-01T09:00:00Z',
    updatedAt: '2022-01-15T11:20:00Z'
  },
  {
    id: 'STAFF003',
    firstName: 'Marie',
    lastName: 'Dubois',
    role: 'secretary',
    specialization: 'Administration',
    phone: '06 34 56 78 90',
    email: 'marie.dubois@clinique.fr',
    status: 'active',
    dateHired: '2019-09-10',
    permissions: ['appointment_manage', 'patient_read'],
    department: 'Administration',
    createdAt: '2019-09-10T10:00:00Z',
    updatedAt: '2021-11-20T16:45:00Z'
  },
  {
    id: 'STAFF004',
    firstName: 'Jean',
    lastName: 'Lambert',
    role: 'technician',
    specialization: 'Radiologie',
    phone: '06 45 67 89 01',
    email: 'jean.lambert@clinique.fr',
    status: 'on-leave',
    dateHired: '2018-11-05',
    permissions: ['patient_read', 'laboratory_access'],
    department: 'Radiologie',
    createdAt: '2018-11-05T08:30:00Z',
    updatedAt: '2023-02-01T09:15:00Z'
  },
  {
    id: 'STAFF005',
    firstName: 'Claire',
    lastName: 'Moreau',
    role: 'doctor',
    specialization: 'Pédiatrie',
    phone: '06 56 78 90 12',
    email: 'claire.moreau@clinique.fr',
    status: 'active',
    dateHired: '2017-04-20',
    permissions: ['patient_read', 'patient_write', 'prescription_write'],
    department: 'Pédiatrie',
    createdAt: '2017-04-20T08:00:00Z',
    updatedAt: '2022-08-15T10:30:00Z'
  }
];

const StaffList: React.FC<StaffListProps> = ({ 
  searchQuery = '', 
  onViewStaff,
  onEditStaff,
  onDeleteStaff,
  onManageSchedule
}) => {
  // Filter staff based on search query
  const filteredStaff = staffMembers.filter(staff => {
    const fullName = `${staff.firstName} ${staff.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || 
           staff.role.toLowerCase().includes(query) || 
           staff.specialization?.toLowerCase().includes(query) ||
           staff.id.toLowerCase().includes(query);
  });

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'doctor': return 'Médecin';
      case 'nurse': return 'Infirmier';
      case 'secretary': return 'Secrétaire';
      case 'technician': return 'Technicien';
      case 'director': return 'Directeur';
      case 'pharmacist': return 'Pharmacien';
      case 'lab_technician': return 'Technicien labo';
      default: return role;
    }
  };

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
              <TableCell>{getRoleLabel(staff.role)}</TableCell>
              <TableCell>{staff.specialization}</TableCell>
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
                {onManageSchedule && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    title="Planning" 
                    onClick={() => onManageSchedule(staff)}
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  title="Voir"
                  onClick={() => onViewStaff(staff)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  title="Modifier"
                  onClick={() => onEditStaff(staff)}
                >
                  <FileEdit className="h-4 w-4" />
                </Button>
                {onDeleteStaff && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    title="Supprimer"
                    onClick={() => onDeleteStaff(staff)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
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
