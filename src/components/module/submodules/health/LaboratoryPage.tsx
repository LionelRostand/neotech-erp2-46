import React, { useState } from 'react';
import { TestTube, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useHealthData } from '@/hooks/modules/useHealthData';
import { Laboratory } from './types/health-types';
import FormDialog from './dialogs/FormDialog';
import AddLaboratoryTestForm from './forms/AddLaboratoryTestForm';

const LaboratoryPage: React.FC = () => {
  const { laboratoryTests, patients, doctors, isLoading } = useHealthData();
  const [selectedLabTest, setSelectedLabTest] = useState<Laboratory | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddTest = (data: Partial<Laboratory>) => {
    console.log('New test:', data);
    setIsAddDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <TestTube className="h-6 w-6 text-primary" />
          Laboratoire
        </h1>
        <Button onClick={() => setIsAddDialogOpen(true)} disabled={isLoading}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Test
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Tests de Laboratoire</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center my-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : laboratoryTests && laboratoryTests.length > 0 ? (
                <div className="space-y-4">
                  {laboratoryTests.map((test) => {
                    const patient = patients?.find(p => p.id === test.patientId);
                    const doctor = doctors?.find(d => d.id === test.doctorId);
                    
                    return (
                      <div 
                        key={test.id} 
                        className="border p-4 rounded-lg cursor-pointer hover:bg-gray-50"
                        onClick={() => setSelectedLabTest(test)}
                      >
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">{test.testType}</h3>
                            <p className="text-sm text-gray-500">
                              Patient: {patient ? `${patient.firstName} ${patient.lastName}` : 'Inconnu'}
                            </p>
                            <p className="text-sm text-gray-500">
                              Prescrit par: {doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Inconnu'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">{new Date(test.date).toLocaleDateString()}</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              test.status === 'completed' ? 'bg-green-100 text-green-800' : 
                              test.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {test.status === 'completed' ? 'Complété' : 
                               test.status === 'pending' ? 'En attente' : 'Annulé'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <TestTube className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun test de laboratoire</h3>
                  <p className="mt-1 text-sm text-gray-500">Commencez par ajouter un nouveau test.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Détails du Test</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedLabTest ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Type de Test</h3>
                    <p>{selectedLabTest.testType}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Date</h3>
                    <p>{new Date(selectedLabTest.date).toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Statut</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedLabTest.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      selectedLabTest.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedLabTest.status === 'completed' ? 'Complété' : 
                       selectedLabTest.status === 'pending' ? 'En attente' : 'Annulé'}
                    </span>
                  </div>
                  
                  {selectedLabTest.results && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Résultats</h3>
                      <p className="whitespace-pre-line">{selectedLabTest.results}</p>
                    </div>
                  )}
                  
                  {selectedLabTest.notes && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                      <p className="whitespace-pre-line">{selectedLabTest.notes}</p>
                    </div>
                  )}
                  
                  {selectedLabTest.status === 'pending' && (
                    <div className="pt-4">
                      <Button className="w-full">Saisir les résultats</Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">Sélectionnez un test pour voir les détails</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <FormDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        title="Nouveau test de laboratoire"
        description="Enregistrer un nouveau test de laboratoire"
      >
        <AddLaboratoryTestForm
          onSubmit={handleAddTest}
          onCancel={() => setIsAddDialogOpen(false)}
        />
      </FormDialog>
    </div>
  );
};

export default LaboratoryPage;
