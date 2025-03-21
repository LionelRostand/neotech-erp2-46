
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
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const MembersPage: React.FC = () => {
  console.log("MembersPage component rendering");
  const [activeTab, setActiveTab] = useState("list");
  const [retryCounter, setRetryCounter] = useState(0);
  
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
    forceRefresh,
    lastError
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

  // Auto-retry logic for severe errors
  useEffect(() => {
    if (lastError && filteredMembers.length === 0 && retryCounter < 2) {
      const timer = setTimeout(() => {
        console.log(`Auto-retry attempt ${retryCounter + 1}/2`);
        setRetryCounter(prev => prev + 1);
        forceRefresh();
      }, 5000); // 5 second delay between auto-retries
      
      return () => clearTimeout(timer);
    }
  }, [lastError, filteredMembers.length, retryCounter, forceRefresh]);

  const handleRetry = () => {
    toast.info("Tentative de reconnexion...");
    setRetryCounter(0); // Reset counter on manual retry
    forceRefresh();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestion des Adhérents</CardTitle>
          <div className="flex items-center gap-2">
            {lastError && (
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1 text-amber-500 border-amber-500 hover:bg-amber-50"
                onClick={() => toast.info(`Erreur réseau: ${lastError.message}`)}
              >
                <AlertTriangle className="h-4 w-4" />
                Erreur réseau
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRetry}
              className="flex items-center gap-1"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Chargement...' : 'Recharger'}
            </Button>
          </div>
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
