import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSafeFirestore } from '@/hooks/use-safe-firestore';
import { useToast } from '@/hooks/use-toast';
import { LIBRARY_MEMBERS } from '@/lib/firebase-collections';
import { Member } from '../types/library-types';

export const useMembersData = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  
  const membersCollection = useSafeFirestore(LIBRARY_MEMBERS);
  const { toast } = useToast();

  // Filter members based on search query
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return members;
    
    const query = searchQuery.toLowerCase();
    return members.filter(member => 
      member.firstName?.toLowerCase().includes(query) ||
      member.lastName?.toLowerCase().includes(query) ||
      member.email?.toLowerCase().includes(query) ||
      member.membershipId?.toLowerCase().includes(query)
    );
  }, [members, searchQuery]);

  const fetchMembers = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log("Fetching members data...");
      const data = await membersCollection.getAll();
      console.log("Members data received:", data);
      setMembers(data as Member[]);
      setRetryCount(0); // reset retry count on success
    } catch (error) {
      console.error("Error fetching members:", error);
      if (retryCount < 3) {
        console.log(`Retrying fetch (${retryCount + 1}/3)...`);
        setRetryCount(prev => prev + 1);
        // Wait a bit before retrying
        setTimeout(() => {
          membersCollection.resetFetchState();
          fetchMembers();
        }, 1500);
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de charger les adhérents après plusieurs tentatives",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [membersCollection, toast, retryCount]);

  useEffect(() => {
    fetchMembers();
    
    // Add a listener for online status to retry fetching when connection is restored
    const handleOnline = () => {
      console.log("Browser is online, retrying members fetch...");
      membersCollection.resetFetchState();
      fetchMembers();
    };
    
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [fetchMembers, membersCollection]);

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

  const forceRefresh = () => {
    membersCollection.resetFetchState();
    setRetryCount(0);
    fetchMembers();
  };

  return {
    members,
    filteredMembers,
    isLoading,
    searchQuery,
    setSearchQuery,
    handleAddMember,
    handleUpdateMember: membersCollection.update,
    handleDeleteMember: membersCollection.remove,
    forceRefresh
  };
};
