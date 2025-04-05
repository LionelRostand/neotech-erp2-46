
import { useState } from 'react';
import { Prospect, ProspectFormData, ReminderData } from '../../types/crm-types';
import { toast } from 'sonner';
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useNavigate } from 'react-router-dom';

export const useProspectActions = (
  prospects: Prospect[],
  setProspects: React.Dispatch<React.SetStateAction<Prospect[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { addDocument, updateDocument, deleteDocument } = useFirestore();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  // Add a new prospect
  const handleAddProspect = async (formData: ProspectFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const newProspect: Omit<Prospect, 'id'> = {
        company: formData.company,
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        // Backward compatibility fields
        name: formData.name || formData.contactName,
        email: formData.email || formData.contactEmail,
        phone: formData.phone || formData.contactPhone,
        source: formData.source,
        industry: formData.industry,
        status: formData.status,
        lastContact: formData.lastContact || new Date().toISOString().split('T')[0],
        notes: formData.notes,
        website: formData.website,
        address: formData.address,
        size: formData.size,
        estimatedValue: formData.estimatedValue,
        createdAt: new Date().toISOString(),
      };
      
      const id = await addDocument(COLLECTIONS.CRM.PROSPECTS, newProspect);
      
      const newProspectWithId = { id, ...newProspect } as Prospect;
      setProspects(prev => [newProspectWithId, ...prev]);
      toast.success("Prospect ajouté avec succès");
      return id;
    } catch (error) {
      console.error('Error adding prospect:', error);
      setError('Erreur lors de l\'ajout du prospect');
      toast.error("Erreur lors de l'ajout du prospect");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing prospect
  const handleUpdateProspect = async (id: string, formData: ProspectFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedProspect = {
        company: formData.company,
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        // Backward compatibility fields
        name: formData.name || formData.contactName,
        email: formData.email || formData.contactEmail,
        phone: formData.phone || formData.contactPhone,
        source: formData.source,
        status: formData.status,
        lastContact: formData.lastContact || new Date().toISOString().split('T')[0],
        notes: formData.notes,
        industry: formData.industry,
        website: formData.website,
        address: formData.address,
        size: formData.size,
        estimatedValue: formData.estimatedValue,
      };
      
      await updateDocument(COLLECTIONS.CRM.PROSPECTS, id, updatedProspect);
      
      setProspects(prev => prev.map(prospect => 
        prospect.id === id 
          ? { ...prospect, ...updatedProspect }
          : prospect
      ));
      
      toast.success("Prospect mis à jour avec succès");
      return true;
    } catch (error) {
      console.error('Error updating prospect:', error);
      setError('Erreur lors de la mise à jour du prospect');
      toast.error("Erreur lors de la mise à jour du prospect");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete a prospect
  const handleDeleteProspect = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await deleteDocument(COLLECTIONS.CRM.PROSPECTS, id);
      setProspects(prev => prev.filter(prospect => prospect.id !== id));
      toast.success("Prospect supprimé avec succès");
      return true;
    } catch (error) {
      console.error('Error deleting prospect:', error);
      setError('Erreur lors de la suppression du prospect');
      toast.error("Erreur lors de la suppression du prospect");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Add a reminder for a prospect
  const handleAddReminder = async (prospectId: string, reminderData: ReminderData) => {
    setLoading(true);
    setError(null);
    
    try {
      const newReminder = {
        title: reminderData.title,
        date: reminderData.date,
        completed: false,
        notes: reminderData.notes || reminderData.note || '', // For backward compatibility
        prospectId,
        createdAt: new Date().toISOString(),
      };
      
      const reminderId = await addDocument(COLLECTIONS.CRM.REMINDERS, newReminder);
      toast.success("Rappel ajouté avec succès");
      return reminderId;
    } catch (error) {
      console.error('Error adding reminder:', error);
      setError('Erreur lors de l\'ajout du rappel');
      toast.error("Erreur lors de l'ajout du rappel");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Convert a prospect to a client
  const handleConvertToClient = async (prospect: Prospect) => {
    setLoading(true);
    setError(null);
    
    try {
      // Create a new client from the prospect
      const newClient = {
        name: prospect.company,
        sector: prospect.industry || 'Non spécifié',
        revenue: '0',
        status: 'active',
        contactName: prospect.contactName,
        contactEmail: prospect.contactEmail,
        contactPhone: prospect.contactPhone || '',
        address: prospect.address || '',
        website: prospect.website || '',
        description: '',
        notes: prospect.notes || '',
        createdAt: new Date().toISOString(),
        customerSince: new Date().toISOString().split('T')[0]
      };
      
      // Add the client to Firestore
      const clientId = await addDocument(COLLECTIONS.CRM.CLIENTS, newClient);
      
      // Update the prospect status or mark as converted
      await updateDocument(COLLECTIONS.CRM.PROSPECTS, prospect.id, {
        status: 'qualified',
        convertedToClientId: clientId,
        convertedAt: new Date().toISOString()
      });
      
      // Update the local state
      setProspects(prev => prev.map(p => 
        p.id === prospect.id 
          ? { ...p, status: 'qualified', convertedToClientId: clientId, convertedAt: new Date().toISOString() }
          : p
      ));
      
      toast.success("Prospect converti en client avec succès");
      
      // Optionally navigate to the client page
      navigate(`/modules/crm/clients?highlight=${clientId}`);
      
      return clientId;
    } catch (error) {
      console.error('Error converting prospect to client:', error);
      setError('Erreur lors de la conversion du prospect en client');
      toast.error("Erreur lors de la conversion du prospect en client");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    handleAddProspect,
    handleUpdateProspect,
    handleDeleteProspect,
    handleAddReminder,
    handleConvertToClient,
    error
  };
};
