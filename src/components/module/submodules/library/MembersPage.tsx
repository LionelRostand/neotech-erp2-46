import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSafeFirestore } from '@/hooks/use-safe-firestore';
import { LIBRARY_MEMBERS, LIBRARY_LOANS } from '@/lib/firebase-collections';
import { useToast } from '@/hooks/use-toast';
import MembersTable from './members/MembersTable';
import MemberDetailsSheet from './members/MemberDetailsSheet';
import MemberForm from './members/MemberForm';
import MembersToolbar from './members/MembersToolbar';
import SubscriptionPlans from './members/SubscriptionPlans';
import { Member, MemberWithLoans } from './types/library-types';

const MembersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<MemberWithLoans | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isEditingMember, setIsEditingMember] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const membersCollection = useSafeFirestore(LIBRARY_MEMBERS);
  const loansCollection = useSafeFirestore(LIBRARY_LOANS);
  const { toast } = useToast();

  const filteredMembers = React.useMemo(() => {
    if (!searchQuery.trim()) return members;
    
    const query = searchQuery.toLowerCase();
    return members.filter(member => 
      member.firstName.toLowerCase().includes(query) ||
      member.lastName.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query) ||
      member.membershipId.toLowerCase().includes(query)
    );
  }, [members, searchQuery]);

  React.useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      try {
        const data = await membersCollection.getAll();
        setMembers(data as Member[]);
      } catch (error) {
        console.error("Error fetching members:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les adhérents",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [membersCollection, toast]);

  const handleViewMemberDetails = async (member: Member) => {
    try {
      const loans = await loansCollection.getAll({ 
        memberId: member.id 
      });
      
      setSelectedMember({
        ...member,
        loans: loans || []
      });
      setIsDetailsOpen(true);
    } catch (error) {
      console.error("Error fetching member loans:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les emprunts de l'adhérent",
        variant: "destructive"
      });
    }
  };

  const handleAddMember = async (memberData: Omit<Member, "id" | "createdAt" | "membershipId">) => {
    try {
      const membershipId = `MEM-${Date.now().toString().slice(-8)}`;
      
      const newMember: Omit<Member, "id"> = {
        ...memberData,
        membershipId,
        createdAt: new Date().toISOString(),
        status: "active",
      };
      
      const result = await membersCollection.add(newMember);
      
      setMembers(prev => [...prev, { ...newMember, id: result.id }]);
      setIsAddingMember(false);
      
      toast({
        title: "Succès",
        description: "L'adhérent a été ajouté avec succès",
      });
    } catch (error) {
      console.error("Error adding member:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'adhérent",
        variant: "destructive"
      });
    }
  };

  const handleUpdateMember = async (id: string, memberData: Partial<Member>) => {
    try {
      await membersCollection.update(id, memberData);
      
      setMembers(prev => 
        prev.map(member => 
          member.id === id ? { ...member, ...memberData } : member
        )
      );
      
      if (selectedMember && selectedMember.id === id) {
        setSelectedMember({ ...selectedMember, ...memberData });
      }
      
      setIsEditingMember(false);
      
      toast({
        title: "Succès",
        description: "L'adhérent a été mis à jour avec succès",
      });
    } catch (error) {
      console.error("Error updating member:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'adhérent",
        variant: "destructive"
      });
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      await membersCollection.remove(id);
      
      setMembers(prev => prev.filter(member => member.id !== id));
      
      if (selectedMember && selectedMember.id === id) {
        setSelectedMember(null);
        setIsDetailsOpen(false);
      }
      
      toast({
        title: "Succès",
        description: "L'adhérent a été supprimé avec succès",
      });
    } catch (error) {
      console.error("Error deleting member:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'adhérent",
        variant: "destructive"
      });
    }
  };

  const handleEditMember = (member: Member) => {
    setSelectedMember({ ...member, loans: [] });
    setIsEditingMember(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Adhérents</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3 mb-6">
              <TabsTrigger value="list">Liste des adhérents</TabsTrigger>
              <TabsTrigger value="subscriptions">Abonnements</TabsTrigger>
              <TabsTrigger value="access">Points d'accès</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="space-y-4">
              <MembersToolbar 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onAddMember={() => setIsAddingMember(true)}
              />
              
              <MembersTable 
                members={filteredMembers}
                isLoading={isLoading}
                onViewDetails={handleViewMemberDetails}
                onEdit={handleEditMember}
                onDelete={handleDeleteMember}
              />
            </TabsContent>
            
            <TabsContent value="subscriptions">
              <SubscriptionPlans />
            </TabsContent>
            
            <TabsContent value="access">
              <div className="bg-slate-50 border rounded-md p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">Gestion des points d'accès</h3>
                <p className="text-slate-600 mb-4">
                  Cette section permet de configurer les différents points de vente/accès et de gérer les employés 
                  qui peuvent s'y connecter.
                </p>
                <div className="flex justify-center">
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-md text-amber-800 inline-block">
                    <p>Fonctionnalité en cours de développement.</p>
                  </div>
                </div>
              </div>
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
          onDelete={() => handleDeleteMember(selectedMember.id)}
        />
      )}

      <MemberForm
        isOpen={isAddingMember || isEditingMember}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddingMember(false);
            setIsEditingMember(false);
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
