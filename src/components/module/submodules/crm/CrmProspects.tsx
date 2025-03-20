
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  UserPlus, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Thermometer, 
  Mail, 
  Phone,
  ArrowUpRight
} from "lucide-react";
import { toast } from "sonner";

// Types for prospects
interface Prospect {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'hot' | 'warm' | 'cold';
  source: string;
  createdAt: string;
  lastContact: string;
  notes: string;
}

// Mock data for prospects
const mockProspects: Prospect[] = [
  {
    id: '1',
    name: 'Sophie Martin',
    company: 'Innovatech',
    email: 'sophie@innovatech.fr',
    phone: '+33612345678',
    status: 'hot',
    source: 'Salon',
    createdAt: '2023-12-15',
    lastContact: '2024-03-18',
    notes: 'Très intéressée par notre solution CRM'
  },
  {
    id: '2',
    name: 'Thomas Dubois',
    company: 'ConsultPro',
    email: 'thomas@consultpro.fr',
    phone: '+33623456789',
    status: 'warm',
    source: 'Site web',
    createdAt: '2024-01-10',
    lastContact: '2024-03-01',
    notes: 'A demandé un devis pour 10 licences'
  },
  {
    id: '3',
    name: 'Camille Leroy',
    company: 'MédiaSanté',
    email: 'camille@mediasante.fr',
    phone: '+33634567890',
    status: 'cold',
    source: 'LinkedIn',
    createdAt: '2024-02-05',
    lastContact: '2024-02-20',
    notes: 'Intéressée mais budget limité actuellement'
  }
];

const sourcesOptions = ['Site web', 'LinkedIn', 'Salon', 'Recommandation', 'Appel entrant', 'Email', 'Autre'];

