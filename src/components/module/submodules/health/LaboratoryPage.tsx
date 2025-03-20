
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Search, Plus, Filter, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { LabTest } from './types/health-types';

const LaboratoryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const firestore = useFirestore(COLLECTIONS.HEALTH);

  // Mock data for lab tests
  const mockLabTests: LabTest[] = [
    {
      id: '1',
      patientId: 'pat-1',
      doctorId: 'doc-1',
      type: 'Analyse sanguine',
      requestedDate: new Date(2023, 5, 15),
      scheduledDate: new Date(2023, 5, 17),
      status: 'scheduled',
      createdAt: new Date(2023, 5, 15),
      updatedAt: new Date(2023, 5, 15)
    },
    {
      id: '2',
      patientId: 'pat-2',
      doctorId: 'doc-2',
      type: 'Radiographie',
      requestedDate: new Date(2023, 5, 14),
      scheduledDate: new Date(2023, 5, 16),
      completedDate: new Date(2023, 5, 16),
      results: 'Résultats normaux',
      status: 'completed',
      createdAt: new Date(2023, 5, 14),
      updatedAt: new Date(2023, 5, 16)
    },
    {
      id: '3',
      patientId: 'pat-3',
      doctorId: 'doc-1',
      type: 'Électrocardiogramme',
      requestedDate: new Date(2023, 5, 13),
      status: 'requested',
      createdAt: new Date(2023, 5, 13),
      updatedAt: new Date(2023, 5, 13)
    },
  ];

  // Filtered lab tests based on search query and active tab
  const filteredLabTests = mockLabTests.filter(test => {
    const matchesSearch = test.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'pending') return matchesSearch && ['requested', 'scheduled'].includes(test.status);
    if (activeTab === 'completed') return matchesSearch && test.status === 'completed';
    return matchesSearch;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'requested': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'requested': return 'Demandé';
      case 'scheduled': return 'Programmé';
      case 'completed': return 'Complété';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Laboratoire</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle analyse
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Analyses médicales</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="pending">En attente</TabsTrigger>
                <TabsTrigger value="completed">Complétées</TabsTrigger>
                <TabsTrigger value="all">Toutes</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher..."
                    className="pl-8 w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <TabsContent value="all" className="m-0">
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left">Type</th>
                      <th className="px-4 py-3 text-left">Patient</th>
                      <th className="px-4 py-3 text-left">Médecin</th>
                      <th className="px-4 py-3 text-left">Date demandée</th>
                      <th className="px-4 py-3 text-left">Date programmée</th>
                      <th className="px-4 py-3 text-left">Statut</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLabTests.map(test => (
                      <tr key={test.id} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-3">{test.type}</td>
                        <td className="px-4 py-3">Patient {test.patientId.replace('pat-', '')}</td>
                        <td className="px-4 py-3">Dr. {test.doctorId.replace('doc-', '')}</td>
                        <td className="px-4 py-3">
                          {format(new Date(test.requestedDate), 'dd/MM/yyyy', { locale: fr })}
                        </td>
                        <td className="px-4 py-3">
                          {test.scheduledDate 
                            ? format(new Date(test.scheduledDate), 'dd/MM/yyyy', { locale: fr }) 
                            : '-'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(test.status)}`}>
                            {getStatusLabel(test.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="sm">Détails</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredLabTests.length === 0 && (
                  <div className="py-4 text-center text-muted-foreground">
                    Aucune analyse trouvée
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="pending" className="m-0">
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left">Type</th>
                      <th className="px-4 py-3 text-left">Patient</th>
                      <th className="px-4 py-3 text-left">Médecin</th>
                      <th className="px-4 py-3 text-left">Date demandée</th>
                      <th className="px-4 py-3 text-left">Date programmée</th>
                      <th className="px-4 py-3 text-left">Statut</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLabTests.map(test => (
                      <tr key={test.id} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-3">{test.type}</td>
                        <td className="px-4 py-3">Patient {test.patientId.replace('pat-', '')}</td>
                        <td className="px-4 py-3">Dr. {test.doctorId.replace('doc-', '')}</td>
                        <td className="px-4 py-3">
                          {format(new Date(test.requestedDate), 'dd/MM/yyyy', { locale: fr })}
                        </td>
                        <td className="px-4 py-3">
                          {test.scheduledDate 
                            ? format(new Date(test.scheduledDate), 'dd/MM/yyyy', { locale: fr }) 
                            : '-'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(test.status)}`}>
                            {getStatusLabel(test.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="sm">Détails</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredLabTests.length === 0 && (
                  <div className="py-4 text-center text-muted-foreground">
                    Aucune analyse en attente
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="completed" className="m-0">
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left">Type</th>
                      <th className="px-4 py-3 text-left">Patient</th>
                      <th className="px-4 py-3 text-left">Médecin</th>
                      <th className="px-4 py-3 text-left">Date complétée</th>
                      <th className="px-4 py-3 text-left">Résultats</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLabTests.map(test => test.status === 'completed' && (
                      <tr key={test.id} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-3">{test.type}</td>
                        <td className="px-4 py-3">Patient {test.patientId.replace('pat-', '')}</td>
                        <td className="px-4 py-3">Dr. {test.doctorId.replace('doc-', '')}</td>
                        <td className="px-4 py-3">
                          {test.completedDate 
                            ? format(new Date(test.completedDate), 'dd/MM/yyyy', { locale: fr }) 
                            : '-'}
                        </td>
                        <td className="px-4 py-3">{test.results || '-'}</td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="sm">Voir détails</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredLabTests.filter(test => test.status === 'completed').length === 0 && (
                  <div className="py-4 text-center text-muted-foreground">
                    Aucune analyse complétée
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LaboratoryPage;
