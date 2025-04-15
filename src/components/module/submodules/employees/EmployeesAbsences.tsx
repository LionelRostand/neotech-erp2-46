
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Check, X, Filter, Plus, Eye, UserCheck } from 'lucide-react';
import { useAbsencesData } from '@/hooks/useAbsencesData';
import { useAbsenceStatus } from '@/hooks/useAbsenceStatus';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
// Changed the import path to match the correct location
import AbsenceDetailsDialog from '../absences/AbsenceDetailsDialog';

const EmployeesAbsences = () => {
  const { absences, stats, isLoading } = useAbsencesData();
  const { updateAbsenceStatus, isUpdating } = useAbsenceStatus();
  const [selectedAbsence, setSelectedAbsence] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleValidate = async (absenceId: string) => {
    if (await updateAbsenceStatus(absenceId, 'Validé')) {
      // La mise à jour du status est gérée par Firebase, le composant se mettra à jour automatiquement
    }
  };

  const handleReject = async (absenceId: string) => {
    if (await updateAbsenceStatus(absenceId, 'Refusé')) {
      // La mise à jour du status est gérée par Firebase, le composant se mettra à jour automatiquement
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Validé':
        return <Badge className="bg-green-100 text-green-800">Validé</Badge>;
      case 'Refusé':
        return <Badge className="bg-red-100 text-red-800">Refusé</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Absences</h1>
          <p className="text-gray-500">Gérez les absences des employés</p>
        </div>
        <div className="space-x-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtres
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle absence
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">En attente</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <UserCheck className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Validées</p>
                <p className="text-2xl font-bold">{stats.validated}</p>
              </div>
              <Check className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Refusées</p>
                <p className="text-2xl font-bold">{stats.rejected}</p>
              </div>
              <X className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employé</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Période</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {absences.map((absence) => (
                <TableRow key={absence.id}>
                  <TableCell>{absence.employeeName}</TableCell>
                  <TableCell>{absence.type}</TableCell>
                  <TableCell>
                    Du {absence.startDate} au {absence.endDate}
                  </TableCell>
                  <TableCell>{absence.days} jour(s)</TableCell>
                  <TableCell>{getStatusBadge(absence.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedAbsence(absence)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Détails
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <AbsenceDetailsDialog 
                            absence={selectedAbsence}
                            open={detailsOpen}
                            onOpenChange={setDetailsOpen}
                          />
                        </DialogContent>
                      </Dialog>

                      {absence.status === 'En attente' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleValidate(absence.id)}
                            disabled={isUpdating}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Valider
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReject(absence.id)}
                            disabled={isUpdating}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Refuser
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeesAbsences;
