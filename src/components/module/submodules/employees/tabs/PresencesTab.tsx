
import React from 'react';
import { Employee } from '@/types/employee';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

interface PresencesTabProps {
  employee: Employee;
}

const PresencesTab: React.FC<PresencesTabProps> = ({ employee }) => {
  // Mock data for presences (in a real app, fetch this from your database)
  const presenceRecords = employee.presenceRecords || [
    // Sample data
    { date: '2023-04-26', checkIn: '08:30', checkOut: '17:15', status: 'present' },
    { date: '2023-04-25', checkIn: '08:45', checkOut: '17:30', status: 'present' },
    { date: '2023-04-24', checkIn: '08:15', checkOut: '16:45', status: 'present' },
    { date: '2023-04-21', checkIn: '08:30', checkOut: '17:00', status: 'present' },
    { date: '2023-04-20', status: 'absent', reason: 'Maladie' },
  ];

  if (presenceRecords.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-500">
        <p>Aucun enregistrement de présence disponible</p>
      </div>
    );
  }

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Registre des présences</h3>
        <div className="text-sm">
          <span className="font-medium">Taux de présence:</span>{' '}
          <span className="text-green-600">92%</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Arrivée
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Départ
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {presenceRecords.map((record, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    {formatDate(record.date)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.checkIn ? (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-2" />
                      {record.checkIn}
                    </div>
                  ) : (
                    <span>-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.checkOut ? (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-2" />
                      {record.checkOut}
                    </div>
                  ) : (
                    <span>-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {record.status === 'present' ? (
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      <CheckCircle className="w-4 h-4 mr-1" /> Présent
                    </span>
                  ) : (
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      <XCircle className="w-4 h-4 mr-1" /> Absent
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.reason || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PresencesTab;
