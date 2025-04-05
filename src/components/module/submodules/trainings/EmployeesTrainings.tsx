
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GraduationCap, 
  Plus,
  Calendar,
  Building
} from 'lucide-react';
import { useTrainingsData } from '@/hooks/useTrainingsData';

const EmployeesTrainings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const { trainings, stats, isLoading, error } = useTrainingsData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <p className="ml-2">Chargement des formations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        Une erreur est survenue lors du chargement des formations.
      </div>
    );
  }

  const filteredTrainings = activeTab === 'all' 
    ? trainings 
    : trainings?.filter(training => training.status.toLowerCase() === activeTab.toLowerCase()) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Formations</h2>
          <p className="text-gray-500">Gestion des formations du personnel</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle formation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-blue-500">{stats?.planned || 0}</div>
            <div className="text-sm text-gray-500">Planifiées</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-amber-500">{stats?.inProgress || 0}</div>
            <div className="text-sm text-gray-500">En cours</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-green-500">{stats?.completed || 0}</div>
            <div className="text-sm text-gray-500">Terminées</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-gray-500">{stats?.total || 0}</div>
            <div className="text-sm text-gray-500">Total</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-md grid grid-cols-4">
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="planifiée">Planifiées</TabsTrigger>
          <TabsTrigger value="en cours">En cours</TabsTrigger>
          <TabsTrigger value="terminée">Terminées</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <CardContent className="p-6">
              {filteredTrainings.length === 0 ? (
                <div className="text-center p-8 border border-dashed rounded-md">
                  <GraduationCap className="w-12 h-12 mx-auto text-gray-400" />
                  <p className="mt-2 text-gray-500">Aucune formation trouvée</p>
                </div>
              ) : (
                <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                  {filteredTrainings.map((training) => (
                    <div key={training.id} className="border rounded-md p-4 hover:bg-gray-50">
                      <div className="flex justify-between mb-2">
                        <div className="font-medium">{training.title}</div>
                        <div className={`px-2 py-1 rounded text-xs ${
                          training.status === 'Planifiée' ? 'bg-blue-100 text-blue-800' : 
                          training.status === 'En cours' ? 'bg-amber-100 text-amber-800' : 
                          training.status === 'Terminée' ? 'bg-green-100 text-green-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {training.status}
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Calendar className="w-4 h-4 mr-1" />
                        {training.startDate} {training.endDate ? `- ${training.endDate}` : ''}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Building className="w-4 h-4 mr-1" />
                        {training.provider || 'Formation interne'}
                      </div>
                      <div className="mt-2 text-sm">
                        Participant: <span className="font-medium">{training.employeeName}</span>
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button variant="outline" size="sm">Voir détails</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeesTrainings;
