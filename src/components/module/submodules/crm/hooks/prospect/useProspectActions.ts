
import { Timestamp } from 'firebase/firestore';
import { Prospect, ProspectFormData, ReminderData } from '../../types/crm-types';
import { toast } from 'sonner';

export const useProspectActions = (
  prospectCollection: any,
  prospects: Prospect[],
  setProspects: React.Dispatch<React.SetStateAction<Prospect[]>>,
  formData: ProspectFormData,
  reminderData: ReminderData,
  selectedProspect: Prospect | null,
  setIsAddDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsConvertDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsReminderDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedProspect: React.Dispatch<React.SetStateAction<Prospect | null>>,
  resetForm: () => void
) => {
  const handleCreateProspect = async () => {
    try {
      const newProspectData = {
        ...formData,
        type: 'prospect',
        createdAt: Timestamp.now(),
        lastContact: Timestamp.fromDate(new Date(formData.lastContact))
      };
      
      const { id } = await prospectCollection.add(newProspectData);
      
      const newProspect: Prospect = {
        id,
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        status: formData.status,
        source: formData.source,
        lastContact: formData.lastContact,
        createdAt: new Date().toISOString().split('T')[0],
        notes: formData.notes
      };
      
      setProspects(prev => [newProspect, ...prev]);
      setIsAddDialogOpen(false);
      resetForm();
      toast.success("Prospect ajouté avec succès");
    } catch (error) {
      console.error("Erreur lors de la création du prospect:", error);
      toast.error("Impossible de créer le prospect");
    }
  };

  const handleUpdateProspect = async () => {
    if (!selectedProspect) return;
    
    try {
      const updateData = {
        ...formData,
        lastContact: Timestamp.fromDate(new Date(formData.lastContact))
      };
      
      await prospectCollection.update(selectedProspect.id, updateData);
      
      setProspects(prev => 
        prev.map(prospect => 
          prospect.id === selectedProspect.id 
            ? { ...prospect, ...formData } 
            : prospect
        )
      );
      
      setIsEditDialogOpen(false);
      resetForm();
      toast.success("Prospect mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du prospect:", error);
      toast.error("Impossible de mettre à jour le prospect");
    }
  };

  const handleDeleteProspect = async () => {
    if (!selectedProspect) return;
    
    try {
      await prospectCollection.remove(selectedProspect.id);
      
      setProspects(prev => prev.filter(prospect => prospect.id !== selectedProspect.id));
      setIsDeleteDialogOpen(false);
      setSelectedProspect(null);
      toast.success("Prospect supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression du prospect:", error);
      toast.error("Impossible de supprimer le prospect");
    }
  };

  const handleConvertToClient = async () => {
    if (!selectedProspect) return;
    
    try {
      await prospectCollection.update(selectedProspect.id, {
        type: 'client',
        convertedAt: Timestamp.now()
      });
      
      setProspects(prev => prev.filter(prospect => prospect.id !== selectedProspect.id));
      setIsConvertDialogOpen(false);
      setSelectedProspect(null);
      toast.success("Prospect converti en client avec succès");
    } catch (error) {
      console.error("Erreur lors de la conversion du prospect:", error);
      toast.error("Impossible de convertir le prospect en client");
    }
  };

  const handleScheduleReminder = async () => {
    if (!selectedProspect) return;
    
    try {
      const reminderNote = `Relance prévue (${reminderData.type}): ${reminderData.date} - ${reminderData.note}`;
      
      await prospectCollection.update(selectedProspect.id, {
        notes: selectedProspect.notes + '\n\n' + reminderNote,
        lastContact: Timestamp.now()
      });
      
      setProspects(prev => 
        prev.map(prospect => 
          prospect.id === selectedProspect.id 
            ? { 
                ...prospect, 
                notes: prospect.notes + '\n\n' + reminderNote,
                lastContact: new Date().toISOString().split('T')[0]
              } 
            : prospect
        )
      );
      
      setIsReminderDialogOpen(false);
      
      toast.success("Relance programmée avec succès");
    } catch (error) {
      console.error("Erreur lors de la programmation de la relance:", error);
      toast.error("Impossible de programmer la relance");
    }
  };

  return {
    handleCreateProspect,
    handleUpdateProspect,
    handleDeleteProspect,
    handleConvertToClient,
    handleScheduleReminder
  };
};
