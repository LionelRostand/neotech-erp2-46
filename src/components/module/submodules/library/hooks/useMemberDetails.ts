
import { useState } from 'react';
import { useSafeFirestore } from '@/hooks/use-safe-firestore';
import { useToast } from '@/hooks/use-toast';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Member, MemberWithLoans } from '../types/library-types';

export const useMemberDetails = () => {
  const [selectedMember, setSelectedMember] = useState<MemberWithLoans | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isEditingMember, setIsEditingMember] = useState(false);
  
  const loansCollection = useSafeFirestore(COLLECTIONS.LIBRARY.LOANS);
  const { toast } = useToast();

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

  const handleEditMember = (member: Member) => {
    setSelectedMember({ ...member, loans: [] });
    setIsEditingMember(true);
  };

  const resetMemberForms = () => {
    setIsAddingMember(false);
    setIsEditingMember(false);
  };

  return {
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
  };
};
