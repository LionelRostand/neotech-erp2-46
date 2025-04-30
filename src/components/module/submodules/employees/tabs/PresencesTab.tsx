
import React from 'react';
import { Employee } from '@/types/employee';

interface PresencesTabProps {
  employee: Employee;
}

export const PresencesTab: React.FC<PresencesTabProps> = ({ employee }) => {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">Registre des présences</h4>
        <p className="text-gray-500">Les données de présence ne sont pas encore disponibles pour cet employé.</p>
      </div>
      
      {/* Données exemple */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Arrivée</th>
              <th className="px-4 py-2 text-left">Départ</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-left">Statut</th>
            </tr>
          </thead>
          <tbody>
            {[
              { date: '2023-01-10', arrival: '08:30', departure: '17:30', total: '9h', status: 'Présent' },
              { date: '2023-01-11', arrival: '08:45', departure: '17:45', total: '9h', status: 'Présent' },
              { date: '2023-01-12', arrival: '08:15', departure: '17:15', total: '9h', status: 'Présent' },
              { date: '2023-01-13', arrival: '', departure: '', total: '0h', status: 'Absent' },
            ].map((day, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-2 border-t">
                  {new Date(day.date).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-4 py-2 border-t">{day.arrival || '-'}</td>
                <td className="px-4 py-2 border-t">{day.departure || '-'}</td>
                <td className="px-4 py-2 border-t">{day.total}</td>
                <td className="px-4 py-2 border-t">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    day.status === 'Présent' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {day.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
