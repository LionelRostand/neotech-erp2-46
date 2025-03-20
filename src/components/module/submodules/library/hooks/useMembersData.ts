
import { useState, useEffect, useMemo } from 'react';
import { useSafeFirestore } from '@/hooks/use-safe-firestore';
import { useToast } from '@/hooks/use-toast';
import { LIBRARY_MEMBERS } from '@/lib/firebase-collections';
import { Member } from '../types/library-types';

export const useMembersData = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  const membersCollection = useSafeFirestore(LIBRARY_MEMBERS);
  const { toast } = useToast();

  // Filter members based on search query
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return members;
    
    const query = searchQuery.toLowerCase();
    return members.filter(member => 
      member.firstName.toLowerCase().includes(query) ||
      member.lastName.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query) ||
      member.membershipId.toLowerCase().includes(query)
    );
  }, [members, searchQuery]);

  useEffect(() => {
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
      
      setMembers(prev => [...prev, { ...newMember, id: result.id } as Member]);
      
      toast({
        title: "Succès",
        description: "L'adhérent a été ajouté avec succès",
      });
      return true;
    } catch (error) {
      console.error("Error adding member:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'adhérent",
        variant: "destructive"
      });
      return false;
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
      
      toast({
        title: "Succès",
        description: "L'adhérent a été mis à jour avec succès",
      });
      return true;
    } catch (error) {
      console.error("Error updating member:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'adhérent",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      await membersCollection.remove(id);
      
      setMembers(prev => prev.filter(member => member.id !== id));
      
      toast({
        title: "Succès",
        description: "L'adhérent a été supprimé avec succès",
      });
      return true;
    } catch (error) {
      console.error("Error deleting member:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'adhérent",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    members,
    filteredMembers,
    isLoading,
    searchQuery,
    setSearchQuery,
    handleAddMember,
    handleUpdateMember,
    handleDeleteMember
  };
};
