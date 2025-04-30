
import React from 'react';
import { Employee } from '@/types/employee';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarClock, CalendarDays } from 'lucide-react';

interface CongesTabProps {
  employee: Employee;
}

const CongesTab: React.FC<CongesTabProps> = ({ employee }) => {
  // Données de congés simulées (à remplacer par des données réelles)
  const congesData = {
    soldes: [
      { type: "Congés payés", total: 25, pris: 12, restants: 13 },
      { type: "RTT", total: 10, pris: 4, restants: 6 },
      { type: "Congés exceptionnels", total: 3, pris: 0, restants: 3 }
    ],
    historique: employee.absences || []
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Soldes de congés</h3>
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type de congés</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Pris</TableHead>
                <TableHead className="text-right">Restants</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {congesData.soldes.map((conge, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{conge.type}</TableCell>
                  <TableCell className="text-right">{conge.total}</TableCell>
                  <TableCell className="text-right">{conge.pris}</TableCell>
                  <TableCell className="text-right font-semibold">{conge.restants}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Historique des absences</h3>
        {congesData.historique && congesData.historique.length > 0 ? (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Du</TableHead>
                  <TableHead>Au</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {congesData.historique.map((absence, index) => (
                  <TableRow key={index}>
                    <TableCell>{absence.type}</TableCell>
                    <TableCell>{new Date(absence.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(absence.endDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        absence.status === 'approved' ? 'bg-green-100 text-green-800' :
                        absence.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {absence.status === 'approved' ? 'Approuvé' :
                         absence.status === 'pending' ? 'En attente' : 'Refusé'}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="border rounded-md p-8 text-center text-gray-500">
            <CalendarDays className="mx-auto h-10 w-10 text-gray-400 mb-3" />
            <p>Aucune absence enregistrée pour cet employé</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CongesTab;
