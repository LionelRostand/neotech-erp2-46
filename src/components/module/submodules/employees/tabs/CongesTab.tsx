
import React from 'react';
import { Employee } from '@/types/employee';
import { Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate } from '../utils/employeeUtils';

interface CongesTabProps {
  employee: Employee;
}

const CongesTab: React.FC<CongesTabProps> = ({ employee }) => {
  // Données factices pour les compteurs de congés
  const congesData = {
    congésPayes: {
      acquis: 25,
      pris: 10,
      restant: 15
    },
    rtt: {
      acquis: 12,
      pris: 4,
      restant: 8
    }
  };
  
  // Données factices pour l'historique des absences
  const absencesHistory = employee.absences || [
    {
      id: "1",
      type: "Congés payés",
      startDate: new Date(Date.now() - 86400000 * 30).toISOString(),
      endDate: new Date(Date.now() - 86400000 * 25).toISOString(),
      status: "approved",
      submittedAt: new Date(Date.now() - 86400000 * 40).toISOString(),
      approvedBy: "Jean Dupont",
      approvedAt: new Date(Date.now() - 86400000 * 38).toISOString(),
    },
    {
      id: "2",
      type: "RTT",
      startDate: new Date(Date.now() - 86400000 * 10).toISOString(),
      endDate: new Date(Date.now() - 86400000 * 10).toISOString(),
      status: "approved",
      submittedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
      approvedBy: "Jean Dupont",
      approvedAt: new Date(Date.now() - 86400000 * 13).toISOString(),
    },
    {
      id: "3",
      type: "Maladie",
      startDate: new Date(Date.now() + 86400000 * 5).toISOString(),
      endDate: new Date(Date.now() + 86400000 * 7).toISOString(),
      status: "pending",
      reason: "Rendez-vous médical",
      submittedAt: new Date().toISOString(),
    }
  ];
  
  // Fonction pour calculer le nombre de jours entre deux dates
  const calculateDays = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 pour inclure le jour de fin
  };
  
  // Fonction pour afficher le statut d'une absence
  const renderStatus = (status: string): JSX.Element => {
    switch(status) {
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Approuvé
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            En attente
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Refusé
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Congés et absences</h3>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Demander un congé
        </Button>
      </div>
      
      {/* Compteurs de congés */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h4 className="font-medium text-blue-800 flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Congés payés
          </h4>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className="text-xs text-blue-600">Acquis</p>
              <p className="font-bold text-lg">{congesData.congésPayes.acquis}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-blue-600">Pris</p>
              <p className="font-bold text-lg">{congesData.congésPayes.pris}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-blue-600">Restant</p>
              <p className="font-bold text-lg">{congesData.congésPayes.restant}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <h4 className="font-medium text-purple-800 flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            RTT
          </h4>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className="text-xs text-purple-600">Acquis</p>
              <p className="font-bold text-lg">{congesData.rtt.acquis}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-purple-600">Pris</p>
              <p className="font-bold text-lg">{congesData.rtt.pris}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-purple-600">Restant</p>
              <p className="font-bold text-lg">{congesData.rtt.restant}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Historique des absences */}
      <div>
        <h4 className="font-medium mb-3">Historique des absences</h4>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Période</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Demandé le</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {absencesHistory.map((absence) => (
                <tr key={absence.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {absence.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatDate(absence.startDate)} - {formatDate(absence.endDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {calculateDays(absence.startDate, absence.endDate)} jour(s)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {renderStatus(absence.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(absence.submittedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {absencesHistory.length === 0 && (
          <div className="p-8 text-center border border-dashed rounded-md">
            <Calendar className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <h3 className="text-lg font-medium">Aucune absence</h3>
            <p className="text-gray-500 mt-1">
              Aucune absence n'a été enregistrée pour cet employé
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CongesTab;
