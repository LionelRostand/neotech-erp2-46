import React, { useState, useEffect } from 'react';
import { useCollectionData } from '@/hooks/useCollectionData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { orderBy } from 'firebase/firestore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ConsultationList from './components/consultations/ConsultationList';
import ConsultationCalendar from './components/consultations/ConsultationCalendar';
import ConsultationFilters from './components/consultations/ConsultationFilters';
import ConsultationStats from './components/consultations/ConsultationStats';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import AddConsultationDialog from './components/consultations/AddConsultationDialog';
import { toast } from 'sonner';

const ConsultationsPage: React.FC = () => {
  // State for UI controls
  const [activeTab, setActiveTab] = useState('list');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // Get consultations data
  const { 
    data: consultations, 
    isLoading, 
    error 
  } = useCollectionData(
    COLLECTIONS.HEALTH.CONSULTATIONS, // Use the correct path
    [orderBy('date', 'desc')]
  );

  // Function to handle adding a new consultation
  const handleAddConsultation = () => {
    setIsAddDialogOpen(true);
  };

  // Function to handle closing the add consultation dialog
  const handleAddDialogClose = () => {
    setIsAddDialogOpen(false);
  };

  // Function to handle filter selection
  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
  };

  // Function to filter consultations based on selected filter
  const filteredConsultations = React.useMemo(() => {
    if (!consultations) return [];
    
    switch (selectedFilter) {
      case 'upcoming':
        return consultations.filter(consultation => new Date(consultation.date) > new Date());
      case 'past':
        return consultations.filter(consultation => new Date(consultation.date) <= new Date());
      default:
        return consultations;
    }
  }, [consultations, selectedFilter]);

  return (
    <div className="space-y-6">
      {/* Header with title and add button */}
      <div className="flex items-center justify-between">
        <CardHeader>
          <CardTitle>Consultations</CardTitle>
        </CardHeader>
        <Button onClick={handleAddConsultation}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter
        </Button>
      </div>
      
      {/* Tabs for list and calendar views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="list">Liste</TabsTrigger>
          <TabsTrigger value="calendar">Calendrier</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Liste des consultations</CardTitle>
            </CardHeader>
            <CardContent className="pl-2 pb-4">
              {/* Consultation filters */}
              <ConsultationFilters 
                selectedFilter={selectedFilter}
                onFilterSelect={handleFilterSelect}
              />
              
              {/* Consultation list */}
              {isLoading ? (
                <p>Chargement des consultations...</p>
              ) : error ? (
                <p className="text-red-500">Erreur lors du chargement des consultations.</p>
              ) : (
                <ConsultationList consultations={filteredConsultations} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Calendrier des consultations</CardTitle>
            </CardHeader>
            <CardContent className="pl-2 pb-4">
              {/* Consultation calendar */}
              {isLoading ? (
                <p>Chargement du calendrier...</p>
              ) : error ? (
                <p className="text-red-500">Erreur lors du chargement du calendrier.</p>
              ) : (
                <ConsultationCalendar consultations={filteredConsultations} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Consultation statistics */}
      <ConsultationStats consultations={consultations || []} />
      
      {/* Add consultation dialog */}
      <AddConsultationDialog 
        open={isAddDialogOpen}
        onOpenChange={handleAddDialogClose}
        onConsultationAdded={() => {
          toast.success('Consultation ajoutée avec succès!');
        }}
      />
    </div>
  );
};

export default ConsultationsPage;
