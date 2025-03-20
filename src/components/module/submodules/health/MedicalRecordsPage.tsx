
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Search, Plus, Filter, FileText, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MedicalRecord } from './types/health-types';

const MedicalRecordsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const firestore = useFirestore(COLLECTIONS.HEALTH);

  // Mock data for medical records
  const mockMedicalRecords: MedicalRecord[] = [
    {
      id: '1',
      patientId: 'pat-1',
      doctorId: 'doc-1',
      date: new Date(2023, 5, 15),
      diagnosis: 'Hypertension',
      treatment: 'Prescription de médicaments antihypertenseurs',
      notes: 'Patient à revoir dans 3 mois',
      createdAt: new Date(2023, 5, 15),
      updatedAt: new Date(2023, 5, 15)
    },
    {
      id: '2',
      patientId: 'pat-2',
      doctorId: 'doc-2',
      date: new Date(2023, 5, 10),
      diagnosis: 'Rhinite allergique',
      treatment: 'Antihistaminiques',
      notes: 'Éviter l\'exposition aux allergènes',
      createdAt: new Date(2023, 5, 10),
      updatedAt: new Date(2023, 5, 10)
    },
    {
      id: '3',
      patientId: 'pat-1',
      doctorId: 'doc-3',
      date: new Date(2023, 4, 20),
      diagnosis: 'Pharyngite',
      treatment: 'Antibiotiques pendant 7 jours',
      createdAt: new Date(2023, 4, 20),
      updatedAt: new Date(2023, 4, 20)
    },
  ];

  // Filtered medical records based on search query and active tab
  const filteredRecords = mockMedicalRecords.filter(record => {
    const matchesSearch = 
      record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.treatment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'recent') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return matchesSearch && new Date(record.date) >= thirtyDaysAgo;
    }
    
    // Filter by patient
    if (activeTab === 'patient-1') return matchesSearch && record.patientId === 'pat-1';
    if (activeTab === 'patient-2') return matchesSearch && record.patientId === 'pat-2';
    
    return matchesSearch;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dossiers Médicaux</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau dossier
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Historique médical</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="recent">Récents</TabsTrigger>
                <TabsTrigger value="patient-1">Patient 1</TabsTrigger>
                <TabsTrigger value="patient-2">Patient 2</TabsTrigger>
                <TabsTrigger value="all">Tous</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un diagnostic, traitement..."
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
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Patient</th>
                      <th className="px-4 py-3 text-left">Médecin</th>
                      <th className="px-4 py-3 text-left">Diagnostic</th>
                      <th className="px-4 py-3 text-left">Traitement</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map(record => (
                      <tr key={record.id} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-3">
                          {format(new Date(record.date), 'dd/MM/yyyy', { locale: fr })}
                        </td>
                        <td className="px-4 py-3">Patient {record.patientId.replace('pat-', '')}</td>
                        <td className="px-4 py-3">Dr. {record.doctorId.replace('doc-', '')}</td>
                        <td className="px-4 py-3">{record.diagnosis}</td>
                        <td className="px-4 py-3">{record.treatment || '-'}</td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredRecords.length === 0 && (
                  <div className="py-4 text-center text-muted-foreground">
                    Aucun dossier médical trouvé
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="recent" className="m-0">
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Patient</th>
                      <th className="px-4 py-3 text-left">Médecin</th>
                      <th className="px-4 py-3 text-left">Diagnostic</th>
                      <th className="px-4 py-3 text-left">Traitement</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map(record => (
                      <tr key={record.id} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-3">
                          {format(new Date(record.date), 'dd/MM/yyyy', { locale: fr })}
                        </td>
                        <td className="px-4 py-3">Patient {record.patientId.replace('pat-', '')}</td>
                        <td className="px-4 py-3">Dr. {record.doctorId.replace('doc-', '')}</td>
                        <td className="px-4 py-3">{record.diagnosis}</td>
                        <td className="px-4 py-3">{record.treatment || '-'}</td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredRecords.length === 0 && (
                  <div className="py-4 text-center text-muted-foreground">
                    Aucun dossier médical récent
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Patient-specific tabs with same table structure */}
            <TabsContent value="patient-1" className="m-0">
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Médecin</th>
                      <th className="px-4 py-3 text-left">Diagnostic</th>
                      <th className="px-4 py-3 text-left">Traitement</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map(record => (
                      <tr key={record.id} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-3">
                          {format(new Date(record.date), 'dd/MM/yyyy', { locale: fr })}
                        </td>
                        <td className="px-4 py-3">Dr. {record.doctorId.replace('doc-', '')}</td>
                        <td className="px-4 py-3">{record.diagnosis}</td>
                        <td className="px-4 py-3">{record.treatment || '-'}</td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredRecords.length === 0 && (
                  <div className="py-4 text-center text-muted-foreground">
                    Aucun dossier médical pour ce patient
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="patient-2" className="m-0">
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Médecin</th>
                      <th className="px-4 py-3 text-left">Diagnostic</th>
                      <th className="px-4 py-3 text-left">Traitement</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map(record => (
                      <tr key={record.id} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-3">
                          {format(new Date(record.date), 'dd/MM/yyyy', { locale: fr })}
                        </td>
                        <td className="px-4 py-3">Dr. {record.doctorId.replace('doc-', '')}</td>
                        <td className="px-4 py-3">{record.diagnosis}</td>
                        <td className="px-4 py-3">{record.treatment || '-'}</td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredRecords.length === 0 && (
                  <div className="py-4 text-center text-muted-foreground">
                    Aucun dossier médical pour ce patient
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

export default MedicalRecordsPage;
