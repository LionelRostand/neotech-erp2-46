
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Check, 
  X, 
  Clock, 
  Calendar,
  FileText,
  User
} from 'lucide-react';
import { format, compareDesc } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Leave {
  id: string;
  staffId: string;
  staffName: string;
  role: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

const StaffLeaves: React.FC = () => {
  // Sample leaves data
  const [leaves, setLeaves] = useState<Leave[]>([
    {
      id: 'LEAVE001',
      staffId: 'STAFF002',
      staffName: 'Pierre Dupont',
      role: 'Infirmier',
      startDate: new Date(2025, 3, 10),
      endDate: new Date(2025, 3, 15),
      reason: 'Congés annuels',
      status: 'approved',
      createdAt: new Date(2025, 3, 1)
    },
    {
      id: 'LEAVE002',
      staffId: 'STAFF004',
      staffName: 'Jean Lambert',
      role: 'Technicien',
      startDate: new Date(2025, 3, 5),
      endDate: new Date(2025, 3, 6),
      reason: 'Arrêt maladie',
      status: 'approved',
      createdAt: new Date(2025, 3, 4)
    },
    {
      id: 'LEAVE003',
      staffId: 'STAFF003',
      staffName: 'Marie Dubois',
      role: 'Secrétaire médicale',
      startDate: new Date(2025, 3, 20),
      endDate: new Date(2025, 3, 24),
      reason: 'Congés annuels',
      status: 'pending',
      createdAt: new Date(2025, 3, 8)
    },
    {
      id: 'LEAVE004',
      staffId: 'STAFF005',
      staffName: 'Dr. Claire Moreau',
      role: 'Médecin',
      startDate: new Date(2025, 4, 2),
      endDate: new Date(2025, 4, 6),
      reason: 'Formation médicale',
      status: 'pending',
      createdAt: new Date(2025, 3, 15)
    }
  ]);
  
  const sortedLeaves = [...leaves].sort((a, b) => 
    compareDesc(new Date(a.createdAt), new Date(b.createdAt))
  );

  const handleApprove = (leaveId: string) => {
    setLeaves(prev => 
      prev.map(leave => 
        leave.id === leaveId 
          ? { ...leave, status: 'approved' } 
          : leave
      )
    );
  };

  const handleReject = (leaveId: string) => {
    setLeaves(prev => 
      prev.map(leave => 
        leave.id === leaveId 
          ? { ...leave, status: 'rejected' } 
          : leave
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-blue-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Demandes en attente</h3>
              <p className="text-2xl font-bold">
                {leaves.filter(leave => leave.status === 'pending').length}
              </p>
            </div>
            <Clock className="h-10 w-10 text-blue-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Demandes approuvées</h3>
              <p className="text-2xl font-bold">
                {leaves.filter(leave => leave.status === 'approved').length}
              </p>
            </div>
            <Check className="h-10 w-10 text-green-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-red-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Demandes rejetées</h3>
              <p className="text-2xl font-bold">
                {leaves.filter(leave => leave.status === 'rejected').length}
              </p>
            </div>
            <X className="h-10 w-10 text-red-500" />
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Membre</TableHead>
              <TableHead>Période</TableHead>
              <TableHead>Motif</TableHead>
              <TableHead>Date de demande</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedLeaves.map(leave => (
              <TableRow key={leave.id}>
                <TableCell className="font-medium">{leave.id}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <div>{leave.staffName}</div>
                      <div className="text-xs text-gray-500">{leave.role}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <div>
                        {format(new Date(leave.startDate), 'dd/MM/yyyy')} - {format(new Date(leave.endDate), 'dd/MM/yyyy')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.ceil((new Date(leave.endDate).getTime() - new Date(leave.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} jour(s)
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span>{leave.reason}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {format(new Date(leave.createdAt), 'dd/MM/yyyy', { locale: fr })}
                </TableCell>
                <TableCell>
                  {leave.status === 'pending' && (
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">En attente</Badge>
                  )}
                  {leave.status === 'approved' && (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approuvée</Badge>
                  )}
                  {leave.status === 'rejected' && (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejetée</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {leave.status === 'pending' && (
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-green-600 border-green-600 hover:bg-green-50"
                        onClick={() => handleApprove(leave.id)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approuver
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => handleReject(leave.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Rejeter
                      </Button>
                    </div>
                  )}
                  {(leave.status === 'approved' || leave.status === 'rejected') && (
                    <Button variant="outline" size="sm">
                      Détails
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end mt-4">
        <Button>
          Nouvelle demande d'absence
        </Button>
      </div>
    </div>
  );
};

export default StaffLeaves;
