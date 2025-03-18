
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, File, FileText, PlusCircle, Download, Eye, FileEdit, Trash2 } from 'lucide-react';

const EmployeesDocuments: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample documents data
  const documents = [
    { 
      id: 1, 
      name: 'Attestation de travail', 
      employee: 'Thomas Martin',
      type: 'Administratif',
      uploadDate: '2025-01-15', 
      fileType: 'PDF',
      fileSize: '245 Ko'
    },
    { 
      id: 2, 
      name: 'Fiche de paie - Janvier 2025', 
      employee: 'Thomas Martin',
      type: 'Paie',
      uploadDate: '2025-02-05', 
      fileType: 'PDF',
      fileSize: '189 Ko'
    },
    { 
      id: 3, 
      name: 'Contrat de travail', 
      employee: 'Sophie Dubois',
      type: 'Contrat',
      uploadDate: '2024-02-10', 
      fileType: 'PDF',
      fileSize: '450 Ko'
    },
    { 
      id: 4, 
      name: 'Avenant contrat', 
      employee: 'Jean Dupont',
      type: 'Contrat',
      uploadDate: '2024-12-01', 
      fileType: 'PDF',
      fileSize: '210 Ko'
    },
    { 
      id: 5, 
      name: 'Certificat médical', 
      employee: 'Marie Lambert',
      type: 'Médical',
      uploadDate: '2025-01-20', 
      fileType: 'PDF',
      fileSize: '180 Ko'
    }
  ];

  // Document categories
  const categories = [
    'Tous les types',
    'Administratif',
    'Contrat',
    'Évaluation',
    'Formation',
    'Médical',
    'Paie'
  ];
  
  // Document types by category - Changed variable name to avoid redeclaration
  const documentTypesByCategory: {[key: string]: string[]} = {
    'Administratif': ['Attestation de travail', 'Justificatif de domicile', 'Pièce d\'identité'],
    'Contrat': ['Contrat de travail', 'Avenant', 'Rupture conventionnelle'],
    'Évaluation': ['Évaluation annuelle', 'Évaluation d\'essai', 'Objectifs'],
    'Formation': ['Certificat', 'Diplôme', 'Attestation de formation'],
    'Médical': ['Certificat médical', 'Visite médicale', 'Arrêt de travail'],
    'Paie': ['Fiche de paie', 'Solde de tout compte', 'Prime']
  };
  
  // Filter documents based on search query
  const filteredDocuments = documents.filter(
    doc => 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // State for the new document dialog
  const [selectedCategory, setSelectedCategory] = useState('');
  const [documentTypeOptions, setDocumentTypeOptions] = useState<string[]>([]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Documents RH</h2>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un document
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau document</DialogTitle>
              <DialogDescription>
                Complétez les informations et téléchargez le document à associer à un employé.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="employee" className="text-sm font-medium">Employé *</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un employé" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="thomas">Thomas Martin</SelectItem>
                      <SelectItem value="sophie">Sophie Dubois</SelectItem>
                      <SelectItem value="jean">Jean Dupont</SelectItem>
                      <SelectItem value="marie">Marie Lambert</SelectItem>
                      <SelectItem value="pierre">Pierre Durand</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">Catégorie *</label>
                  <Select onValueChange={(value) => {
                    setSelectedCategory(value);
                    setDocumentTypeOptions(documentTypesByCategory[value] || []);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(documentTypesByCategory).map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="type" className="text-sm font-medium">Type de document *</label>
                  <Select disabled={!selectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder={selectedCategory ? "Sélectionner un type" : "Sélectionnez d'abord une catégorie"} />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCategory && documentTypeOptions.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Nom du document *</label>
                  <Input id="name" placeholder="Ex: Contrat CDI" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="file" className="text-sm font-medium">Fichier *</label>
                <Input id="file" type="file" />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <textarea 
                  id="description" 
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  rows={3}
                  placeholder="Description du document..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Annuler</Button>
              <Button type="submit">Ajouter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="all">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="all">Tous les documents</TabsTrigger>
                <TabsTrigger value="contracts">Contrats</TabsTrigger>
                <TabsTrigger value="admin">Administratif</TabsTrigger>
                <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
                <TabsTrigger value="payroll">Paie</TabsTrigger>
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
            
            <TabsContent value="all" className="m-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Employé</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date d'ajout</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Taille</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.length > 0 ? (
                      filteredDocuments.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 text-muted-foreground mr-2" />
                              {doc.name}
                            </div>
                          </TableCell>
                          <TableCell>{doc.employee}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {doc.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(doc.uploadDate).toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell>{doc.fileType}</TableCell>
                          <TableCell>{doc.fileSize}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <FileEdit className="h-4 w-4" />
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
                          Aucun document trouvé
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="contracts" className="m-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Employé</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date d'ajout</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Taille</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.filter(doc => doc.type === 'Contrat').length > 0 ? (
                      filteredDocuments
                        .filter(doc => doc.type === 'Contrat')
                        .map((doc) => (
                          <TableRow key={doc.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 text-muted-foreground mr-2" />
                                {doc.name}
                              </div>
                            </TableCell>
                            <TableCell>{doc.employee}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {doc.type}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(doc.uploadDate).toLocaleDateString('fr-FR')}</TableCell>
                            <TableCell>{doc.fileType}</TableCell>
                            <TableCell>{doc.fileSize}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <FileEdit className="h-4 w-4" />
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
                          Aucun document trouvé
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="admin" className="m-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Employé</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date d'ajout</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Taille</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.filter(doc => doc.type === 'Administratif').length > 0 ? (
                      filteredDocuments
                        .filter(doc => doc.type === 'Administratif')
                        .map((doc) => (
                          <TableRow key={doc.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 text-muted-foreground mr-2" />
                                {doc.name}
                              </div>
                            </TableCell>
                            <TableCell>{doc.employee}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {doc.type}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(doc.uploadDate).toLocaleDateString('fr-FR')}</TableCell>
                            <TableCell>{doc.fileType}</TableCell>
                            <TableCell>{doc.fileSize}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <FileEdit className="h-4 w-4" />
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
                          Aucun document trouvé
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="evaluations" className="m-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Employé</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date d'ajout</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Taille</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.filter(doc => doc.type === 'Évaluation').length > 0 ? (
                      filteredDocuments
                        .filter(doc => doc.type === 'Évaluation')
                        .map((doc) => (
                          <TableRow key={doc.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 text-muted-foreground mr-2" />
                                {doc.name}
                              </div>
                            </TableCell>
                            <TableCell>{doc.employee}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {doc.type}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(doc.uploadDate).toLocaleDateString('fr-FR')}</TableCell>
                            <TableCell>{doc.fileType}</TableCell>
                            <TableCell>{doc.fileSize}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <FileEdit className="h-4 w-4" />
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
                          Aucun document trouvé
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="payroll" className="m-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Employé</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date d'ajout</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Taille</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.filter(doc => doc.type === 'Paie').length > 0 ? (
                      filteredDocuments
                        .filter(doc => doc.type === 'Paie')
                        .map((doc) => (
                          <TableRow key={doc.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 text-muted-foreground mr-2" />
                                {doc.name}
                              </div>
                            </TableCell>
                            <TableCell>{doc.employee}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {doc.type}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(doc.uploadDate).toLocaleDateString('fr-FR')}</TableCell>
                            <TableCell>{doc.fileType}</TableCell>
                            <TableCell>{doc.fileSize}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <FileEdit className="h-4 w-4" />
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
                          Aucun document trouvé
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
    </div>
  );
};

export default EmployeesDocuments;
