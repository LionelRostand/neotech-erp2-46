
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Document {
  id: number;
  name: string;
  employee: string;
  type: string;
  uploadDate: string;
  fileType: string;
  fileSize: string;
  description?: string;
}

const EmployeesDocuments: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [editedDocument, setEditedDocument] = useState<Partial<Document>>({});
  const [isDownloading, setIsDownloading] = useState(false);
  
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
  
  // Document types by category
  const documentTypesByCategory: {[key: string]: string[]} = {
    'Administratif': ['Attestation de travail', 'Justificatif de domicile', 'Pièce d\'identité'],
    'Contrat': ['Contrat de travail', 'Avenant', 'Rupture conventionnelle'],
    'Évaluation': ['Évaluation annuelle', 'Évaluation d\'essai', 'Objectifs'],
    'Formation': ['Certificat', 'Diplôme', 'Attestation de formation'],
    'Médical': ['Certificat médical', 'Visite médicale', 'Arrêt de travail'],
    'Paie': ['Fiche de paie', 'Solde de tout compte', 'Prime']
  };
  
  // Sample documents data
  const [documents, setDocuments] = useState<Document[]>([
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
  ]);
  
  // Filter documents based on search query
  const filteredDocuments = documents.filter(
    doc => 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // State for the new document dialog
  const [selectedCategory, setSelectedCategory] = useState('');
  const [documentTypes, setDocumentTypes] = useState<string[]>([]);
  const [newDocumentType, setNewDocumentType] = useState('');
  const [newDocumentName, setNewDocumentName] = useState('');
  const [newDocumentEmployee, setNewDocumentEmployee] = useState('');
  const [newDocumentDescription, setNewDocumentDescription] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleAddDocument = () => {
    if (!newDocumentName || !selectedCategory || !newDocumentEmployee) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    if (!uploadedFile) {
      toast.error("Veuillez sélectionner un fichier");
      return;
    }
    
    const newDocument: Document = {
      id: documents.length + 1,
      name: newDocumentName,
      employee: newDocumentEmployee,
      type: selectedCategory,
      uploadDate: new Date().toISOString().split('T')[0],
      fileType: uploadedFile.name.split('.').pop()?.toUpperCase() || 'PDF',
      fileSize: `${Math.round(uploadedFile.size / 1024)} Ko`,
      description: newDocumentDescription || undefined
    };
    
    setDocuments([...documents, newDocument]);
    resetForm();
    toast.success("Document ajouté avec succès");
  };

  const handleEditDocument = () => {
    if (!selectedDocument) return;
    
    // Mise à jour du document
    const updatedDocuments = documents.map(doc => 
      doc.id === selectedDocument.id
        ? { ...doc, ...editedDocument }
        : doc
    );
    
    setDocuments(updatedDocuments);
    toast.success("Document mis à jour avec succès");
    setIsEditDialogOpen(false);
  };

  const handleDeleteDocument = () => {
    if (!selectedDocument) return;
    
    // Suppression du document
    const updatedDocuments = documents.filter(doc => doc.id !== selectedDocument.id);
    setDocuments(updatedDocuments);
    
    toast.success("Document supprimé avec succès");
    setIsDeleteDialogOpen(false);
  };

  const handleDownloadDocument = (document: Document) => {
    setIsDownloading(true);
    
    // Simulation de téléchargement
    setTimeout(() => {
      toast.success(`Le document "${document.name}" a été téléchargé`);
      setIsDownloading(false);
    }, 1500);
  };

  const resetForm = () => {
    setNewDocumentName('');
    setSelectedCategory('');
    setNewDocumentType('');
    setNewDocumentEmployee('');
    setNewDocumentDescription('');
    setUploadedFile(null);
    setDocumentTypes([]);
    setIsAddDialogOpen(false);
  };

  const openViewDialog = (document: Document) => {
    setSelectedDocument(document);
    setIsViewDialogOpen(true);
  };

  const openEditDialog = (document: Document) => {
    setSelectedDocument(document);
    setEditedDocument({
      name: document.name,
      type: document.type,
      description: document.description || ''
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (document: Document) => {
    setSelectedDocument(document);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Documents RH</h2>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                  <Select onValueChange={setNewDocumentEmployee}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un employé" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Thomas Martin">Thomas Martin</SelectItem>
                      <SelectItem value="Sophie Dubois">Sophie Dubois</SelectItem>
                      <SelectItem value="Jean Dupont">Jean Dupont</SelectItem>
                      <SelectItem value="Marie Lambert">Marie Lambert</SelectItem>
                      <SelectItem value="Pierre Durand">Pierre Durand</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">Catégorie *</label>
                  <Select onValueChange={(value) => {
                    setSelectedCategory(value);
                    setDocumentTypes(documentTypesByCategory[value] || []);
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
                  <Select 
                    disabled={!selectedCategory} 
                    onValueChange={setNewDocumentType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={selectedCategory ? "Sélectionner un type" : "Sélectionnez d'abord une catégorie"} />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCategory && documentTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Nom du document *</label>
                  <Input 
                    id="name" 
                    placeholder="Ex: Contrat CDI" 
                    value={newDocumentName}
                    onChange={(e) => setNewDocumentName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="file" className="text-sm font-medium">Fichier *</label>
                <Input 
                  id="file" 
                  type="file" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadedFile(e.target.files[0]);
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <textarea 
                  id="description" 
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  rows={3}
                  placeholder="Description du document..."
                  value={newDocumentDescription}
                  onChange={(e) => setNewDocumentDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetForm}>Annuler</Button>
              <Button type="submit" onClick={handleAddDocument}>Ajouter</Button>
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
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openViewDialog(doc)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDownloadDocument(doc)}
                              disabled={isDownloading}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openEditDialog(doc)}
                            >
                              <FileEdit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openDeleteDialog(doc)}
                            >
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
            
            {/* Les autres onglets utilisent le même template mais avec des filtres différents */}
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
                              <Button variant="ghost" size="icon" onClick={() => openViewDialog(doc)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDownloadDocument(doc)}>
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => openEditDialog(doc)}>
                                <FileEdit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(doc)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          Aucun document de type contrat trouvé
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            {/* Autres onglets avec le même format que 'contracts' */}
            <TabsContent value="admin" className="m-0">
              <div className="text-center py-8 text-gray-500">
                Documents administratifs filtrés (utilisez le même format que l'onglet précédent)
              </div>
            </TabsContent>
            
            <TabsContent value="evaluations" className="m-0">
              <div className="text-center py-8 text-gray-500">
                Documents d'évaluation filtrés (utilisez le même format que l'onglet précédent)
              </div>
            </TabsContent>
            
            <TabsContent value="payroll" className="m-0">
              <div className="text-center py-8 text-gray-500">
                Documents de paie filtrés (utilisez le même format que l'onglet précédent)
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialog for viewing document details */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Détails du document</DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-6 py-4">
              <div className="bg-gray-50 p-6 rounded-md text-center">
                <FileText className="h-16 w-16 mx-auto text-blue-500 mb-4" />
                <h3 className="text-lg font-semibold mb-1">{selectedDocument.name}</h3>
                <Badge variant="outline" className="mb-4">
                  {selectedDocument.type}
                </Badge>
                
                <div className="grid grid-cols-2 gap-4 mt-6 text-left">
                  <div>
                    <p className="text-sm text-gray-500">Employé</p>
                    <p className="font-medium">{selectedDocument.employee}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date d'ajout</p>
                    <p>{new Date(selectedDocument.uploadDate).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Format</p>
                    <p>{selectedDocument.fileType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Taille</p>
                    <p>{selectedDocument.fileSize}</p>
                  </div>
                </div>
                
                {selectedDocument.description && (
                  <div className="mt-4 text-left">
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="mt-1">{selectedDocument.description}</p>
                  </div>
                )}
              </div>
              
              <div className="border-t pt-4">
                <Button 
                  variant="outline" 
                  className="w-full mb-2"
                  onClick={() => handleDownloadDocument(selectedDocument)}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <span className="h-4 w-4 border-2 border-current border-r-transparent animate-spin rounded-full mr-2"></span>
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  Télécharger le document
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => {
                if (selectedDocument) {
                  openEditDialog(selectedDocument);
                  setIsViewDialogOpen(false);
                }
              }}
            >
              <FileEdit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
            <Button onClick={() => setIsViewDialogOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for editing document */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier le document</DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nom du document</Label>
                <Input 
                  id="edit-name" 
                  value={editedDocument.name || selectedDocument.name}
                  onChange={(e) => setEditedDocument({ ...editedDocument, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-type">Type de document</Label>
                <Select 
                  value={editedDocument.type || selectedDocument.type}
                  onValueChange={(value) => setEditedDocument({ ...editedDocument, type: value })}
                >
                  <SelectTrigger id="edit-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(documentTypesByCategory).map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea 
                  id="edit-description" 
                  rows={3}
                  value={editedDocument.description || selectedDocument.description || ''}
                  onChange={(e) => setEditedDocument({ ...editedDocument, description: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-file">Remplacer le fichier (optionnel)</Label>
                <Input id="edit-file" type="file" />
                <p className="text-xs text-gray-500">Laissez vide pour conserver le fichier actuel</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleEditDocument}>Enregistrer les modifications</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for confirming deletion */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce document ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le document sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteDocument}
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

export default EmployeesDocuments;
