
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Plus, FileText, Download, Eye, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Contract {
  id: number;
  employee: string;
  type: string;
  startDate: string;
  endDate: string | null;
  status: 'Actif' | 'Expiré';
  department: string;
  file?: string;
}

const EmployeesContracts: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [editedContract, setEditedContract] = useState<Partial<Contract>>({});
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Sample contracts data
  const [contracts, setContracts] = useState<Contract[]>([
    { 
      id: 1, 
      employee: 'Thomas Martin', 
      type: 'CDI',
      startDate: '2024-01-15', 
      endDate: null, 
      status: 'Actif',
      department: 'Marketing'
    },
    { 
      id: 2, 
      employee: 'Sophie Dubois', 
      type: 'CDD',
      startDate: '2024-02-01', 
      endDate: '2024-08-01', 
      status: 'Actif',
      department: 'Développement'
    },
    { 
      id: 3, 
      employee: 'Jean Dupont', 
      type: 'CDI',
      startDate: '2023-10-01', 
      endDate: null, 
      status: 'Actif',
      department: 'Finance'
    },
    { 
      id: 4, 
      employee: 'Marie Lambert', 
      type: 'CDD',
      startDate: '2023-11-15', 
      endDate: '2024-02-15', 
      status: 'Expiré',
      department: 'Ressources Humaines'
    },
    { 
      id: 5, 
      employee: 'Pierre Durand', 
      type: 'Alternance',
      startDate: '2024-01-01', 
      endDate: '2025-01-01', 
      status: 'Actif',
      department: 'Développement'
    },
  ]);
  
  // Filter contracts based on search query and active tab
  const filteredContracts = contracts.filter(
    contract => 
      (contract.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.department.toLowerCase().includes(searchQuery.toLowerCase())) &&
      ((activeTab === 'active' && contract.status === 'Actif') ||
      (activeTab === 'expired' && contract.status === 'Expiré') ||
      activeTab === 'all')
  );

  const handleAddContract = () => {
    // Simulation d'ajout
    toast.success("Contrat ajouté avec succès");
    setIsAddDialogOpen(false);
  };

  const handleEditContract = () => {
    if (!selectedContract) return;
    
    // Mise à jour du contrat
    const updatedContracts = contracts.map(contract => 
      contract.id === selectedContract.id
        ? { ...contract, ...editedContract }
        : contract
    );
    
    setContracts(updatedContracts);
    toast.success("Contrat mis à jour avec succès");
    setIsEditDialogOpen(false);
  };

  const handleDeleteContract = () => {
    if (!selectedContract) return;
    
    // Suppression du contrat
    const updatedContracts = contracts.filter(contract => contract.id !== selectedContract.id);
    setContracts(updatedContracts);
    
    toast.success("Contrat supprimé avec succès");
    setIsDeleteDialogOpen(false);
  };

  const handleDownloadContract = (contract: Contract) => {
    setIsDownloading(true);
    
    // Simulation de téléchargement
    setTimeout(() => {
      toast.success(`Le contrat de ${contract.employee} a été téléchargé`);
      setIsDownloading(false);
    }, 1500);
  };

  const openViewDialog = (contract: Contract) => {
    setSelectedContract(contract);
    setIsViewDialogOpen(true);
  };

  const openEditDialog = (contract: Contract) => {
    setSelectedContract(contract);
    setEditedContract({
      employee: contract.employee,
      type: contract.type,
      startDate: contract.startDate,
      endDate: contract.endDate,
      department: contract.department
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (contract: Contract) => {
    setSelectedContract(contract);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Gestion des contrats</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau contrat
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau contrat</DialogTitle>
              <DialogDescription>
                Complétez les informations du contrat. Les champs marqués d'un * sont obligatoires.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="employee" className="text-sm font-medium">Employé *</label>
                  <Input id="employee" placeholder="Sélectionner un employé" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="type" className="text-sm font-medium">Type de contrat *</label>
                  <Input id="type" placeholder="CDI, CDD, etc." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="startDate" className="text-sm font-medium">Date de début *</label>
                  <Input id="startDate" type="date" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="endDate" className="text-sm font-medium">Date de fin</label>
                  <Input id="endDate" type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="file" className="text-sm font-medium">Document du contrat *</label>
                <Input id="file" type="file" />
              </div>
              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">Notes</label>
                <textarea 
                  id="notes" 
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  rows={3}
                  placeholder="Informations supplémentaires sur le contrat..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Annuler</Button>
              <Button type="submit" onClick={handleAddContract}>Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="active">Contrats actifs</TabsTrigger>
                <TabsTrigger value="expired">Contrats expirés</TabsTrigger>
                <TabsTrigger value="all">Tous les contrats</TabsTrigger>
              </TabsList>
              
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher..."
                  className="w-[250px] pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <TabsContent value="active" className="m-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employé</TableHead>
                      <TableHead>Département</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date de début</TableHead>
                      <TableHead>Date de fin</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContracts.length > 0 ? (
                      filteredContracts.map((contract) => (
                        <TableRow key={contract.id}>
                          <TableCell className="font-medium">{contract.employee}</TableCell>
                          <TableCell>{contract.department}</TableCell>
                          <TableCell>{contract.type}</TableCell>
                          <TableCell>{new Date(contract.startDate).toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell>{contract.endDate ? new Date(contract.endDate).toLocaleDateString('fr-FR') : 'Indéterminé'}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={contract.status === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}>
                              {contract.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openViewDialog(contract)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDownloadContract(contract)}
                              disabled={isDownloading}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openEditDialog(contract)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openDeleteDialog(contract)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          Aucun contrat trouvé
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="expired" className="m-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employé</TableHead>
                      <TableHead>Département</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date de début</TableHead>
                      <TableHead>Date de fin</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContracts.length > 0 ? (
                      filteredContracts.map((contract) => (
                        <TableRow key={contract.id}>
                          <TableCell className="font-medium">{contract.employee}</TableCell>
                          <TableCell>{contract.department}</TableCell>
                          <TableCell>{contract.type}</TableCell>
                          <TableCell>{new Date(contract.startDate).toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell>{contract.endDate ? new Date(contract.endDate).toLocaleDateString('fr-FR') : 'Indéterminé'}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={contract.status === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}>
                              {contract.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openViewDialog(contract)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDownloadContract(contract)}
                              disabled={isDownloading}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openEditDialog(contract)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openDeleteDialog(contract)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          Aucun contrat trouvé
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="all" className="m-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employé</TableHead>
                      <TableHead>Département</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date de début</TableHead>
                      <TableHead>Date de fin</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContracts.length > 0 ? (
                      filteredContracts.map((contract) => (
                        <TableRow key={contract.id}>
                          <TableCell className="font-medium">{contract.employee}</TableCell>
                          <TableCell>{contract.department}</TableCell>
                          <TableCell>{contract.type}</TableCell>
                          <TableCell>{new Date(contract.startDate).toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell>{contract.endDate ? new Date(contract.endDate).toLocaleDateString('fr-FR') : 'Indéterminé'}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={contract.status === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}>
                              {contract.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openViewDialog(contract)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDownloadContract(contract)}
                              disabled={isDownloading}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openEditDialog(contract)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openDeleteDialog(contract)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          Aucun contrat trouvé
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-md font-medium">Contrats en expiration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-md bg-amber-50 flex items-start">
                <FileText className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Sophie Dubois - CDD</h4>
                  <p className="text-xs text-muted-foreground">Expire le 01/08/2024 (dans 3 mois)</p>
                </div>
              </div>
              <div className="p-4 border rounded-md bg-amber-50 flex items-start">
                <FileText className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Pierre Durand - Alternance</h4>
                  <p className="text-xs text-muted-foreground">Expire le 01/01/2025 (dans 8 mois)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-md font-medium">Types de contrats</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                  3
                </div>
                <div className="ml-3">
                  <h4 className="font-medium text-sm">CDI</h4>
                  <p className="text-xs text-muted-foreground">Contrats à durée indéterminée</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-medium">
                  1
                </div>
                <div className="ml-3">
                  <h4 className="font-medium text-sm">CDD</h4>
                  <p className="text-xs text-muted-foreground">Contrats à durée déterminée</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-medium">
                  1
                </div>
                <div className="ml-3">
                  <h4 className="font-medium text-sm">Alternance</h4>
                  <p className="text-xs text-muted-foreground">Contrats d'alternance</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog for viewing contract details */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Détails du contrat</DialogTitle>
          </DialogHeader>
          {selectedContract && (
            <div className="space-y-4 py-4">
              <div className="bg-gray-50 p-6 rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{selectedContract.employee}</h3>
                    <p className="text-sm text-gray-500 mb-4">{selectedContract.department}</p>
                  </div>
                  <Badge variant="outline" className={selectedContract.status === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}>
                    {selectedContract.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div>
                    <p className="text-sm text-gray-500">Type de contrat</p>
                    <p className="font-medium">{selectedContract.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Département</p>
                    <p>{selectedContract.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date de début</p>
                    <p>{new Date(selectedContract.startDate).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date de fin</p>
                    <p>{selectedContract.endDate ? new Date(selectedContract.endDate).toLocaleDateString('fr-FR') : 'Indéterminé'}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleDownloadContract(selectedContract)}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <span className="h-4 w-4 border-2 border-current border-r-transparent animate-spin rounded-full mr-2"></span>
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  Télécharger le contrat
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => {
                if (selectedContract) {
                  openEditDialog(selectedContract);
                  setIsViewDialogOpen(false);
                }
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
            <Button onClick={() => setIsViewDialogOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for editing contract */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier le contrat</DialogTitle>
          </DialogHeader>
          {selectedContract && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-employee" className="text-sm font-medium">Employé</label>
                  <Input 
                    id="edit-employee" 
                    value={editedContract.employee || selectedContract.employee}
                    onChange={(e) => setEditedContract({ ...editedContract, employee: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-type" className="text-sm font-medium">Type de contrat</label>
                  <Select 
                    value={editedContract.type || selectedContract.type}
                    onValueChange={(value) => setEditedContract({ ...editedContract, type: value })}
                  >
                    <SelectTrigger id="edit-type">
                      <SelectValue placeholder="Type de contrat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CDI">CDI</SelectItem>
                      <SelectItem value="CDD">CDD</SelectItem>
                      <SelectItem value="Alternance">Alternance</SelectItem>
                      <SelectItem value="Stage">Stage</SelectItem>
                      <SelectItem value="Intérim">Intérim</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-startDate" className="text-sm font-medium">Date de début</label>
                  <Input 
                    id="edit-startDate" 
                    type="date" 
                    value={editedContract.startDate || selectedContract.startDate}
                    onChange={(e) => setEditedContract({ ...editedContract, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-endDate" className="text-sm font-medium">Date de fin</label>
                  <Input 
                    id="edit-endDate" 
                    type="date" 
                    value={editedContract.endDate || selectedContract.endDate || ''}
                    onChange={(e) => setEditedContract({ ...editedContract, endDate: e.target.value || null })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-department" className="text-sm font-medium">Département</label>
                <Input 
                  id="edit-department" 
                  value={editedContract.department || selectedContract.department}
                  onChange={(e) => setEditedContract({ ...editedContract, department: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-file" className="text-sm font-medium">Document du contrat (optionnel)</label>
                <Input id="edit-file" type="file" />
                <p className="text-xs text-gray-500">Laissez vide pour conserver le document actuel</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-notes" className="text-sm font-medium">Notes</label>
                <Textarea 
                  id="edit-notes" 
                  rows={3}
                  placeholder="Informations supplémentaires sur le contrat..."
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleEditContract}>Enregistrer les modifications</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for confirmation of deletion */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce contrat ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le contrat sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteContract}
              className="bg-red-500 hover:bg-red-600"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EmployeesContracts;
