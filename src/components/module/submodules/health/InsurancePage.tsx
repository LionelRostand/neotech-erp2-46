
import React from 'react';
import { Shield, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import InsuranceEmptyState from './components/insurance/InsuranceEmptyState';
import { useCollectionData } from '@/hooks/useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';

interface InsuranceProvider {
  id: string;
  name: string;
  type: string;
  coverage: string;
  status: 'active' | 'inactive' | 'pending';
  contactInfo: {
    email: string;
    phone: string;
    address?: string;
  };
  description: string;
}

const InsurancePage: React.FC = () => {
  // Fetch insurance providers from Firestore
  const { data: providers, isLoading, error } = useCollectionData(
    COLLECTIONS.HEALTH.INSURANCE,
    []
  );

  const insuranceProviders: InsuranceProvider[] = [
    {
      id: '1',
      name: 'AssurSanté Plus',
      type: 'Mutuelle',
      coverage: 'Complète',
      status: 'active',
      contactInfo: {
        email: 'contact@assursante.fr',
        phone: '01 23 45 67 89',
        address: '15 Rue de la Santé, 75013 Paris'
      },
      description: 'Couverture complète pour tous types de soins médicaux et hospitaliers.'
    },
    {
      id: '2',
      name: 'Médic Protect',
      type: 'Assurance maladie',
      coverage: 'Standard',
      status: 'active',
      contactInfo: {
        email: 'info@medicprotect.fr',
        phone: '01 98 76 54 32'
      },
      description: 'Protection standard avec remboursements selon barème conventionnel.'
    },
    {
      id: '3',
      name: 'GlobalCare',
      type: 'International',
      coverage: 'Premium',
      status: 'inactive',
      contactInfo: {
        email: 'support@globalcare.com',
        phone: '01 45 67 89 10',
        address: '8 Avenue des Champs-Élysées, 75008 Paris'
      },
      description: 'Couverture santé internationale pour expatriés et voyageurs fréquents.'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-500">Actif</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="border-gray-400 text-gray-500">Inactif</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500">En attente</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const handleAddProvider = () => {
    // Will be implemented later
    console.log('Add insurance provider');
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          Assurances & Mutuelles
        </h1>
        <Button onClick={handleAddProvider}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvel assureur
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">Chargement des assurances...</div>
      ) : error ? (
        <div className="text-red-500 p-4">Erreur de chargement : {error.toString()}</div>
      ) : (insuranceProviders.length === 0 && !providers?.length) ? (
        <InsuranceEmptyState onAdd={handleAddProvider} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insuranceProviders.map(provider => (
            <Card key={provider.id} className="h-full">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>{provider.name}</CardTitle>
                  {getStatusBadge(provider.status)}
                </div>
                <CardDescription>{provider.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Type:</span>
                    <span>{provider.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Couverture:</span>
                    <span>{provider.coverage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Email:</span>
                    <span className="text-blue-600">{provider.contactInfo.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Téléphone:</span>
                    <span>{provider.contactInfo.phone}</span>
                  </div>
                  {provider.contactInfo.address && (
                    <div className="flex justify-between">
                      <span className="font-medium">Adresse:</span>
                      <span className="text-right">{provider.contactInfo.address}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end pt-2">
                <Button variant="outline" size="sm">Voir détails</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default InsurancePage;
