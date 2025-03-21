import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSafeFirestore } from '@/hooks/use-safe-firestore';
import { useToast } from '@/hooks/use-toast';
import { LIBRARY_MEMBERS } from '@/lib/firebase-collections';
import { Member } from '../types/library-types';
import { toast } from 'sonner';

export const useMembersData = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState<Error | null>(null);
  
  const membersCollection = useSafeFirestore(LIBRARY_MEMBERS);
  const { toast: toastService } = useToast();

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
      
      if (Array.isArray(data) && data.length > 0) {
        setMembers(data as Member[]);
        setRetryCount(0); // reset retry count on success
        setLastError(null);
        return true;
      } else if (Array.isArray(data) && data.length === 0) {
        console.log("No members found, using sample data");
        // If no data returned, use sample data for development
        const sampleMembers: Member[] = [
          {
            id: "sample1",
            firstName: "Marie",
            lastName: "Durand",
            email: "marie.durand@example.com",
            membershipId: "MEM-12345678",
            phone: "06 12 34 56 78",
            address: "123 Rue de Paris, 75001 Paris",
            createdAt: new Date().toISOString(),
            status: "active",
            subscriptionType: "basic",
            notes: "Adhérente régulière depuis 2020"
          },
          {
            id: "sample2",
            firstName: "Thomas",
            lastName: "Martin",
            email: "thomas.martin@example.com",
            membershipId: "MEM-87654321",
            phone: "07 98 76 54 32",
            address: "456 Avenue Victor Hugo, 75016 Paris",
            createdAt: new Date().toISOString(),
            status: "active",
            subscriptionType: "premium",
            notes: "Intéressé par les ateliers littéraires"
          }
        ];
        setMembers(sampleMembers);
        setRetryCount(0);
        setLastError(null);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Error fetching members:", error);
      setLastError(error);
      
      // Show error toast only on first attempt
      if (retryCount === 0) {
        toast.error(`Erreur lors du chargement des adhérents: ${error.message}`);
      }
      
      if (retryCount < 3) {
        console.log(`Retrying fetch (${retryCount + 1}/3)...`);
        setRetryCount(prev => prev + 1);
        // Wait a bit before retrying
        setTimeout(() => {
          membersCollection.resetFetchState();
          fetchMembers();
        }, 3000); // Longer delay for network errors
      } else {
        toastService({
          title: "Erreur",
          description: "Impossible de charger les adhérents après plusieurs tentatives. Utilisez le bouton 'Recharger' pour réessayer.",
          variant: "destructive"
        });
        
        // Use sample data if after retries we still don't have data
        if (members.length === 0) {
          console.log("Using sample data after failed retries");
          const sampleMembers: Member[] = [
            {
              id: "sample1",
              firstName: "Marie",
              lastName: "Durand",
              email: "marie.durand@example.com",
              membershipId: "MEM-12345678",
              phone: "06 12 34 56 78",
              address: "123 Rue de Paris, 75001 Paris",
              createdAt: new Date().toISOString(),
              status: "active",
              subscriptionType: "basic",
              notes: "Adhérente régulière depuis 2020"
            },
            {
              id: "sample2",
              firstName: "Thomas",
              lastName: "Martin",
              email: "thomas.martin@example.com",
              membershipId: "MEM-87654321",
              phone: "07 98 76 54 32",
              address: "456 Avenue Victor Hugo, 75016 Paris",
              createdAt: new Date().toISOString(),
              status: "active",
              subscriptionType: "premium",
              notes: "Intéressé par les ateliers littéraires"
            }
          ];
          setMembers(sampleMembers);
        }
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [membersCollection, toastService, retryCount, members.length]);

  useEffect(() => {
    console.log("useMembersData effect running, initializing fetch");
    fetchMembers();
    
    // Add a listener for online status to retry fetching when connection is restored
    const handleOnline = () => {
      console.log("Browser is online, retrying members fetch...");
      membersCollection.resetFetchState();
      fetchMembers();
    };
    
    window.addEventListener('online', handleOnline);
    
    return () => {
      console.log("useMembersData cleanup");
      window.removeEventListener('online', handleOnline);
    };
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
      
      toast.success("L'adhérent a été ajouté avec succès");
      return true;
    } catch (error: any) {
      console.error("Error adding member:", error);
      toast.error(`Impossible d'ajouter l'adhérent: ${error.message}`);
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
      
      toast.success("L'adhérent a été mis à jour avec succès");
      return true;
    } catch (error: any) {
      console.error("Error updating member:", error);
      toast.error(`Impossible de mettre à jour l'adhérent: ${error.message}`);
      return false;
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      await membersCollection.remove(id);
      
      setMembers(prev => prev.filter(member => member.id !== id));
      
      toast.success("L'adhérent a été supprimé avec succès");
      return true;
    } catch (error: any) {
      console.error("Error deleting member:", error);
      toast.error(`Impossible de supprimer l'adhérent: ${error.message}`);
      return false;
    }
  };

  const forceRefresh = () => {
    console.log("Force refreshing members data");
    membersCollection.reconnectAndRefetch();
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
    handleUpdateMember,
    handleDeleteMember,
    forceRefresh,
    lastError
  };
};
