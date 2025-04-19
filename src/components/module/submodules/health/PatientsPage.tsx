
import React, { useState } from 'react';
import { User, Plus, FileSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useHealthData } from '@/hooks/modules/useHealthData';
import type { Patient } from './types/health-types';

const PatientsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { patients, isLoading } = useHealthData();

  const filteredPatients = patients?.filter(patient => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  }) || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <User className="h-6 w-6 text-primary" />
          Patients
        </h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Patient
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <FileSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Rechercher un patient..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="w-full">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-2">Aucun patient trouvé</p>
            <p className="text-gray-400 text-sm">Ajoutez votre premier patient en cliquant sur le bouton "Nouveau Patient"</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Date de naissance</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div className="font-medium">{patient.firstName} {patient.lastName}</div>
                  </TableCell>
                  <TableCell>{patient.email || '-'}</TableCell>
                  <TableCell>{patient.phone || '-'}</TableCell>
                  <TableCell>{patient.birthDate || '-'}</TableCell>
                  <TableCell>
                    <Badge className={patient.status === 'active' ? 'bg-green-500' : 'bg-red-500'}>
                      {patient.status === 'active' ? 'Actif' : 'Inactif'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      Voir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default PatientsPage;
