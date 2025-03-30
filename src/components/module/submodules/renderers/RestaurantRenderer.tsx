
import React from 'react';
import { SubModule } from '@/data/types/modules';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';

interface RestaurantRendererProps {
  submoduleId: string;
  submodule: SubModule;
}

export const RestaurantRenderer: React.FC<RestaurantRendererProps> = ({ submoduleId, submodule }) => {
  switch (submoduleId) {
    case 'restaurant-pos':
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Point de Vente Restaurant</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">Caisse</h3>
              <p className="text-gray-600">Gestion des transactions et paiements clients</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">Commandes</h3>
              <p className="text-gray-600">Prise et suivi des commandes en cours</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">Tickets</h3>
              <p className="text-gray-600">Gestion des tickets et factures</p>
            </div>
          </div>
        </div>
      );
    case 'restaurant-list':
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Liste des Restaurants</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4 flex justify-between items-center">
              <div className="text-lg font-medium">Restaurants enregistrés</div>
              <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">
                Ajouter un restaurant
              </button>
            </div>
            <div className="border rounded overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">La Table d'Antoine</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">12 rue du Commerce, 75015 Paris</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">01 45 67 89 10</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Actif
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3">Éditer</button>
                      <button className="text-red-600 hover:text-red-900">Supprimer</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">Le Bistrot de Marie</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">5 avenue de la République, 75011 Paris</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">01 23 45 67 89</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Actif
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3">Éditer</button>
                      <button className="text-red-600 hover:text-red-900">Supprimer</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    default:
      return <DefaultSubmoduleContent title={submodule.name} submodule={submodule} />;
  }
};
