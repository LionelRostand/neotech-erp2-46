
import React from 'react';
import { Employee } from '@/types/employee';
import { CalendarDays, Clock, Calendar } from 'lucide-react';

interface CongesTabProps {
  employee: Employee;
}

export const CongesTab: React.FC<CongesTabProps> = ({ employee }) => {
  const absences = employee.absences || [];
  
  // Calcul du solde de congés (simulé pour l'instant)
  const congesSolde = {
    payes: 25,
    rtt: 12,
    maladie: 3,
    pris: absences.length
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-amber-600 bg-amber-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'approved':
        return 'Approuvé';
      case 'pending':
        return 'En attente';
      case 'rejected':
        return 'Refusé';
      default:
        return status;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Cartes de solde de congés */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-blue-700">Congés payés</h4>
            <CalendarDays className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{congesSolde.payes} jours</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-green-700">RTT</h4>
            <Clock className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{congesSolde.rtt} jours</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-purple-700">Maladie</h4>
            <Calendar className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{congesSolde.maladie} jours</p>
        </div>
        
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-amber-700">Pris</h4>
            <Calendar className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{congesSolde.pris} jours</p>
        </div>
      </div>
      
      {/* Historique des absences */}
      <div>
        <h3 className="font-medium mb-3">Historique des congés</h3>
        
        {absences.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Aucun congé enregistré pour cet employé</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Période</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durée</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {absences.map((absence, index) => {
                  const startDate = new Date(absence.startDate);
                  const endDate = new Date(absence.endDate);
                  const durationInDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                  
                  return (
                    <tr key={absence.id || index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{absence.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {startDate.toLocaleDateString('fr-FR')} au {endDate.toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {durationInDays} jour{durationInDays > 1 ? 's' : ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(absence.status)}`}>
                          {getStatusLabel(absence.status)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
