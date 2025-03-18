
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  SunMedium, 
  Calendar, 
  Clock, 
  ListFilter, 
  Plus,
  Download,
  FileText
} from 'lucide-react';
import { LeaveRequestsList } from './leaves/LeaveRequestsList';
import { LeaveCalendar } from './leaves/LeaveCalendar';
import { LeaveBalanceCards } from './leaves/LeaveBalanceCards';
import { LeavePolicies } from './leaves/LeavePolicies';
import { CreateLeaveRequestDialog } from './leaves/CreateLeaveRequestDialog';

const EmployeesLeaves: React.FC = () => {
  const [activeTab, setActiveTab] = useState('demandes');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des congés</h2>
          <p className="text-gray-500">Suivi et approbation des demandes de congés</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <ListFilter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button size="sm" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle demande
          </Button>
        </div>
      </div>

      {/* Leave balance cards */}
      <LeaveBalanceCards />

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-3xl grid grid-cols-4">
          <TabsTrigger value="demandes" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Demandes
          </TabsTrigger>
          <TabsTrigger value="calendrier" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Calendrier
          </TabsTrigger>
          <TabsTrigger value="soldes" className="flex items-center">
            <SunMedium className="h-4 w-4 mr-2" />
            Soldes
          </TabsTrigger>
          <TabsTrigger value="parametres" className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Politiques
          </TabsTrigger>
        </TabsList>

        <TabsContent value="demandes">
          <Card>
            <CardContent className="p-6">
              <LeaveRequestsList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendrier">
          <Card>
            <CardContent className="p-6">
              <LeaveCalendar />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="soldes">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Soldes de congés détaillés</h3>
              <p className="text-gray-600 mb-8">
                Vue détaillée des soldes de congés par type et par employé
              </p>
              <div className="text-gray-500 text-sm italic">
                Module en cours de développement
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parametres">
          <Card>
            <CardContent className="p-6">
              <LeavePolicies />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog for creating new leave requests */}
      <CreateLeaveRequestDialog 
        isOpen={isCreateDialogOpen} 
        onClose={() => setIsCreateDialogOpen(false)} 
      />
    </div>
  );
};

export default EmployeesLeaves;
