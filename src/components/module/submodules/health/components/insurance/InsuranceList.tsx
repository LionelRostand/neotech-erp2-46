
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Eye, Edit, Trash } from "lucide-react";
import { useCollectionData } from '@/hooks/useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { formatDate, formatPhoneNumber } from '@/lib/formatters';
import ViewInsuranceDialog from './ViewInsuranceDialog';
import EditInsuranceDialog from './EditInsuranceDialog';
import DeleteInsuranceDialog from './DeleteInsuranceDialog';

interface Insurance {
  id: string;
  name: string;
  type: string;
  coverage: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  status: 'active' | 'inactive' | 'pending';
  address?: string;
  notes?: string;
  createdAt?: string;
}

interface InsuranceListProps {
  searchTerm?: string;
  typeFilter?: string;
  statusFilter?: string;
}

const InsuranceList: React.FC<InsuranceListProps> = ({
  searchTerm = '',
  typeFilter = 'all',
  statusFilter = 'all'
}) => {
  const [selectedInsurance, setSelectedInsurance] = useState<Insurance | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Fetch insurances from Firestore
  const { data, isLoading, error } = useCollectionData(
    COLLECTIONS.HEALTH.INSURANCE,
    []
  );

  // Mock data for display
  const insurances: Insurance[] = [
    {
      id: '1',
      name: 'Assurance Santé Plus',
      type: 'private',
      coverage: '80% hospitalisation, 100% consultation',
      contactName: 'Jean Martin',
      contactEmail: 'jean.martin@example.com',
      contactPhone: '01 23 45 67 89',
      status: 'active',
      address: '123 Rue de la Santé, Paris',
      notes: 'Partenaire principal depuis 2015',
      createdAt: '2023-01-15T10:30:00'
    },
    {
      id: '2',
      name: 'Mutuelle Nationale',
      type: 'mutual',
      coverage: '70% tous soins',
      contactName: 'Marie Dupont',
      contactEmail: 'marie.dupont@example.com',
      contactPhone: '01 98 76 54 32',
      status: 'active',
      address: '45 Avenue du Bien-être, Lyon',
      notes: 'Convention spéciale pour les employés',
      createdAt: '2023-02-20T14:15:00'
    },
    {
      id: '3',
      name: 'Assurance Médicale Centrale',
      type: 'complementary',
      coverage: '100% dentaire, 60% optique',
      contactName: 'Pierre Durand',
      contactEmail: 'pierre.durand@example.com',
      contactPhone: '01 45 67 89 01',
      status: 'inactive',
      address: '78 Boulevard de la Santé, Marseille',
      notes: 'Contrat en cours de renégociation',
      createdAt: '2023-03-10T09:45:00'
    }
  ];

  // Filter insurances based on searchTerm, typeFilter, and statusFilter
  const filteredInsurances = insurances.filter(insurance => {
    const matchesSearch = searchTerm === '' || 
      insurance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insurance.contactName.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesType = typeFilter === 'all' || insurance.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || insurance.status === statusFilter;
      
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-red-500">Inactive</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">En attente</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'private':
        return 'Privée';
      case 'public':
        return 'Publique';
      case 'mutual':
        return 'Mutuelle';
      case 'complementary':
        return 'Complémentaire';
      default:
        return type;
    }
  };

  const handleView = (insurance: Insurance) => {
    setSelectedInsurance(insurance);
    setIsViewOpen(true);
  };

  const handleEdit = (insurance: Insurance) => {
    setSelectedInsurance(insurance);
    setIsEditOpen(true);
  };

  const handleDelete = (insurance: Insurance) => {
    setSelectedInsurance(insurance);
    setIsDeleteOpen(true);
  };

  const handleSave = (id: string, data: Partial<Insurance>) => {
    // Will be implemented with Firebase later
    console.log('Saving insurance:', id, data);
    setIsEditOpen(false);
  };

  const handleConfirmDelete = (id: string) => {
    // Will be implemented with Firebase later
    console.log('Deleting insurance:', id);
    setIsDeleteOpen(false);
  };

  if (isLoading) {
    return <div className="text-center p-8">Chargement des assurances...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Erreur de chargement : {error.toString()}</div>;
  }

  return (
    <>
      <Card className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Couverture</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInsurances.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Aucune assurance trouvée
                </TableCell>
              </TableRow>
            ) : (
              filteredInsurances.map((insurance) => (
                <TableRow key={insurance.id}>
                  <TableCell className="font-medium">{insurance.name}</TableCell>
                  <TableCell>{getTypeLabel(insurance.type)}</TableCell>
                  <TableCell>
                    <div>{insurance.contactName}</div>
                    <div className="text-sm text-muted-foreground">{insurance.contactEmail}</div>
                  </TableCell>
                  <TableCell>{insurance.coverage}</TableCell>
                  <TableCell>{getStatusBadge(insurance.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="ghost" onClick={() => handleView(insurance)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleEdit(insurance)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(insurance)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {selectedInsurance && (
        <>
          <ViewInsuranceDialog
            isOpen={isViewOpen}
            onClose={() => setIsViewOpen(false)}
            insurance={selectedInsurance}
          />
          
          <EditInsuranceDialog
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            insurance={selectedInsurance}
            onSave={handleSave}
          />
          
          <DeleteInsuranceDialog
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            insurance={selectedInsurance}
            onDelete={handleConfirmDelete}
          />
        </>
      )}
    </>
  );
};

export default InsuranceList;
