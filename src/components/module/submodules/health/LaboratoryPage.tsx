
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { LabTest, Patient } from './types/health-types';
import { TestTube, Search, FileText, Mail, Eye, PlusCircle, CalendarClock, Loader2, UploadCloud, Send } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const LaboratoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Mock data
  const patients: Patient[] = [
    {
      id: '1',
      firstName: 'Jean',
      lastName: 'Dupont',
      dateOfBirth: '1980-05-15',
      gender: 'male',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      firstName: 'Marie',
      lastName: 'Lambert',
      dateOfBirth: '1975-10-22',
      gender: 'female',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      firstName: 'Philippe',
      lastName: 'Martin',
      dateOfBirth: '1963-08-12',
      gender: 'male',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const labTests: LabTest[] = [
    {
      id: '1',
      patientId: '1',
      doctorId: '1',
      type: 'Numération formule sanguine',
      requestedDate: '2023-05-10',
      scheduledDate: '2023-05-12',
      status: 'scheduled',
      notes: 'Contrôle annuel',
      createdAt: '2023-05-10T09:30:00Z',
      updatedAt: '2023-05-10T09:30:00Z'
    },
    {
      id: '2',
      patientId: '2',
      doctorId: '2',
      type: 'Glycémie à jeun',
      requestedDate: '2023-05-09',
      scheduledDate: '2023-05-11',
      status: 'scheduled',
      notes: 'Suivi diabète',
      createdAt: '2023-05-09T14:15:00Z',
      updatedAt: '2023-05-09T14:15:00Z'
    },
    {
      id: '3',
      patientId: '3',
      doctorId: '1',
      type: 'Bilan lipidique',
      requestedDate: '2023-05-08',
      completedDate: '2023-05-10',
      results: 'Cholestérol total: 5.2 mmol/L (Normal)\nLDL: 3.1 mmol/L (Normal)\nHDL: 1.4 mmol/L (Normal)\nTriglycérides: 1.5 mmol/L (Normal)',
      status: 'completed',
      createdAt: '2023-05-08T10:00:00Z',
      updatedAt: '2023-05-10T15:30:00Z'
    },
    {
      id: '4',
      patientId: '1',
      doctorId: '3',
      type: 'Test COVID-19 PCR',
      requestedDate: '2023-05-07',
      completedDate: '2023-05-08',
      results: 'Négatif',
      status: 'completed',
      createdAt: '2023-05-07T11:45:00Z',
      updatedAt: '2023-05-08T09:20:00Z'
    },
    {
      id: '5',
      patientId: '2',
      doctorId: '2',
      type: 'TSH',
      requestedDate: '2023-05-06',
      status: 'requested',
      notes: 'Suivi thyroïde',
      createdAt: '2023-05-06T16:30:00Z',
      updatedAt: '2023-05-06T16:30:00Z'
    }
  ];

  // Forms
  const requestForm = useForm({
    defaultValues: {
      patientId: '',
      type: '',
      notes: '',
    }
  });

  const resultForm = useForm({
    defaultValues: {
      results: '',
    }
  });

  // Filter by search term
  const filterTests = (tests: LabTest[]) => {
    if (!searchTerm) return tests;

    return tests.filter(test => {
      const patient = patients.find(p => p.id === test.patientId);
      if (!patient) return false;
      
      const patientName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
      const testType = test.type.toLowerCase();
      
      return patientName.includes(searchTerm.toLowerCase()) || 
             testType.includes(searchTerm.toLowerCase());
    });
  };

  // Filter by status
  const getPendingTests = () => {
    return filterTests(labTests.filter(test => test.status === 'requested' || test.status === 'scheduled'));
  };

  const getCompletedTests = () => {
    return filterTests(labTests.filter(test => test.status === 'completed'));
  };

  // Get patient name
  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Inconnu';
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'requested':
        return <Badge className="bg-amber-100 text-amber-800">Demandé</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800">Planifié</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Terminé</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Annulé</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  // Handle new test request
  const handleNewRequest = (data: any) => {
    console.log('New test request:', data);
    toast.success('Demande d\'analyse créée avec succès');
    setIsRequestDialogOpen(false);
    requestForm.reset();
  };

  // Handle view test
  const handleViewTest = (test: LabTest) => {
    setSelectedTest(test);
    setIsResultDialogOpen(true);
    if (test.results) {
      resultForm.setValue('results', test.results);
    }
  };

  // Handle upload result document
  const handleUpload = () => {
    setIsUploading(true);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        setUploadProgress(0);
        toast.success('Document téléchargé avec succès');
      }
    }, 300);
  };

  // Handle save results
  const handleSaveResults = (data: any) => {
    console.log('Test results:', data);
    toast.success('Résultats enregistrés avec succès');
    setIsResultDialogOpen(false);
    resultForm.reset();
  };

  // Handle send results to doctor
  const handleSendToDoctor = () => {
    toast.success('Résultats envoyés au médecin avec succès');
    setIsResultDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Laboratoire d'analyses</h1>
        <Button onClick={() => setIsRequestDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouvelle demande
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="pending">
                <CalendarClock className="h-4 w-4 mr-2" />
                Analyses en cours
              </TabsTrigger>
              <TabsTrigger value="completed">
                <FileText className="h-4 w-4 mr-2" />
                Résultats
              </TabsTrigger>
            </TabsList>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="pending" className="mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Analyses en attente et planifiées</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Type d'analyse</TableHead>
                      <TableHead>Date de demande</TableHead>
                      <TableHead>Date planifiée</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getPendingTests().length > 0 ? (
                      getPendingTests().map((test) => (
                        <TableRow key={test.id}>
                          <TableCell className="font-medium">{getPatientName(test.patientId)}</TableCell>
                          <TableCell>{test.type}</TableCell>
                          <TableCell>{format(new Date(test.requestedDate), 'dd/MM/yyyy', { locale: fr })}</TableCell>
                          <TableCell>
                            {test.scheduledDate 
                              ? format(new Date(test.scheduledDate), 'dd/MM/yyyy', { locale: fr }) 
                              : '-'}
                          </TableCell>
                          <TableCell>{getStatusBadge(test.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="icon" onClick={() => handleViewTest(test)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          Aucune analyse en attente trouvée
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Analyses terminées</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Type d'analyse</TableHead>
                      <TableHead>Date de demande</TableHead>
                      <TableHead>Date de complétion</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getCompletedTests().length > 0 ? (
                      getCompletedTests().map((test) => (
                        <TableRow key={test.id}>
                          <TableCell className="font-medium">{getPatientName(test.patientId)}</TableCell>
                          <TableCell>{test.type}</TableCell>
                          <TableCell>{format(new Date(test.requestedDate), 'dd/MM/yyyy', { locale: fr })}</TableCell>
                          <TableCell>
                            {test.completedDate 
                              ? format(new Date(test.completedDate), 'dd/MM/yyyy', { locale: fr }) 
                              : '-'}
                          </TableCell>
                          <TableCell>{getStatusBadge(test.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="icon" onClick={() => handleViewTest(test)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Mail className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          Aucun résultat d'analyse trouvé
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* New Test Request Dialog */}
      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <TestTube className="h-5 w-5 mr-2" />
              Nouvelle demande d'analyse
            </DialogTitle>
          </DialogHeader>
          <Form {...requestForm}>
            <form onSubmit={requestForm.handleSubmit(handleNewRequest)} className="space-y-4">
              <FormField
                control={requestForm.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un patient" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {patients.map(patient => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.firstName} {patient.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={requestForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type d'analyse</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type d'analyse" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Numération formule sanguine">Numération formule sanguine</SelectItem>
                        <SelectItem value="Glycémie à jeun">Glycémie à jeun</SelectItem>
                        <SelectItem value="Bilan lipidique">Bilan lipidique</SelectItem>
                        <SelectItem value="Test COVID-19 PCR">Test COVID-19 PCR</SelectItem>
                        <SelectItem value="TSH">TSH</SelectItem>
                        <SelectItem value="Ionogramme">Ionogramme</SelectItem>
                        <SelectItem value="Créatinine">Créatinine</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={requestForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Informations supplémentaires pour le laboratoire" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" type="button" onClick={() => setIsRequestDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">Créer la demande</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* View/Add Results Dialog */}
      {selectedTest && (
        <Dialog open={isResultDialogOpen} onOpenChange={setIsResultDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <TestTube className="h-5 w-5 mr-2" />
                {selectedTest.status === 'completed' ? 'Résultats d\'analyse' : 'Saisie des résultats'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Patient</h4>
                  <p>{getPatientName(selectedTest.patientId)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Type d'analyse</h4>
                  <p>{selectedTest.type}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Date de demande</h4>
                  <p>{format(new Date(selectedTest.requestedDate), 'dd/MM/yyyy', { locale: fr })}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Statut</h4>
                  <p>{getStatusBadge(selectedTest.status)}</p>
                </div>
              </div>
              
              {selectedTest.notes && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Notes</h4>
                  <p className="text-sm">{selectedTest.notes}</p>
                </div>
              )}
              
              <Form {...resultForm}>
                <form onSubmit={resultForm.handleSubmit(handleSaveResults)} className="space-y-4">
                  <FormField
                    control={resultForm.control}
                    name="results"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Résultats</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Saisir les résultats de l'analyse" 
                            {...field} 
                            rows={6}
                            readOnly={selectedTest.status === 'completed'}
                            className={selectedTest.status === 'completed' ? 'bg-muted' : ''}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {selectedTest.status !== 'completed' && (
                    <div className="border rounded-md p-4">
                      <h4 className="text-sm font-medium mb-2">Télécharger un document</h4>
                      <div className="flex items-center justify-center border-2 border-dashed rounded-md p-6 mb-2">
                        {isUploading ? (
                          <div className="text-center">
                            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">Téléchargement en cours... {uploadProgress}%</p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <UploadCloud className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm font-medium">Glissez-déposez un fichier ou cliquez pour parcourir</p>
                            <p className="text-xs text-muted-foreground mt-1">Formats supportés: PDF, JPG, PNG</p>
                          </div>
                        )}
                      </div>
                      <Button type="button" variant="outline" className="w-full" onClick={handleUpload} disabled={isUploading}>
                        <UploadCloud className="h-4 w-4 mr-2" />
                        Télécharger un document
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" type="button" onClick={() => setIsResultDialogOpen(false)}>
                      Fermer
                    </Button>
                    {selectedTest.status !== 'completed' ? (
                      <Button type="submit">Enregistrer les résultats</Button>
                    ) : (
                      <Button type="button" variant="default" onClick={handleSendToDoctor}>
                        <Send className="h-4 w-4 mr-2" />
                        Envoyer au médecin
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default LaboratoryPage;
