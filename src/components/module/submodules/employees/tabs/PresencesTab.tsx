
import React from 'react';
import { Employee } from '@/types/employee';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

interface PresencesTabProps {
  employee: Employee;
}

export const PresencesTab: React.FC<PresencesTabProps> = ({ employee }) => {
  // Cette partie serait idéalement récupérée depuis une API ou Firestore
  // Pour l'instant, on affiche un message indiquant que la fonctionnalité sera disponible
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Registre des présences</h3>
        <div className="flex space-x-2">
          <button className="text-sm px-3 py-1 bg-blue-50 text-blue-600 rounded-md">
            Ce mois
          </button>
          <button className="text-sm px-3 py-1 bg-gray-100 text-gray-600 rounded-md">
            Mois précédent
          </button>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
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
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Données simulées - dans un vrai scénario, cela proviendrait de Firebase */}
            {[...Array(5)].map((_, index) => {
              const date = new Date();
              date.setDate(date.getDate() - index);
              
              return (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {date.toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index % 4 === 0 ? '—' : '08:30'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index % 4 === 0 ? '—' : '17:30'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {index % 4 === 0 ? (
                        <>
                          <XCircle className="w-4 h-4 text-red-500 mr-2" />
                          <span className="text-sm text-red-500">Absent</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-sm text-green-500">Présent</span>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="text-center text-sm text-gray-500 py-2">
        <p>Consultez le module Présences pour plus de détails</p>
      </div>
    </div>
  );
};
