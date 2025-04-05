
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DashboardLayout from '@/components/DashboardLayout';
import ConsultationList from './components/consultations/ConsultationList';
import ConsultationCalendar from './components/consultations/ConsultationCalendar';
import ConsultationFilters from './components/consultations/ConsultationFilters';
import ConsultationStats from './components/consultations/ConsultationStats';
import { useCollectionData } from '@/hooks/useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import AddConsultationDialog from './components/consultations/AddConsultationDialog';

interface Consultation {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  type: string;
  status: 'pending' | 'completed' | 'cancelled';
  notes?: string;
}

const ConsultationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'calendar'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [consultations, setConsultations] = useState<Consultation[]>([]);

  // Mock data for now
  const { data, isLoading, error } = useCollectionData(
    COLLECTIONS.HEALTH.CONSULTATIONS,
    []
  );

  // Parse date strings to Date objects for the calendar
  const consultationDates = consultations.map(
    consultation => new Date(consultation.date)
  );

  // Fetch patients and doctors for the dropdown
  const patients = [
    { id: 'p1', name: 'Jean Dupont' },
    { id: 'p2', name: 'Marie Martin' },
    { id: 'p3', name: 'Pierre Dubois' },
  ];

  const doctors = [
    { id: 'd1', name: 'Dr. Sophie Lambert' },
    { id: 'd2', name: 'Dr. Thomas Bernard' },
    { id: 'd3', name: 'Dr. Julie Moreau' },
  ];

  // Filter consultations based on search, status, type, and date
  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = searchTerm === '' || 
      consultation.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || consultation.status === statusFilter;
    
    const matchesType = typeFilter === 'all' || consultation.type === typeFilter;
    
    const matchesDate = !selectedDate || 
      consultation.date === selectedDate.toISOString().split('T')[0];
      
    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  // Calculate statistics for the stats cards
  const totalConsultations = consultations.length;
  const completedConsultations = consultations.filter(c => c.status === 'completed').length;
  const pendingConsultations = consultations.filter(c => c.status === 'pending').length;
  const cancelledConsultations = consultations.filter(c => c.status === 'cancelled').length;

  useEffect(() => {
    // Mock data for display
    setConsultations([
      {
        id: '1',
        patientName: 'Jean Dupont',
        doctorName: 'Dr. Sophie Lambert',
        date: '2023-05-10',
        time: '09:00',
        type: 'routine',
        status: 'completed',
        notes: 'Check-up annuel'
      },
      {
        id: '2',
        patientName: 'Marie Martin',
        doctorName: 'Dr. Thomas Bernard',
        date: '2023-05-15',
        time: '14:30',
        type: 'emergency',
        status: 'completed',
        notes: 'Douleurs abdominales'
      },
      {
        id: '3',
        patientName: 'Pierre Dubois',
        doctorName: 'Dr. Julie Moreau',
        date: '2023-05-20',
        time: '11:00',
        type: 'followup',
        status: 'pending',
        notes: 'Suivi de traitement'
      }
    ]);
  }, []);

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
    setSelectedDate(undefined);
  };

  const handleViewConsultation = (consultation: Consultation) => {
    console.log('View consultation:', consultation);
    // Will be implemented later
  };

  const handleEditConsultation = (consultation: Consultation) => {
    console.log('Edit consultation:', consultation);
    // Will be implemented later
  };

  const handleDeleteConsultation = (consultation: Consultation) => {
    console.log('Delete consultation:', consultation);
    // Will be implemented later
  };

  const handleAddConsultation = (data: any) => {
    console.log('Add consultation:', data);
    // Will be implemented with Firebase later
    setIsAddDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Consultations</h1>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle Consultation
          </Button>
        </div>

        <ConsultationStats
          totalConsultations={totalConsultations}
          completedConsultations={completedConsultations}
          pendingConsultations={pendingConsultations}
          cancelledConsultations={cancelledConsultations}
        />

        <div className="mt-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'list' | 'calendar')}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="list">Liste</TabsTrigger>
                <TabsTrigger value="calendar">Calendrier</TabsTrigger>
              </TabsList>
            </div>

            <ConsultationFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              typeFilter={typeFilter}
              onTypeFilterChange={setTypeFilter}
              onReset={resetFilters}
            />

            <TabsContent value="list">
              {isLoading ? (
                <div className="flex justify-center p-8">Chargement des consultations...</div>
              ) : error ? (
                <div className="text-red-500 p-4">Erreur de chargement : {error.toString()}</div>
              ) : filteredConsultations.length === 0 ? (
                <div className="text-center p-8">
                  <p className="text-muted-foreground">Aucune consultation trouvée avec les filtres actuels.</p>
                  <Button variant="link" onClick={resetFilters}>Réinitialiser les filtres</Button>
                </div>
              ) : (
                <ConsultationList
                  consultations={filteredConsultations}
                  onView={handleViewConsultation}
                  onEdit={handleEditConsultation}
                  onDelete={handleDeleteConsultation}
                />
              )}
            </TabsContent>

            <TabsContent value="calendar">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <ConsultationCalendar
                    consultationDates={consultationDates}
                    onDateSelect={setSelectedDate}
                    selectedDate={selectedDate}
                  />
                </div>
                <div className="md:col-span-2">
                  {isLoading ? (
                    <div className="flex justify-center p-8">Chargement des consultations...</div>
                  ) : error ? (
                    <div className="text-red-500 p-4">Erreur de chargement : {error.toString()}</div>
                  ) : filteredConsultations.length === 0 ? (
                    <div className="text-center p-8">
                      <p className="text-muted-foreground">Aucune consultation pour la date sélectionnée.</p>
                      <Button variant="link" onClick={() => setSelectedDate(undefined)}>Voir toutes les dates</Button>
                    </div>
                  ) : (
                    <ConsultationList
                      consultations={filteredConsultations}
                      onView={handleViewConsultation}
                      onEdit={handleEditConsultation}
                      onDelete={handleDeleteConsultation}
                    />
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <AddConsultationDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onAdd={handleAddConsultation}
          patients={patients}
          doctors={doctors}
        />
      </div>
    </DashboardLayout>
  );
};

export default ConsultationsPage;
