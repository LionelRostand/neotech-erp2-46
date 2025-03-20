
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Medication, Patient, Prescription } from './types/health-types';
import { 
  FileText, Search, Plus, Trash2, Eye, Send, FileCheck2, 
  CalendarClock, Pill, PlusCircle, Printer, Download
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const PrescriptionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);

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
    }
  ];

  const prescriptions: Prescription[] = [
    {
      id: '1',
      patientId: '1',
      doctorId: '1',
      date: '2023-05-10',
      medications: [
        {
          name: 'Amoxicilline',
          dosage: '500mg',
          frequency: '3 fois par jour',
          duration: '7 jours',
          instructions: 'Prendre pendant les repas',
          quantity: 21
        },
        {
          name: 'Paracétamol',
          dosage: '1000mg',
          frequency: 'Toutes les 6 heures si nécessaire',
          duration: '5 jours',
          instructions: 'Ne pas dépasser 4 comprimés par jour',
          quantity: 10
        }
      ],
      notes: 'Infection des voies respiratoires',
      status: 'active',
      isDigitallySigned: true,
      signedBy: 'Dr. Martin',
      signatureDate: '2023-05-10T10:30:00Z',
      sentToPharmacy: true,
      pharmacyId: 'p1',
      createdAt: '2023-05-10T10:30:00Z',
      updatedAt: '2023-05-10T10:30:00Z'
    },
    {
      id: '2',
      patientId: '2',
      doctorId: '2',
      date: '2023-05-08',
      medications: [
        {
          name: 'Metformine',
          dosage: '850mg',
          frequency: '2 fois par jour',
          duration: '1 mois',
          instructions: 'Prendre pendant les repas',
          quantity: 60
        }
      ],
      notes: 'Renouvellement traitement diabète',
      status: 'active',
      isDigitallySigned: true,
      signedBy: 'Dr. Bernard',
      signatureDate: '2023-05-08T14:15:00Z',
      sentToPharmacy: false,
      createdAt: '2023-05-08T14:15:00Z',
      updatedAt: '2023-05-08T14:15:00Z'
    },
    {
      id: '3',
      patientId: '1',
      doctorId: '3',
      date: '2023-04-15',
      medications: [
        {
          name: 'Ibuprofène',
          dosage: '400mg',
          frequency: '3 fois par jour',
          duration: '5 jours',
          instructions: 'Prendre pendant les repas',
          quantity: 15
        }
      ],
      notes: 'Douleurs musculaires',
      status: 'completed',
      isDigitallySigned: true,
      signedBy: 'Dr. Klein',
      signatureDate: '2023-04-15T09:45:00Z',
      sentToPharmacy: true,
      pharmacyId: 'p2',
      createdAt: '2023-04-15T09:45:00Z',
      updatedAt: '2023-04-15T09:45:00Z'
    }
  ];

  // Filter prescriptions by search term and status
  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = searchTerm === '' || 
      patients.some(patient => {
        if (patient.id === prescription.patientId) {
          const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
          return fullName.includes(searchTerm.toLowerCase());
        }
        return false;
      });
    
    const matchesStatus = 
      (activeTab === 'active' && prescription.status === 'active') ||
      (activeTab === 'completed' && prescription.status === 'completed') ||
      (activeTab === 'all');
    
    return matchesSearch && matchesStatus;
  });

  // Get patient name
  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Inconnu';
  };

  // Handle view prescription
  const handleViewPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setIsViewDialogOpen(true);
  };

  // Handle send to pharmacy
  const handleSendToPharmacy = (prescription: Prescription) => {
    toast.success(`Ordonnance envoyée à la pharmacie`);
  };

  // Forms
  const prescriptionForm = useForm({
    defaultValues: {
      patientId: '',
      notes: '',
    }
  });

  const medicationForm = useForm({
    defaultValues: {
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
      quantity: 0,
    }
  });

  // Handle add medication to prescription
  const handleAddMedication = (data: any) => {
    setMedications([...medications, data]);
    medicationForm.reset();
    toast.success('Médicament ajouté à l\'ordonnance');
  };

  // Handle remove medication
  const handleRemoveMedication = (index: number) => {
    const newMedications = [...medications];
    newMedications.splice(index, 1);
    setMedications(newMedications);
  };

  // Handle create prescription
  const handleCreatePrescription = (data: any) => {
    if (medications.length === 0) {
      toast.error('Veuillez ajouter au moins un médicament');
      return;
    }
    
    const prescriptionData = {
      ...data,
      medications,
    };
    
    console.log('New prescription:', prescriptionData);
    toast.success('Ordonnance créée avec succès');
    setIsCreateDialogOpen(false);
    prescriptionForm.reset();
    setMedications([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ordonnances</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle ordonnance
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="active">
                <CalendarClock className="h-4 w-4 mr-2" />
                En cours
              </TabsTrigger>
              <TabsTrigger value="completed">
                <FileCheck2 className="h-4 w-4 mr-2" />
                Terminées
              </TabsTrigger>
              <TabsTrigger value="all">
                <FileText className="h-4 w-4 mr-2" />
                Toutes
              </TabsTrigger>
            </TabsList>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un patient..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Liste des ordonnances</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Médicaments</TableHead>
                      <TableHead>Signature</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPrescriptions.length > 0 ? (
                      filteredPrescriptions.map((prescription) => (
                        <TableRow key={prescription.id}>
                          <TableCell className="font-medium">{getPatientName(prescription.patientId)}</TableCell>
                          <TableCell>{format(new Date(prescription.date), 'dd/MM/yyyy', { locale: fr })}</TableCell>
                          <TableCell>{prescription.medications.length} médicament(s)</TableCell>
                          <TableCell>
                            {prescription.isDigitallySigned ? (
                              <Badge className="bg-green-100 text-green-800">
                                <FileCheck2 className="h-3 w-3 mr-1" />
                                Signé
                              </Badge>
                            ) : (
                              <Badge variant="outline">Non signé</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {prescription.status === 'active' ? (
                              <Badge className="bg-blue-100 text-blue-800">En cours</Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-800">Terminée</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="icon" onClick={() => handleViewPrescription(prescription)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Printer className="h-4 w-4" />
                              </Button>
                              {prescription.status === 'active' && !prescription.sentToPharmacy && (
                                <Button variant="ghost" size="icon" onClick={() => handleSendToPharmacy(prescription)}>
                                  <Send className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          Aucune ordonnance trouvée
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </Tabs>
      </div>

      {/* Create Prescription Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Nouvelle ordonnance
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <Form {...prescriptionForm}>
              <form className="space-y-4">
                <FormField
                  control={prescriptionForm.control}
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
                
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-3">Médicaments</h3>
                  {medications.length > 0 ? (
                    <div className="space-y-3 mb-4">
                      {medications.map((med, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border rounded-md">
                          <div>
                            <div className="font-medium">{med.name} - {med.dosage}</div>
                            <div className="text-sm text-muted-foreground">
                              {med.frequency}, {med.duration} • {med.quantity} unité(s)
                            </div>
                            {med.instructions && (
                              <div className="text-xs italic mt-1">{med.instructions}</div>
                            )}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500"
                            onClick={() => handleRemoveMedication(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 mb-4 border border-dashed rounded-md">
                      <Pill className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Aucun médicament ajouté</p>
                    </div>
                  )}
                  
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium mb-3">Ajouter un médicament</h4>
                    <Form {...medicationForm}>
                      <form onSubmit={medicationForm.handleSubmit(handleAddMedication)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={medicationForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Médicament</FormLabel>
                                <FormControl>
                                  <Input placeholder="Nom du médicament" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={medicationForm.control}
                            name="dosage"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Dosage</FormLabel>
                                <FormControl>
                                  <Input placeholder="Ex: 500mg" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={medicationForm.control}
                            name="frequency"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Fréquence</FormLabel>
                                <FormControl>
                                  <Input placeholder="Ex: 3 fois par jour" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={medicationForm.control}
                            name="duration"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Durée</FormLabel>
                                <FormControl>
                                  <Input placeholder="Ex: 7 jours" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={medicationForm.control}
                            name="quantity"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Quantité</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    min="1" 
                                    placeholder="Nombre d'unités" 
                                    {...field} 
                                    onChange={e => field.onChange(parseInt(e.target.value))}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={medicationForm.control}
                            name="instructions"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Instructions</FormLabel>
                                <FormControl>
                                  <Input placeholder="Ex: Prendre pendant les repas" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <Button type="submit" className="w-full">
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Ajouter ce médicament
                        </Button>
                      </form>
                    </Form>
                  </div>
                </div>
                
                <FormField
                  control={prescriptionForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Informations complémentaires sur l'ordonnance" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" type="button" onClick={() => setIsCreateDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="button" onClick={prescriptionForm.handleSubmit(handleCreatePrescription)}>
                    Créer et signer l'ordonnance
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Prescription Dialog */}
      {selectedPrescription && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Ordonnance - {getPatientName(selectedPrescription.patientId)}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b">
                <div>
                  <h3 className="font-semibold">Patient</h3>
                  <p>{getPatientName(selectedPrescription.patientId)}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Date</h3>
                  <p>{format(new Date(selectedPrescription.date), 'dd MMMM yyyy', { locale: fr })}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Médecin</h3>
                  <p>{selectedPrescription.signedBy || 'Non signé'}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Médicaments prescrits</h3>
                <div className="space-y-3">
                  {selectedPrescription.medications.map((med, index) => (
                    <div key={index} className="p-3 border rounded-md">
                      <div className="flex items-center">
                        <Pill className="h-5 w-5 mr-2 text-primary" />
                        <span className="font-medium">{med.name} - {med.dosage}</span>
                      </div>
                      <div className="ml-7 text-sm">
                        <p>{med.frequency}, {med.duration}</p>
                        <p>Quantité: {med.quantity} unité(s)</p>
                        {med.instructions && (
                          <p className="italic text-xs mt-1">{med.instructions}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedPrescription.notes && (
                <div>
                  <h3 className="font-semibold mb-2">Notes</h3>
                  <p className="p-3 border rounded-md">{selectedPrescription.notes}</p>
                </div>
              )}
              
              {selectedPrescription.isDigitallySigned && (
                <div className="pt-4 border-t">
                  <div className="flex items-center">
                    <FileCheck2 className="h-4 w-4 text-green-600 mr-2" />
                    <div className="text-sm">
                      <span className="font-medium">
                        Signé électroniquement par {selectedPrescription.signedBy}
                      </span>
                      <span className="block text-muted-foreground">
                        {selectedPrescription.signatureDate && 
                          format(new Date(selectedPrescription.signatureDate), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Fermer
                </Button>
                <Button>
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimer
                </Button>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger PDF
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PrescriptionsPage;
