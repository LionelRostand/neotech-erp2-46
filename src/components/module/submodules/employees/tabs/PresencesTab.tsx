
import React from 'react';
import { Employee } from '@/types/employee';
import { Clock, Calendar } from 'lucide-react';
import { formatDate } from '../utils/employeeUtils';

interface PresencesTabProps {
  employee: Employee;
}

const PresencesTab: React.FC<PresencesTabProps> = ({ employee }) => {
  // Données factices - à remplacer par des données réelles
  const presences = [
    { id: 1, date: new Date().toISOString(), status: 'present', checkIn: '08:30', checkOut: '17:45' },
    { id: 2, date: new Date(Date.now() - 86400000).toISOString(), status: 'present', checkIn: '08:15', checkOut: '17:30' },
    { id: 3, date: new Date(Date.now() - 86400000 * 2).toISOString(), status: 'absent', reason: 'Maladie' },
    { id: 4, date: new Date(Date.now() - 86400000 * 3).toISOString(), status: 'present', checkIn: '08:22', checkOut: '16:45' },
    { id: 5, date: new Date(Date.now() - 86400000 * 4).toISOString(), status: 'late', checkIn: '09:10', checkOut: '17:30', lateReason: 'Transport' },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Registre des présences</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrivée</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Départ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commentaire</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {presences.map((presence) => (
              <tr key={presence.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {formatDate(presence.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span 
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${presence.status === 'present' ? 'bg-green-100 text-green-800' : 
                        presence.status === 'absent' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}
                  >
                    {presence.status === 'present' ? 'Présent' : 
                      presence.status === 'absent' ? 'Absent' : 'En retard'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {presence.checkIn && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-500 mr-1" />
                      {presence.checkIn}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {presence.checkOut && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-500 mr-1" />
                      {presence.checkOut}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {presence.reason || presence.lateReason || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {presences.length === 0 && (
        <div className="p-8 text-center border border-dashed rounded-md">
          <Calendar className="h-10 w-10 text-gray-400 mx-auto mb-2" />
          <h3 className="text-lg font-medium">Aucune donnée de présence</h3>
          <p className="text-gray-500 mt-1">
            Aucune donnée de présence n'est disponible pour cet employé
          </p>
        </div>
      )}
    </div>
  );
};

export default PresencesTab;
