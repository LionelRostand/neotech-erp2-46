import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, Trash, Phone, Mail, Calendar, MapPin, Building, User, Tag, FileText, Clock } from 'lucide-react';
import { useProspects } from '../hooks/useProspects';
import { useNotes } from '../hooks/useNotes';
import { useActivities } from '../hooks/useActivities';
import { Prospect } from '../types';
import ProspectNotes from './ProspectNotes';
import ProspectActivities from './ProspectActivities';
import ProspectTasks from './ProspectTasks';
import ProspectFiles from './ProspectFiles';
import ProspectEditDialog from './ProspectEditDialog';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const ProspectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProspectById, updateProspect, deleteProspect } = useProspects();
  const { getProspectNotes } = useNotes();
  const { getProspectActivities } = useActivities();
  
  const [prospect, setProspect] = useState<Prospect | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [notes, setNotes] = useState([]);
  const [activities, setActivities] = useState([]);
  
  useEffect(() => {
    if (id) {
      try {
        const prospectData = getProspectById(id);
        if (prospectData) {
          setProspect(prospectData);
          setNotes(getProspectNotes(id));
          setActivities(getProspectActivities(id));
        } else {
          toast.error("Prospect non trouvé");
          navigate('/modules/crm/prospects');
        }
      } catch (error) {
        if (typeof error === 'object' && error !== null && 'message' in error) {
          toast.error(`Erreur: ${error.message}`);
        } else {
          toast.error("Une erreur est survenue lors du chargement du prospect");
        }
        navigate('/modules/crm/prospects');
      }
    }
  }, [id, getProspectById, getProspectNotes, getProspectActivities, navigate]);
  
  const handleEditProspect = () => {
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteProspect = () => {
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (id) {
      deleteProspect(id);
      toast.success("Prospect supprimé avec succès");
      navigate('/modules/crm/prospects');
    }
  };
  
  const handleProspectUpdate = (updatedProspect: Prospect) => {
    updateProspect(updatedProspect);
    setProspect(updatedProspect);
    setIsEditDialogOpen(false);
    toast.success("Prospect mis à jour avec succès");
  };
  
  if (!prospect) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-100 text-blue-800">Nouveau</Badge>;
      case 'contacted':
        return <Badge className="bg-yellow-100 text-yellow-800">Contacté</Badge>;
      case 'qualified':
        return <Badge className="bg-green-100 text-green-800">Qualifié</Badge>;
      case 'proposal':
        return <Badge className="bg-purple-100 text-purple-800">Proposition</Badge>;
      case 'negotiation':
        return <Badge className="bg-orange-100 text-orange-800">Négociation</Badge>;
      case 'won':
        return <Badge className="bg-emerald-100 text-emerald-800">Gagné</Badge>;
      case 'lost':
        return <Badge className="bg-red-100 text-red-800">Perdu</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={() => navigate('/modules/crm/prospects')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleEditProspect}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDeleteProspect}>
            <Trash className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{prospect.firstName} {prospect.lastName}</CardTitle>
              <div className="text-sm text-muted-foreground mt-1">{prospect.title} {prospect.company && `chez ${prospect.company}`}</div>
            </div>
            <div className="flex flex-col items-end">
              {getStatusBadge(prospect.status)}
              <div className="text-sm text-muted-foreground mt-2">
                <Clock className="inline-block mr-1 h-3 w-3" />
                Ajouté le {new Date(prospect.createdAt).toLocaleDateString('fr-FR')}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="notes">Notes ({notes.length})</TabsTrigger>
              <TabsTrigger value="activities">Activités ({activities.length})</TabsTrigger>
              <TabsTrigger value="tasks">Tâches</TabsTrigger>
              <TabsTrigger value="files">Fichiers</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Informations de contact</h3>
                  
                  <div className="space-y-3">
                    {prospect.email && (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <a href={`mailto:${prospect.email}`} className="text-blue-600 hover:underline">{prospect.email}</a>
                      </div>
                    )}
                    
                    {prospect.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <a href={`tel:${prospect.phone}`} className="text-blue-600 hover:underline">{prospect.phone}</a>
                      </div>
                    )}
                    
                    {prospect.address && (
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                        <span>{prospect.address}</span>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <h3 className="text-lg font-medium">Informations professionnelles</h3>
                  
                  <div className="space-y-3">
                    {prospect.company && (
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{prospect.company}</span>
                      </div>
                    )}
                    
                    {prospect.title && (
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{prospect.title}</span>
                      </div>
                    )}
                    
                    {prospect.industry && (
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{prospect.industry}</span>
                      </div>
                    )}
                    
                    {prospect.website && (
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                        <a href={prospect.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {prospect.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Détails</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Dernier contact: {prospect.lastContactDate ? new Date(prospect.lastContactDate).toLocaleDateString('fr-FR') : 'Jamais'}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Source: {prospect.source || 'Non spécifiée'}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Valeur estimée: {prospect.estimatedValue ? `${prospect.estimatedValue.toLocaleString('fr-FR')} €` : 'Non spécifiée'}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {prospect.notes && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Notes</h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">{prospect.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notes">
              <ProspectNotes prospectId={prospect.id} />
            </TabsContent>
            
            <TabsContent value="activities">
              <ProspectActivities prospectId={prospect.id} />
            </TabsContent>
            
            <TabsContent value="tasks">
              <ProspectTasks prospectId={prospect.id} />
            </TabsContent>
            
            <TabsContent value="files">
              <ProspectFiles prospectId={prospect.id} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <ProspectEditDialog 
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        prospect={prospect}
        onSave={handleProspectUpdate}
      />
      
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Supprimer le prospect"
        description={`Êtes-vous sûr de vouloir supprimer ${prospect.firstName} ${prospect.lastName} ? Cette action est irréversible.`}
      />
    </div>
  );
};

export default ProspectDetails;
