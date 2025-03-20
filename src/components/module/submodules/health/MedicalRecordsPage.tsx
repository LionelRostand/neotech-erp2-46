
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MedicalRecord, Patient } from './types/health-types';
import { FileText, Search, Lock, Eye, Download, PenLine, Clock, FileCheck2, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const MedicalRecordsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('records');

  // Mock patients data
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

  // Mock medical records data
  const medicalRecords: MedicalRecord[] = [
    {
      id: '1',
      patientId: '1',
      doctorId: '1',
      date: '2023-02-10',
      diagnosis: 'Hypertension artérielle',
      treatment: 'Prescription de Lisinopril 10mg',
      notes: 'Patient à revoir dans 3 mois pour contrôle',
      attachments: ['ecg_20230210.pdf'],
      createdAt: '2023-02-10T14:30:00Z',
      updatedAt: '2023-02-10T14:30:00Z',
      digitallySignedBy: 'Dr. Martin',
      signatureDate: '2023-02-10T14:35:00Z'
    },
    {
      id: '2',
      patientId: '1',
      doctorId: '2',
      date: '2023-04-15',
      diagnosis: 'Infection respiratoire',
      treatment: 'Antibiotiques pendant 7 jours',
      notes: 'Arrêt de travail de 5 jours',
      attachments: ['prescription_20230415.pdf', 'radio_thorax_20230415.jpg'],
      createdAt: '2023-04-15T10:15:00Z',
      updatedAt: '2023-04-15T10:15:00Z',
      digitallySignedBy: 'Dr. Bernard',
      signatureDate: '2023-04-15T10:20:00Z'
    },
    {
      id: '3',
      patientId: '2',
      doctorId: '1',
      date: '2023-01-22',
      diagnosis: 'Examen de routine',
      treatment: 'Aucun traitement nécessaire',
      notes: 'Tous les indicateurs sont normaux',
      createdAt: '2023-01-22T09:00:00Z',
      updatedAt: '2023-01-22T09:00:00Z',
      digitallySignedBy: 'Dr. Martin',
      signatureDate: '2023-01-22T09:10:00Z'
    },
    {
      id: '4',
      patientId: '2',
      doctorId: '3',
      date: '2023-03-05',
      diagnosis: 'Arthrose du genou',
      treatment: 'Anti-inflammatoires et séances de kinésithérapie',
      attachments: ['irm_genou_20230305.pdf'],
      createdAt: '2023-03-05T11:45:00Z',
      updatedAt: '2023-03-05T11:45:00Z',
      digitallySignedBy: 'Dr. Klein',
      signatureDate: '2023-03-05T12:00:00Z'
    }
  ];

  // Filter records by search term
  const filteredRecords = medicalRecords.filter(record => {
    const patient = patients.find(p => p.id === record.patientId);
    if (!patient) return false;
    
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    const diagnosis = record.diagnosis.toLowerCase();
    
    return fullName.includes(searchTerm.toLowerCase()) || 
           diagnosis.includes(searchTerm.toLowerCase());
  });

  // Get patient name from id
  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Inconnu';
  };

  // Handle view record
  const handleViewRecord = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dossiers Médicaux</h1>
        <div className="flex items-center">
          <Badge className="mr-2 bg-blue-100 text-blue-800">
            <Shield className="h-3 w-3 mr-1" />
            Accès Sécurisé
          </Badge>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Nouveau Dossier
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="records">
            <FileText className="h-4 w-4 mr-2" />
            Dossiers
          </TabsTrigger>
          <TabsTrigger value="archive">
            <Clock className="h-4 w-4 mr-2" />
            Archive
          </TabsTrigger>
          <TabsTrigger value="permissions">
            <Lock className="h-4 w-4 mr-2" />
            Permissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Dossiers médicaux récents</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un dossier..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Diagnostic</TableHead>
                    <TableHead>Signature</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{getPatientName(record.patientId)}</TableCell>
                      <TableCell>{format(new Date(record.date), 'dd/MM/yyyy', { locale: fr })}</TableCell>
                      <TableCell>{record.diagnosis}</TableCell>
                      <TableCell>
                        {record.digitallySignedBy ? (
                          <Badge className="bg-green-100 text-green-800">
                            <FileCheck2 className="h-3 w-3 mr-1" />
                            Signé
                          </Badge>
                        ) : (
                          <Badge variant="outline">Non signé</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {record.attachments?.length ? (
                          <Badge variant="outline">{record.attachments.length} document(s)</Badge>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="icon" onClick={() => handleViewRecord(record)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <PenLine className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="archive">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <Clock className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Archives des dossiers médicaux</h3>
                <p className="text-muted-foreground max-w-md">
                  Cette section contient les dossiers médicaux archivés de plus de 5 ans, 
                  conformément à la politique de conservation des données.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <Lock className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Gestion des permissions</h3>
                  <p className="text-muted-foreground max-w-md">
                    Configurez les droits d'accès aux dossiers médicaux pour les différents membres du personnel.
                  </p>
                </div>
                
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rôle</TableHead>
                        <TableHead>Visualisation</TableHead>
                        <TableHead>Modification</TableHead>
                        <TableHead>Signature</TableHead>
                        <TableHead>Accès complet</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Médecin</TableCell>
                        <TableCell><Badge variant="outline" className="bg-green-100 text-green-800">Oui</Badge></TableCell>
                        <TableCell><Badge variant="outline" className="bg-green-100 text-green-800">Oui</Badge></TableCell>
                        <TableCell><Badge variant="outline" className="bg-green-100 text-green-800">Oui</Badge></TableCell>
                        <TableCell><Badge variant="outline" className="bg-red-100 text-red-800">Non</Badge></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Infirmier</TableCell>
                        <TableCell><Badge variant="outline" className="bg-green-100 text-green-800">Oui</Badge></TableCell>
                        <TableCell><Badge variant="outline" className="bg-green-100 text-green-800">Oui</Badge></TableCell>
                        <TableCell><Badge variant="outline" className="bg-red-100 text-red-800">Non</Badge></TableCell>
                        <TableCell><Badge variant="outline" className="bg-red-100 text-red-800">Non</Badge></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Secrétaire</TableCell>
                        <TableCell><Badge variant="outline" className="bg-green-100 text-green-800">Oui</Badge></TableCell>
                        <TableCell><Badge variant="outline" className="bg-red-100 text-red-800">Non</Badge></TableCell>
                        <TableCell><Badge variant="outline" className="bg-red-100 text-red-800">Non</Badge></TableCell>
                        <TableCell><Badge variant="outline" className="bg-red-100 text-red-800">Non</Badge></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Directeur</TableCell>
                        <TableCell><Badge variant="outline" className="bg-green-100 text-green-800">Oui</Badge></TableCell>
                        <TableCell><Badge variant="outline" className="bg-green-100 text-green-800">Oui</Badge></TableCell>
                        <TableCell><Badge variant="outline" className="bg-green-100 text-green-800">Oui</Badge></TableCell>
                        <TableCell><Badge variant="outline" className="bg-green-100 text-green-800">Oui</Badge></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Medical Record Dialog */}
      {selectedRecord && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Dossier médical - {getPatientName(selectedRecord.patientId)}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Patient</h4>
                  <p>{getPatientName(selectedRecord.patientId)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Date</h4>
                  <p>{format(new Date(selectedRecord.date), 'dd MMMM yyyy', { locale: fr })}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Diagnostic</h4>
                <p className="font-medium">{selectedRecord.diagnosis}</p>
              </div>
              
              {selectedRecord.treatment && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Traitement</h4>
                  <p>{selectedRecord.treatment}</p>
                </div>
              )}
              
              {selectedRecord.notes && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Notes</h4>
                  <p className="text-sm">{selectedRecord.notes}</p>
                </div>
              )}
              
              {selectedRecord.attachments && selectedRecord.attachments.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Documents joints</h4>
                  <div className="space-y-2">
                    {selectedRecord.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                        <span className="text-sm">{attachment}</span>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedRecord.digitallySignedBy && (
                <div className="pt-4 border-t">
                  <div className="flex items-center">
                    <FileCheck2 className="h-4 w-4 text-green-600 mr-2" />
                    <div className="text-sm">
                      <span className="font-medium">Signé électroniquement par {selectedRecord.digitallySignedBy}</span>
                      <span className="block text-muted-foreground">
                        {selectedRecord.signatureDate && 
                          format(new Date(selectedRecord.signatureDate), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MedicalRecordsPage;
