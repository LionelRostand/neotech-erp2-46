
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Filter, Calendar, Shield, Clock } from "lucide-react";
import StaffList from './components/staff/StaffList';
import PermissionsManager from './components/staff/PermissionsManager';
import StaffSchedules from './components/staff/StaffSchedules';
import StaffLeaves from './components/staff/StaffLeaves';
import StaffMemberDetail from './components/staff/StaffMemberDetail';
import { StaffMember } from './types/health-types';
import { toast } from "@/hooks/use-toast";
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';

const StaffPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('list');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const staffCollection = useFirestore(COLLECTIONS.HEALTH_STAFF);
  
  const handleViewStaff = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setIsEditing(false);
  };

  const handleEditStaff = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setIsEditing(true);
  };

  const handleAddStaff = () => {
    setSelectedStaff(null);
    setIsCreating(true);
  };

  const handleBackToList = () => {
    setSelectedStaff(null);
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleSaveStaff = async (data: StaffMember) => {
    try {
      // Update or create the staff member
      if (data.id && !isCreating) {
        await staffCollection.update(data.id, data);
        toast({ 
          title: "Personnel mis à jour", 
          description: `Les informations de ${data.firstName} ${data.lastName} ont été mises à jour.`
        });
      } else {
        await staffCollection.add(data);
        toast({ 
          title: "Personnel ajouté", 
          description: `${data.firstName} ${data.lastName} a été ajouté à l'équipe.`
        });
      }
      
      // Return to list view
      handleBackToList();
    } catch (error) {
      console.error("Error saving staff member:", error);
      toast({ 
        title: "Erreur", 
        description: "Une erreur s'est produite lors de l'enregistrement.",
        variant: "destructive"
      });
    }
  };

  // Show staff detail view when a staff member is selected or when creating a new one
  if (selectedStaff || isCreating) {
    return (
      <StaffMemberDetail 
        staffMember={selectedStaff}
        onBack={handleBackToList}
        onSave={handleSaveStaff}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion du Personnel</h2>
          <p className="text-gray-500">Gérez le personnel médical et administratif</p>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
          <Button size="sm" onClick={handleAddStaff}>
            <UserPlus className="h-4 w-4 mr-2" />
            Ajouter un membre
          </Button>
        </div>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Rechercher un membre du personnel..."
          className="pl-8 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="list">Personnel</TabsTrigger>
          <TabsTrigger value="permissions">Rôles</TabsTrigger>
          <TabsTrigger value="schedules">Plannings</TabsTrigger>
          <TabsTrigger value="leaves">Absences</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardContent className="p-6">
              <StaffList 
                searchQuery={searchQuery} 
                onViewStaff={handleViewStaff}
                onEditStaff={handleEditStaff}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-500" />
                Gestion des rôles et permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PermissionsManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedules">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                Plannings du personnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StaffSchedules />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaves">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-500" />
                Gestion des absences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StaffLeaves />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffPage;
