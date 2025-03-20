
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MemberDetailsSheet from './members/MemberDetailsSheet';
import MemberForm from './members/MemberForm';
import MembersTabContent from './members/MembersTabContent';
import SubscriptionPlans from './members/SubscriptionPlans';
import AccessPointsTabContent from './members/AccessPointsTabContent';
import { useMembersData } from './hooks/useMembersData';
import { useMemberDetails } from './hooks/useMemberDetails';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const MembersPage: React.FC = () => {
  console.log("MembersPage component rendering");
  const [activeTab, setActiveTab] = useState("list");
  
  useEffect(() => {
    console.log("MembersPage mounted");
    return () => {
      console.log("MembersPage unmounted");
    };
  }, []);
  
  const {
    filteredMembers,
    isLoading,
    searchQuery,
    setSearchQuery,
    handleAddMember,
    handleUpdateMember,
    handleDeleteMember,
    forceRefresh
  } = useMembersData();

  const {
    selectedMember,
    setSelectedMember,
    isDetailsOpen,
    setIsDetailsOpen,
    isAddingMember, 
    setIsAddingMember,
    isEditingMember,
    setIsEditingMember,
    handleViewMemberDetails,
    handleEditMember,
    resetMemberForms
  } = useMemberDetails();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestion des Adhérents</CardTitle>
          {isLoading && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={forceRefresh}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              Recharger
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3 mb-6">
              <TabsTrigger value="list">Liste des adhérents</TabsTrigger>
              <TabsTrigger value="subscriptions">Abonnements</TabsTrigger>
              <TabsTrigger value="access">Points d'accès</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="space-y-4">
              <MembersTabContent 
                members={filteredMembers}
                isLoading={isLoading}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onAddMember={() => setIsAddingMember(true)}
                onViewDetails={handleViewMemberDetails}
                onEdit={handleEditMember}
                onDelete={handleDeleteMember}
              />
            </TabsContent>
            
            <TabsContent value="subscriptions">
              <SubscriptionPlans />
            </TabsContent>
            
            <TabsContent value="access">
              <AccessPointsTabContent />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {selectedMember && (
        <MemberDetailsSheet 
          member={selectedMember}
          isOpen={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          onEdit={() => setIsEditingMember(true)}
          onDelete={() => {
            handleDeleteMember(selectedMember.id);
            setSelectedMember(null);
            setIsDetailsOpen(false);
          }}
        />
      )}

      <MemberForm
        isOpen={isAddingMember || isEditingMember}
        onOpenChange={(open) => {
          if (!open) {
            resetMemberForms();
          }
        }}
        member={isEditingMember ? selectedMember : undefined}
        onSubmit={isEditingMember && selectedMember 
          ? (data) => handleUpdateMember(selectedMember.id, data) 
          : handleAddMember
        }
        mode={isEditingMember ? "edit" : "add"}
      />
    </div>
  );
};

export default MembersPage;