const CrmProspects: React.FC = () => {
  const [prospects, setProspects] = useState<Prospect[]>(mockProspects);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  
  const [formData, setFormData] = useState<Omit<Prospect, 'id' | 'createdAt'>>({
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'warm',
    source: '',
    lastContact: new Date().toISOString().split('T')[0],
    notes: ''
  });

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
      source: '',
      lastContact: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  const handleCreateProspect = () => {
    const newProspect: Prospect = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setProspects(prev => [newProspect, ...prev]);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success("Prospect ajouté avec succès");
  };

  const handleUpdateProspect = () => {
    if (!selectedProspect) return;
    
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
  };

  const handleDeleteProspect = () => {
    if (!selectedProspect) return;
    
    setProspects(prev => prev.filter(prospect => prospect.id !== selectedProspect.id));
    setIsDeleteDialogOpen(false);
    setSelectedProspect(null);
    toast.success("Prospect supprimé avec succès");
  };

  const handleConvertToClient = () => {
    if (!selectedProspect) return;
    
    // In a real app, this would create a client from the prospect
    // and potentially delete or mark the prospect as converted
    
    // For demo purposes, just remove the prospect
    setProspects(prev => prev.filter(prospect => prospect.id !== selectedProspect.id));
    setIsConvertDialogOpen(false);
    setSelectedProspect(null);
    
    toast.success("Prospect converti en client avec succès");
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

  // Filter prospects based on search term and status filter
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Prospects</h2>
        <Button onClick={() => {
          resetForm();
          setIsAddDialogOpen(true);
        }}>
          <UserPlus className="mr-2 h-4 w-4" />
          Ajouter un prospect
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Rechercher un prospect..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <Thermometer className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les statuts</SelectItem>
              <SelectItem value="hot">Chaud</SelectItem>
              <SelectItem value="warm">Tiède</SelectItem>
              <SelectItem value="cold">Froid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Entreprise</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Dernier contact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProspects.length > 0 ? (
              filteredProspects.map(prospect => (
                <TableRow key={prospect.id} className="cursor-pointer hover:bg-muted/50" onClick={() => viewProspectDetails(prospect)}>
                  <TableCell className="font-medium">{prospect.name}</TableCell>
                  <TableCell>{prospect.company}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs text-blue-600">{prospect.email}</span>
                      <span className="text-xs">{prospect.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(prospect.status)}`}>
                      {getStatusText(prospect.status)}
                    </span>
                  </TableCell>
                  <TableCell>{prospect.source}</TableCell>
                  <TableCell>{new Date(prospect.lastContact).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2" onClick={e => e.stopPropagation()}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditDialog(prospect);
                        }}
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteDialog(prospect);
                        }}
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openConvertDialog(prospect);
                        }}
                        title="Convertir en client"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  Aucun prospect trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Add Prospect Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau prospect</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nom du contact"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Entreprise</label>
              <Input
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Nom de l'entreprise"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="email@exemple.com"
                type="email"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Téléphone</label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+33612345678"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Statut</label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value as 'hot' | 'warm' | 'cold')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hot">Chaud</SelectItem>
                  <SelectItem value="warm">Tiède</SelectItem>
                  <SelectItem value="cold">Froid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Source</label>
              <Select
                value={formData.source}
                onValueChange={(value) => handleSelectChange('source', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une source" />
                </SelectTrigger>
                <SelectContent>
                  {sourcesOptions.map(source => (
                    <SelectItem key={source} value={source}>{source}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Date de dernier contact</label>
              <Input
                name="lastContact"
                value={formData.lastContact}
                onChange={handleInputChange}
                type="date"
              />
            </div>
            
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Input
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Notes sur le prospect"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateProspect}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Prospect Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier le prospect</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            {/* Same form fields as Add Prospect */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nom du contact"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Entreprise</label>
              <Input
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Nom de l'entreprise"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="email@exemple.com"
                type="email"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Téléphone</label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+33612345678"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Statut</label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value as 'hot' | 'warm' | 'cold')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hot">Chaud</SelectItem>
                  <SelectItem value="warm">Tiède</SelectItem>
                  <SelectItem value="cold">Froid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Source</label>
              <Select
                value={formData.source}
                onValueChange={(value) => handleSelectChange('source', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une source" />
                </SelectTrigger>
                <SelectContent>
                  {sourcesOptions.map(source => (
                    <SelectItem key={source} value={source}>{source}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Date de dernier contact</label>
              <Input
                name="lastContact"
                value={formData.lastContact}
                onChange={handleInputChange}
                type="date"
              />
            </div>
            
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Input
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Notes sur le prospect"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdateProspect}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le prospect {selectedProspect?.name} ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProspect} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Convert to Client Dialog */}
      <AlertDialog open={isConvertDialogOpen} onOpenChange={setIsConvertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Convertir en client</AlertDialogTitle>
            <AlertDialogDescription>
              Convertir {selectedProspect?.name} en client ? Cette action transformera ce prospect en client actif dans votre CRM.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConvertToClient} className="bg-green-600 hover:bg-green-700 text-white">
              Convertir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Prospect Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Détails du prospect</DialogTitle>
          </DialogHeader>
          
          {selectedProspect && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">{selectedProspect.name}</h2>
                  <p className="text-muted-foreground">{selectedProspect.company}</p>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(selectedProspect.status)}`}>
                  {getStatusText(selectedProspect.status)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Informations de contact</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a href={`mailto:${selectedProspect.email}`} className="text-blue-600 hover:underline">
                        {selectedProspect.email}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a href={`tel:${selectedProspect.phone}`} className="text-blue-600 hover:underline">
                        {selectedProspect.phone}
                      </a>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Informations supplémentaires</h3>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="font-medium">Source:</span> {selectedProspect.source}
                    </div>
                    <div>
                      <span className="font-medium">Date de création:</span> {new Date(selectedProspect.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                    <div>
                      <span className="font-medium">Dernier contact:</span> {new Date(selectedProspect.lastContact).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </Card>
              </div>
              
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Notes</h3>
                <p>{selectedProspect.notes || "Aucune note disponible."}</p>
              </Card>
              
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Activités récentes</h3>
                <div className="space-y-3">
                  <div className="border-b pb-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Email envoyé</span>
                      <span className="text-xs text-muted-foreground">Il y a 3 jours</span>
                    </div>
                    <p className="text-sm">Suivi de la proposition commerciale</p>
                  </div>
                  <div className="border-b pb-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Appel téléphonique</span>
                      <span className="text-xs text-muted-foreground">Il y a 1 semaine</span>
                    </div>
                    <p className="text-sm">Présentation de nos services</p>
                  </div>
                </div>
              </Card>
            </div>
          )}
          
          <DialogFooter className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)}>
              Fermer
            </Button>
            <Button 
              onClick={() => {
                setIsViewDetailsOpen(false);
                openEditDialog(selectedProspect!);
              }}
            >
              Modifier
            </Button>
            <Button 
              variant="default"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                setIsViewDetailsOpen(false);
                openConvertDialog(selectedProspect!);
              }}
            >
              Convertir en client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CrmProspects;
