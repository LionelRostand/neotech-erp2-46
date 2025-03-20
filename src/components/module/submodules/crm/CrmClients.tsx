
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
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  BarChart3 
} from "lucide-react";
import { toast } from "sonner";

// Sample client data
const mockClients = [
  { 
    id: '1', 
    name: 'Acme Corporation', 
    sector: 'Technologie', 
    revenue: '850000', 
    status: 'active',
    contactName: 'John Doe',
    contactEmail: 'john@acme.com',
    contactPhone: '+33612345678',
    address: '12 Rue de Paris, 75001 Paris'
  },
  { 
    id: '2', 
    name: 'Global Industries', 
    sector: 'Industrie', 
    revenue: '2500000', 
    status: 'active',
    contactName: 'Marie Martin',
    contactEmail: 'marie@global-ind.com',
    contactPhone: '+33698765432',
    address: '45 Avenue Victor Hugo, 69002 Lyon'
  },
  { 
    id: '3', 
    name: 'Tech Innovations', 
    sector: 'Technologie', 
    revenue: '375000', 
    status: 'inactive',
    contactName: 'Pierre Dubois',
    contactEmail: 'pierre@tech-innov.com',
    contactPhone: '+33601122334',
    address: '8 Rue Nationale, 44000 Nantes'
  },
];

