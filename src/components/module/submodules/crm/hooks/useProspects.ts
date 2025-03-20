
import { useState, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';
import { where, orderBy } from 'firebase/firestore';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Prospect, ProspectFormData, ReminderData } from '../types/crm-types';
import { toast } from 'sonner';

export const useProspects = () => {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false);
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState<ProspectFormData>({
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'warm',
    source: 'Site web',
    lastContact: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [reminderData, setReminderData] = useState<ReminderData>({
    type: 'email',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  const sourcesOptions = ['Site web', 'LinkedIn', 'Salon', 'Recommandation', 'Appel entrant', 'Email', 'Autre'];
  const prospectCollection = useFirestore(COLLECTIONS.CRM);

  // Charger les prospects depuis Firestore
  useEffect(() => {
    const loadProspects = async () => {
      try {
        setLoading(true);
        const constraints = [
          where('type', '==', 'prospect'),
          orderBy('lastContact', 'desc')
        ];
        
        const data = await prospectCollection.getAll(constraints);
        
        // Formater les données pour correspondre à notre interface Prospect
        const formattedData = data.map(doc => {
          const createdAtTimestamp = doc.createdAt as Timestamp;
          const lastContactTimestamp = doc.lastContact as Timestamp;
          
          return {
            id: doc.id,
            name: doc.name || '',
            company: doc.company || '',
            email: doc.email || '',
            phone: doc.phone || '',
            status: doc.status || 'warm',
            source: doc.source || '',
            createdAt: createdAtTimestamp ? createdAtTimestamp.toDate().toISOString().split('T')[0] : '',
            lastContact: lastContactTimestamp ? lastContactTimestamp.toDate().toISOString().split('T')[0] : '',
            notes: doc.notes || ''
          } as Prospect;
        });
        
        setProspects(formattedData);
      } catch (error) {
        console.error("Erreur lors du chargement des prospects:", error);
        toast.error("Impossible de charger les prospects");
      } finally {
        setLoading(false);
      }
    };
    
    loadProspects();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      status: 'warm',
      source: 'Site web',
      lastContact: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  const handleCreateProspect = async () => {
    try {
      const newProspectData = {
        ...formData,
        type: 'prospect',
        createdAt: Timestamp.now(),
        lastContact: Timestamp.fromDate(new Date(formData.lastContact))
      };
      
      const result = await prospectCollection.add(newProspectData);
      
      const newProspect: Prospect = {
        id: result.id,
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
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
      // Mettre à jour le type de 'prospect' à 'client'
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
      // Dans un cas réel, cela pourrait être intégré à un système de notifications
      // Pour cet exemple, nous allons simplement ajouter une note avec la date de relance
      const reminderNote = `Relance prévue (${reminderData.type}): ${reminderData.date} - ${reminderData.note}`;
      
      await prospectCollection.update(selectedProspect.id, {
        notes: selectedProspect.notes + '\n\n' + reminderNote,
        lastContact: Timestamp.now()
      });
      
      // Mettre à jour les données locales
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
      setReminderData({
        type: 'email',
        date: new Date().toISOString().split('T')[0],
        note: ''
      });
      
      toast.success("Relance programmée avec succès");
    } catch (error) {
      console.error("Erreur lors de la programmation de la relance:", error);
      toast.error("Impossible de programmer la relance");
    }
  };

  const openEditDialog = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setFormData({
      name: prospect.name,
      company: prospect.company,
      email: prospect.email,
      phone: prospect.phone,
      status: prospect.status,
      source: prospect.source,
      lastContact: prospect.lastContact,
      notes: prospect.notes
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setIsDeleteDialogOpen(true);
  };

  const openConvertDialog = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setIsConvertDialogOpen(true);
  };

  const viewProspectDetails = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setIsViewDetailsOpen(true);
  };

  const openReminderDialog = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setIsReminderDialogOpen(true);
  };

  // Filtrer les prospects en fonction du terme de recherche et du filtre de statut
  const filteredProspects = prospects.filter(prospect => {
    const matchesSearch = 
      prospect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? prospect.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'hot':
        return 'bg-red-100 text-red-800';
      case 'warm':
        return 'bg-orange-100 text-orange-800';
      case 'cold':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'hot':
        return 'Chaud';
      case 'warm':
        return 'Tiède';
      case 'cold':
        return 'Froid';
      default:
        return status;
    }
  };

  return {
    prospects,
    filteredProspects,
    loading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isViewDetailsOpen,
    setIsViewDetailsOpen,
    isConvertDialogOpen,
    setIsConvertDialogOpen,
    isReminderDialogOpen,
    setIsReminderDialogOpen,
    selectedProspect,
    formData,
    reminderData,
    setReminderData,
    sourcesOptions,
    handleInputChange,
    handleSelectChange,
    resetForm,
    handleCreateProspect,
    handleUpdateProspect,
    handleDeleteProspect,
    handleConvertToClient,
    handleScheduleReminder,
    openEditDialog,
    openDeleteDialog,
    openConvertDialog,
    viewProspectDetails,
    openReminderDialog,
    getStatusBadgeClass,
    getStatusText
  };
};
