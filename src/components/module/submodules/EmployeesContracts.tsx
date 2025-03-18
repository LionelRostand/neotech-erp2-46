
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Plus, FileText, Download, Eye, Edit, Trash2 } from 'lucide-react';

const EmployeesContracts: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  
  // Sample contracts data
  const contracts = [
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
  ];
  
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Gestion des contrats</h2>
        <Dialog>
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
              <Button variant="outline">Annuler</Button>
              <Button type="submit">Enregistrer</Button>
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
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
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
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
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
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
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
    </div>
  );
};

export default EmployeesContracts;
