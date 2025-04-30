
import React from 'react';
import { Employee } from '@/types/employee';

interface CongesTabProps {
  employee: Employee;
}

export const CongesTab: React.FC<CongesTabProps> = ({ employee }) => {
  // Données fictives pour l'exemple
  const conges = {
    annuel: { total: 25, pris: 12, restant: 13 },
    rtt: { total: 11, pris: 5, restant: 6 },
    maladie: { total: 'Illimité', pris: 3, restant: '-' }
  };

  // Absences fictives
  const absences = employee.absences || [
    {
      id: '1',
      type: 'Congés payés',
      startDate: '2023-07-10',
      endDate: '2023-07-14',
      status: 'approved',
      submittedAt: '2023-06-15'
    },
    {
      id: '2',
      type: 'RTT',
      startDate: '2023-09-22',
      endDate: '2023-09-22',
      status: 'approved',
      submittedAt: '2023-08-30'
    },
    {
      id: '3',
      type: 'Maladie',
      startDate: '2023-11-02',
      endDate: '2023-11-03',
      status: 'approved',
      submittedAt: '2023-11-02'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Solde de congés</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-600 mb-1">Congés annuels</p>
            <div className="flex items-end">
              <p className="text-2xl font-bold">{conges.annuel.restant}</p>
              <p className="text-sm text-gray-500 ml-2">/ {conges.annuel.total} jours</p>
            </div>
            <p className="text-xs text-gray-500 mt-1">{conges.annuel.pris} jours pris</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
            <p className="text-sm text-purple-600 mb-1">RTT</p>
            <div className="flex items-end">
              <p className="text-2xl font-bold">{conges.rtt.restant}</p>
              <p className="text-sm text-gray-500 ml-2">/ {conges.rtt.total} jours</p>
            </div>
            <p className="text-xs text-gray-500 mt-1">{conges.rtt.pris} jours pris</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
            <p className="text-sm text-amber-600 mb-1">Maladie</p>
            <div className="flex items-end">
              <p className="text-2xl font-bold">-</p>
              <p className="text-sm text-gray-500 ml-2">/ {conges.maladie.total}</p>
            </div>
            <p className="text-xs text-gray-500 mt-1">{conges.maladie.pris} jours pris</p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-3">Historique des absences</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Du</th>
                <th className="px-4 py-2 text-left">Au</th>
                <th className="px-4 py-2 text-left">Durée</th>
                <th className="px-4 py-2 text-left">Statut</th>
              </tr>
            </thead>
            <tbody>
              {absences.map((absence, index) => {
                const start = new Date(absence.startDate);
                const end = new Date(absence.endDate);
                
                // Calculer la durée en jours
                const diffTime = Math.abs(end.getTime() - start.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                
                return (
                  <tr key={absence.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2 border-t">{absence.type}</td>
                    <td className="px-4 py-2 border-t">
                      {start.toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-2 border-t">
                      {end.toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-2 border-t">{diffDays} jour(s)</td>
                    <td className="px-4 py-2 border-t">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        absence.status === 'approved' 
                          ? 'bg-green-100 text-green-800'
                          : absence.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {absence.status === 'approved' ? 'Approuvé' : 
                         absence.status === 'pending' ? 'En attente' : 'Refusé'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
