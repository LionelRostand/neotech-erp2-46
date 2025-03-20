
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Search, Plus, Filter, Eye, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Consultation } from './types/health-types';

const ConsultationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('all');
  const firestore = useFirestore(COLLECTIONS.HEALTH);

  // Mock data for consultations
  const mockConsultations: Consultation[] = [
    {
      id: '1',
      patientId: 'pat-1',
      doctorId: 'doc-1',
      date: new Date(),
      chiefComplaint: 'Douleurs abdominales',
      symptoms: 'Nausées, perte d\'appétit',
      diagnosis: 'Gastro-entérite',
      treatment: 'Repos, hydratation, médicaments symptomatiques',
      status: 'scheduled',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      patientId: 'pat-2',
      doctorId: 'doc-2',
      date: new Date(new Date().setHours(new Date().getHours() - 3)),
      chiefComplaint: 'Fièvre et toux',
      symptoms: 'Fièvre à 39°C, toux sèche, fatigue',
      diagnosis: 'Syndrome grippal',
      treatment: 'Antipyrétiques, repos',
      status: 'completed',
      createdAt: new Date(new Date().setHours(new Date().getHours() - 3)),
      updatedAt: new Date(new Date().setHours(new Date().getHours() - 2))
    },
    {
      id: '3',
      patientId: 'pat-3',
      doctorId: 'doc-1',
      date: new Date(new Date().setDate(new Date().getDate() + 1)),
      chiefComplaint: 'Mal de tête intense',
      symptoms: 'Céphalées, sensibilité à la lumière',
      status: 'scheduled',
      createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
      updatedAt: new Date(new Date().setDate(new Date().getDate() - 1))
    },
  ];

  // Get today's date at midnight for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Tomorrow's date at midnight
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Filtered consultations based on tab, search query, and doctor filter
  const filteredConsultations = mockConsultations.filter(consultation => {
    const consultationDate = new Date(consultation.date);
    consultationDate.setHours(0, 0, 0, 0);
    
    const matchesSearch = 
      consultation.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultation.symptoms.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultation.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultation.treatment?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDoctor = doctorFilter === 'all' || consultation.doctorId === doctorFilter;
    
    if (activeTab === 'all') return matchesSearch && matchesDoctor;
    if (activeTab === 'today') return matchesSearch && matchesDoctor && consultationDate.getTime() === today.getTime();
    if (activeTab === 'upcoming') return matchesSearch && matchesDoctor && consultationDate.getTime() >= today.getTime();
    if (activeTab === 'completed') return matchesSearch && matchesDoctor && consultation.status === 'completed';
    
    return matchesSearch && matchesDoctor;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-amber-100 text-amber-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Prévu';
      case 'in-progress': return 'En cours';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Consultations</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle consultation
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Liste des consultations</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <TabsList>
                <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
                <TabsTrigger value="upcoming">À venir</TabsTrigger>
                <TabsTrigger value="completed">Terminées</TabsTrigger>
                <TabsTrigger value="all">Toutes</TabsTrigger>
              </TabsList>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher..."
                    className="pl-8 w-full sm:w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Select value={doctorFilter} onValueChange={setDoctorFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Médecin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="doc-1">Dr. Martin</SelectItem>
                    <SelectItem value="doc-2">Dr. Dupont</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Content for all tabs - same table structure */}
            <TabsContent value="all" className="m-0">
              <div className="rounded-md border overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Patient</th>
                      <th className="px-4 py-3 text-left">Médecin</th>
                      <th className="px-4 py-3 text-left">Motif</th>
                      <th className="px-4 py-3 text-left">Statut</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredConsultations.map(consultation => (
                      <tr key={consultation.id} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-3">
                          {format(new Date(consultation.date), 'dd/MM/yyyy HH:mm', { locale: fr })}
                        </td>
                        <td className="px-4 py-3">Patient {consultation.patientId.replace('pat-', '')}</td>
                        <td className="px-4 py-3">Dr. {consultation.doctorId === 'doc-1' ? 'Martin' : 'Dupont'}</td>
                        <td className="px-4 py-3">{consultation.chiefComplaint}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(consultation.status)}`}>
                            {getStatusLabel(consultation.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Calendar className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredConsultations.length === 0 && (
                  <div className="py-4 text-center text-muted-foreground">
                    Aucune consultation trouvée
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Same structure for other tabs */}
            <TabsContent value="today" className="m-0">
              <div className="rounded-md border overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left">Heure</th>
                      <th className="px-4 py-3 text-left">Patient</th>
                      <th className="px-4 py-3 text-left">Médecin</th>
                      <th className="px-4 py-3 text-left">Motif</th>
                      <th className="px-4 py-3 text-left">Statut</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredConsultations.map(consultation => (
                      <tr key={consultation.id} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-3">
                          {format(new Date(consultation.date), 'HH:mm', { locale: fr })}
                        </td>
                        <td className="px-4 py-3">Patient {consultation.patientId.replace('pat-', '')}</td>
                        <td className="px-4 py-3">Dr. {consultation.doctorId === 'doc-1' ? 'Martin' : 'Dupont'}</td>
                        <td className="px-4 py-3">{consultation.chiefComplaint}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(consultation.status)}`}>
                            {getStatusLabel(consultation.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Calendar className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredConsultations.length === 0 && (
                  <div className="py-4 text-center text-muted-foreground">
                    Aucune consultation aujourd'hui
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="upcoming" className="m-0">
              <div className="rounded-md border overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Patient</th>
                      <th className="px-4 py-3 text-left">Médecin</th>
                      <th className="px-4 py-3 text-left">Motif</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredConsultations.map(consultation => (
                      <tr key={consultation.id} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-3">
                          {format(new Date(consultation.date), 'dd/MM/yyyy HH:mm', { locale: fr })}
                        </td>
                        <td className="px-4 py-3">Patient {consultation.patientId.replace('pat-', '')}</td>
                        <td className="px-4 py-3">Dr. {consultation.doctorId === 'doc-1' ? 'Martin' : 'Dupont'}</td>
                        <td className="px-4 py-3">{consultation.chiefComplaint}</td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Calendar className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredConsultations.length === 0 && (
                  <div className="py-4 text-center text-muted-foreground">
                    Aucune consultation à venir
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="completed" className="m-0">
              <div className="rounded-md border overflow-x-auto">
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
                    {filteredConsultations.map(consultation => consultation.status === 'completed' && (
                      <tr key={consultation.id} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-3">
                          {format(new Date(consultation.date), 'dd/MM/yyyy', { locale: fr })}
                        </td>
                        <td className="px-4 py-3">Patient {consultation.patientId.replace('pat-', '')}</td>
                        <td className="px-4 py-3">Dr. {consultation.doctorId === 'doc-1' ? 'Martin' : 'Dupont'}</td>
                        <td className="px-4 py-3">{consultation.diagnosis || '-'}</td>
                        <td className="px-4 py-3">{consultation.treatment || '-'}</td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredConsultations.filter(c => c.status === 'completed').length === 0 && (
                  <div className="py-4 text-center text-muted-foreground">
                    Aucune consultation terminée
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

export default ConsultationsPage;