const CrmClients: React.FC = () => {
  const [clients, setClients] = useState(mockClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    sector: '',
    revenue: '',
    status: 'active',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    address: ''
  });

  const sectors = ['Technologie', 'Industrie', 'Santé', 'Finance', 'Commerce', 'Services', 'Autres'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateClient = () => {
    const newClient = {
      id: Date.now().toString(),
      ...formData
    };
    
    setClients(prev => [newClient, ...prev]);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success("Client ajouté avec succès");
  };

  const handleUpdateClient = () => {
    if (!selectedClient) return;
    
    setClients(prev => 
      prev.map(client => 
        client.id === selectedClient.id 
          ? { ...client, ...formData } 
          : client
      )
    );
    
    setIsEditDialogOpen(false);
    resetForm();
    toast.success("Client mis à jour avec succès");
  };

  const handleDeleteClient = () => {
    if (!selectedClient) return;
    
    setClients(prev => prev.filter(client => client.id !== selectedClient.id));
    setIsDeleteDialogOpen(false);
    setSelectedClient(null);
    toast.success("Client supprimé avec succès");
  };

  const openEditDialog = (client: any) => {
    setSelectedClient(client);
    setFormData({
      name: client.name,
      sector: client.sector,
      revenue: client.revenue,
      status: client.status,
      contactName: client.contactName,
      contactEmail: client.contactEmail,
      contactPhone: client.contactPhone,
      address: client.address
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (client: any) => {
    setSelectedClient(client);
    setIsDeleteDialogOpen(true);
  };

  const viewClientDetails = (client: any) => {
    setSelectedClient(client);
    setIsViewDetailsOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      sector: '',
      revenue: '',
      status: 'active',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      address: ''
    });
  };

  // Filter clients based on search term and sector filter
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.contactName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = sectorFilter ? client.sector === sectorFilter : true;
    
    return matchesSearch && matchesSector;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Clients</h2>
        <Button onClick={() => {
          resetForm();
          setIsAddDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un client
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Rechercher un client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select
            value={sectorFilter}
            onValueChange={setSectorFilter}
          >
            <SelectTrigger className="w-[200px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Secteur d'activité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les secteurs</SelectItem>
              {sectors.map(sector => (
                <SelectItem key={sector} value={sector}>{sector}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Secteur</TableHead>
              <TableHead>CA (€)</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.length > 0 ? (
              filteredClients.map(client => (
                <TableRow key={client.id} className="cursor-pointer hover:bg-muted/50" onClick={() => viewClientDetails(client)}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.sector}</TableCell>
                  <TableCell>{parseInt(client.revenue).toLocaleString('fr-FR')} €</TableCell>
                  <TableCell>{client.contactName}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {client.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2" onClick={e => e.stopPropagation()}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditDialog(client);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteDialog(client);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  Aucun client trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Add Client Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau client</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom de l'entreprise</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nom de l'entreprise"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Secteur d'activité</label>
              <Select
                value={formData.sector}
                onValueChange={(value) => handleSelectChange('sector', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un secteur" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map(sector => (
                    <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Chiffre d'affaires (€)</label>
              <Input
                name="revenue"
                value={formData.revenue}
                onChange={handleInputChange}
                placeholder="0"
                type="number"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Statut</label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom du contact</label>
              <Input
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                placeholder="Nom du contact principal"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email du contact</label>
              <Input
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                placeholder="email@exemple.com"
                type="email"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Téléphone</label>
              <Input
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                placeholder="+33612345678"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Adresse</label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Adresse"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateClient}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Client Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier le client</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            {/* Same form fields as Add Client dialog */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom de l'entreprise</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nom de l'entreprise"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Secteur d'activité</label>
              <Select
                value={formData.sector}
                onValueChange={(value) => handleSelectChange('sector', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un secteur" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map(sector => (
                    <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Chiffre d'affaires (€)</label>
              <Input
                name="revenue"
                value={formData.revenue}
                onChange={handleInputChange}
                placeholder="0"
                type="number"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Statut</label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom du contact</label>
              <Input
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                placeholder="Nom du contact principal"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email du contact</label>
              <Input
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                placeholder="email@exemple.com"
                type="email"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Téléphone</label>
              <Input
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                placeholder="+33612345678"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Adresse</label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Adresse"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdateClient}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Êtes-vous sûr de vouloir supprimer le client "{selectedClient?.name}" ?</p>
            <p className="text-muted-foreground mt-2">Cette action est irréversible.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteClient}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Client Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Détails du client</DialogTitle>
          </DialogHeader>
          
          {selectedClient && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Informations générales</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Nom:</span> {selectedClient.name}</div>
                    <div><span className="font-medium">Secteur:</span> {selectedClient.sector}</div>
                    <div><span className="font-medium">CA:</span> {parseInt(selectedClient.revenue).toLocaleString('fr-FR')} €</div>
                    <div><span className="font-medium">Statut:</span> {selectedClient.status === 'active' ? 'Actif' : 'Inactif'}</div>
                    <div><span className="font-medium">Adresse:</span> {selectedClient.address}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Contact principal</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Nom:</span> {selectedClient.contactName}</div>
                    <div><span className="font-medium">Email:</span> {selectedClient.contactEmail}</div>
                    <div><span className="font-medium">Téléphone:</span> {selectedClient.contactPhone}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Statistiques</h3>
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4">
                    <div className="flex flex-col items-center">
                      <Users className="h-8 w-8 text-blue-500 mb-2" />
                      <div className="text-2xl font-bold">3</div>
                      <div className="text-sm text-muted-foreground">Contacts</div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex flex-col items-center">
                      <BarChart3 className="h-8 w-8 text-green-500 mb-2" />
                      <div className="text-2xl font-bold">12</div>
                      <div className="text-sm text-muted-foreground">Opportunités</div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex flex-col items-center">
                      <BarChart3 className="h-8 w-8 text-purple-500 mb-2" />
                      <div className="text-2xl font-bold">8</div>
                      <div className="text-sm text-muted-foreground">Interactions</div>
                    </div>
                  </Card>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Historique récent</h3>
                <div className="space-y-2">
                  <div className="p-2 border rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Appel téléphonique</span>
                      <span className="text-xs text-muted-foreground">Il y a 2 jours</span>
                    </div>
                    <p className="text-sm mt-1">Discussion sur le renouvellement du contrat</p>
                  </div>
                  <div className="p-2 border rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Email</span>
                      <span className="text-xs text-muted-foreground">Il y a 1 semaine</span>
                    </div>
                    <p className="text-sm mt-1">Envoi de la proposition commerciale</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)}>
              Fermer
            </Button>
            <Button 
              onClick={() => {
                setIsViewDetailsOpen(false);
                openEditDialog(selectedClient);
              }}
            >
              Modifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CrmClients;
