
import React, { useState, useEffect } from 'react';
import { Plus, Filter, MoreVertical, Search } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useProspects } from './hooks/useProspects';
import ProspectsTable from './prospects/ProspectsTable';
import ProspectsGrid from './prospects/ProspectsGrid';
import AddProspectDialog from './prospects/AddProspectDialog';
import EditProspectDialog from './prospects/EditProspectDialog';
import DeleteProspectDialog from './prospects/DeleteProspectDialog';
import ViewProspectDetails from './prospects/ViewProspectDetails';
import ConvertToClientDialog from './prospects/ConvertToClientDialog';
import ReminderDialog from './reminders/ReminderDialog';
import { Prospect, ProspectFormData } from './types/crm-types';
import { toast } from 'sonner';
import { useProspectDialogs } from './hooks/prospect/useProspectDialogs';
import DashboardLayout from '@/components/DashboardLayout';

const CrmProspects: React.FC = () => {
  const { 
    prospects, 
    isLoading, 
    error, 
    addProspect, 
    updateProspect, 
    deleteProspect, 
    convertToClient 
  } = useProspects();

  const [view, setView] = useState<'list' | 'grid'>('list');
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [formData, setFormData] = useState<ProspectFormData>({} as ProspectFormData);
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false);
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);

  const dialogs = useProspectDialogs(
    setSelectedProspect,
    setFormData,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    setIsViewDetailsOpen,
    setIsConvertDialogOpen,
    setIsReminderDialogOpen
  );

  // Filter prospects based on filter and search term
  const filteredProspects = prospects.filter(prospect => {
    const matchesFilter = filter === 'all' || prospect.status === filter;
    const matchesSearch = searchTerm === '' || 
      prospect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });
  
  // Handle adding a new prospect
  const handleAddProspect = async (data: ProspectFormData) => {
    const success = await addProspect(data);
    if (success) {
      setIsAddDialogOpen(false);
      toast.success('Prospect ajouté avec succès');
    }
  };
  
  // Handle updating a prospect
  const handleUpdateProspect = async (data: ProspectFormData) => {
    if (!selectedProspect) return;
    
    const success = await updateProspect(selectedProspect.id, data);
    if (success) {
      setIsEditDialogOpen(false);
      toast.success('Prospect mis à jour avec succès');
    }
  };
  
  // Handle deleting a prospect
  const handleDeleteProspect = async () => {
    if (!selectedProspect) return;
    
    const success = await deleteProspect(selectedProspect.id);
    if (success) {
      setIsDeleteDialogOpen(false);
      toast.success('Prospect supprimé avec succès');
    }
  };
  
  // Handle converting a prospect to a client
  const handleConvertToClient = async () => {
    if (!selectedProspect) return;
    
    const clientId = await convertToClient(selectedProspect);
    if (clientId) {
      setIsConvertDialogOpen(false);
      toast.success('Prospect converti en client avec succès');
    }
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 sm:mb-0">Prospects</h1>
          
          <div className="flex gap-2 self-end sm:self-auto">
            <Button 
              onClick={() => dialogs.openAddDialog()} 
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Nouveau prospect
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Exporter</DropdownMenuItem>
                <DropdownMenuItem>Importer</DropdownMenuItem>
                <DropdownMenuItem>Paramètres</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher des prospects..."
              className="pl-8"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  Filtrer
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilter('all')}>Tous</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('new')}>Nouveaux</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('contacted')}>Contactés</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('meeting')}>Rendez-vous</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('proposal')}>Proposition</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('negotiation')}>Négociation</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Tabs defaultValue="list" onValueChange={(value) => setView(value as 'list' | 'grid')}>
              <TabsList>
                <TabsTrigger value="list">Liste</TabsTrigger>
                <TabsTrigger value="grid">Grille</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        <Card>
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-destructive">Erreur lors du chargement des prospects</p>
            </div>
          ) : filteredProspects.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">Aucun prospect trouvé</p>
            </div>
          ) : (
            <Tabs defaultValue="list" value={view}>
              <TabsContent value="list" className="m-0">
                <ProspectsTable 
                  prospects={filteredProspects} 
                  onEdit={dialogs.openEditDialog}
                  onDelete={dialogs.openDeleteDialog}
                  onViewDetails={dialogs.openViewDetails}
                  onConvert={dialogs.openConvertDialog}
                  onReminder={dialogs.openReminderDialog}
                />
              </TabsContent>
              <TabsContent value="grid" className="m-0">
                <ProspectsGrid 
                  prospects={filteredProspects}
                  onEdit={dialogs.openEditDialog}
                  onDelete={dialogs.openDeleteDialog}
                  onViewDetails={dialogs.openViewDetails}
                  onConvert={dialogs.openConvertDialog}
                />
              </TabsContent>
            </Tabs>
          )}
        </Card>
        
        {/* Dialogs */}
        <AddProspectDialog 
          isOpen={isAddDialogOpen} 
          onClose={() => setIsAddDialogOpen(false)} 
          onAdd={handleAddProspect} 
        />
        
        {selectedProspect && (
          <>
            <EditProspectDialog 
              isOpen={isEditDialogOpen} 
              onClose={() => setIsEditDialogOpen(false)} 
              prospect={selectedProspect}
              onUpdate={handleUpdateProspect} 
            />
            
            <DeleteProspectDialog 
              isOpen={isDeleteDialogOpen} 
              onClose={() => setIsDeleteDialogOpen(false)} 
              prospect={selectedProspect}
              onDelete={handleDeleteProspect} 
            />
            
            <ViewProspectDetails 
              isOpen={isViewDetailsOpen} 
              onClose={() => setIsViewDetailsOpen(false)} 
              prospect={selectedProspect} 
            />
            
            <ConvertToClientDialog 
              isOpen={isConvertDialogOpen} 
              onClose={() => setIsConvertDialogOpen(false)} 
              prospect={selectedProspect}
              onConvert={handleConvertToClient} 
            />
            
            <ReminderDialog 
              isOpen={isReminderDialogOpen} 
              onClose={() => setIsReminderDialogOpen(false)} 
              relatedTo={{
                type: 'prospect',
                id: selectedProspect.id,
                name: selectedProspect.name
              }} 
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CrmProspects;
