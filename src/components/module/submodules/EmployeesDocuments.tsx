
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Download, Edit, Trash2, FileText, Filter, Plus, Search, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import { employees } from '@/data/employees';

// Types
interface DocumentRH {
  id: string;
  title: string;
  type: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  size: string;
  owner: string;
  status: 'active' | 'archived';
  description: string;
  relatedEmployees: string[];
}

// Sample documents data
const initialDocuments: DocumentRH[] = [
  {
    id: 'DOC001',
    title: 'Charte informatique',
    type: 'PDF',
    category: 'Règlement intérieur',
    createdAt: '2023-03-10',
    updatedAt: '2023-03-15',
    size: '1.2 MB',
    owner: 'Service RH',
    status: 'active',
    description: 'Charte d\'utilisation des ressources informatiques de l\'entreprise',
    relatedEmployees: ['EMP001', 'EMP002', 'EMP003']
  },
  {
    id: 'DOC002',
    title: 'Guide des bonnes pratiques',
    type: 'DOCX',
    category: 'Guide',
    createdAt: '2023-02-05',
    updatedAt: '2023-02-05',
    size: '3.5 MB',
    owner: 'Direction',
    status: 'active',
    description: 'Guide des bonnes pratiques professionnelles à destination des nouveaux employés',
    relatedEmployees: []
  },
  {
    id: 'DOC003',
    title: 'Accord télétravail',
    type: 'PDF',
    category: 'Accord collectif',
    createdAt: '2022-11-18',
    updatedAt: '2023-01-10',
    size: '0.8 MB',
    owner: 'Service RH',
    status: 'active',
    description: 'Accord d\'entreprise sur le télétravail',
    relatedEmployees: ['EMP001', 'EMP003']
  }
];

const EmployeesDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentRH[]>(initialDocuments);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<DocumentRH | null>(null);
  
  // Dialog states
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Form state for editing or adding
  const [formData, setFormData] = useState<Partial<DocumentRH>>({
    title: '',
    type: 'PDF',
    category: '',
    description: '',
    relatedEmployees: []
  });
  
  // Selected employees for the document
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  
  // Filter documents based on search query
  const filteredDocuments = documents.filter(document =>
    document.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    document.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    document.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle viewing document details
  const handleViewDocument = (document: DocumentRH) => {
    setSelectedDocument(document);
    setIsViewDialogOpen(true);
  };
  
  // Handle editing document
  const handleEditDocument = (document: DocumentRH) => {
    setSelectedDocument(document);
    setFormData({
      title: document.title,
      type: document.type,
      category: document.category,
      description: document.description,
      relatedEmployees: document.relatedEmployees
    });
    setSelectedEmployees(document.relatedEmployees);
    setIsEditDialogOpen(true);
  };
  
  // Handle deleting document
  const handleDeleteDocument = (document: DocumentRH) => {
    setSelectedDocument(document);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle select change
  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle employee selection
  const handleEmployeeSelect = (employeeId: string) => {
    setSelectedEmployees(prev => {
      if (prev.includes(employeeId)) {
        return prev.filter(id => id !== employeeId);
      } else {
        return [...prev, employeeId];
      }
    });
  };
  
  // Handle document deletion confirmation
  const confirmDeleteDocument = () => {
    if (selectedDocument) {
      setDocuments(documents.filter(doc => doc.id !== selectedDocument.id));
      toast.success(`Document "${selectedDocument.title}" supprimé avec succès`);
      setIsDeleteDialogOpen(false);
      setSelectedDocument(null);
    }
  };
  
  // Handle document update
  const handleUpdateDocument = () => {
    if (selectedDocument && formData) {
      // Validate required fields
      if (!formData.title || !formData.type || !formData.category) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        return;
      }
      
      // Update the document
      const updatedDocument: DocumentRH = {
        ...selectedDocument,
        title: formData.title || selectedDocument.title,
        type: formData.type || selectedDocument.type,
        category: formData.category || selectedDocument.category,
        description: formData.description || selectedDocument.description,
        relatedEmployees: selectedEmployees,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      
      setDocuments(documents.map(doc => 
        doc.id === selectedDocument.id ? updatedDocument : doc
      ));
      
      toast.success(`Document "${updatedDocument.title}" mis à jour avec succès`);
      setIsEditDialogOpen(false);
      setSelectedDocument(null);
      setFormData({});
      setSelectedEmployees([]);
    }
  };
  
  // Handle adding a new document
  const handleAddDocument = () => {
    // Validate required fields
    if (!formData.title || !formData.type || !formData.category) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    // Create a new document
    const newDocument: DocumentRH = {
      id: `DOC${documents.length + 1}`.padStart(6, '0'),
      title: formData.title || '',
      type: formData.type || 'PDF',
      category: formData.category || '',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      size: '0.5 MB', // Default size
      owner: 'Service RH', // Default owner
      status: 'active',
      description: formData.description || '',
      relatedEmployees: selectedEmployees
    };
    
    setDocuments([...documents, newDocument]);
    toast.success(`Document "${newDocument.title}" ajouté avec succès`);
    setIsAddDialogOpen(false);
    setFormData({});
    setSelectedEmployees([]);
  };
  
  // Handle downloading document as PDF
  const handleDownloadDocument = (document: DocumentRH) => {
    // Create a new PDF document
    const doc = new jsPDF();
    
    // Add company header
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    doc.text(document.title.toUpperCase(), 105, 20, { align: "center" });
    
    // Add document category
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text(`Catégorie: ${document.category}`, 105, 30, { align: "center" });
    
    // Add horizontal line
    doc.setDrawColor(44, 62, 80);
    doc.line(20, 35, 190, 35);
    
    // Add document information section
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("INFORMATIONS DU DOCUMENT", 20, 45);
    doc.setFont("helvetica", "normal");
    
    doc.text(`Référence: ${document.id}`, 20, 55);
    doc.text(`Type: ${document.type}`, 20, 65);
    doc.text(`Créé le: ${document.createdAt}`, 20, 75);
    doc.text(`Mis à jour le: ${document.updatedAt}`, 20, 85);
    doc.text(`Propriétaire: ${document.owner}`, 20, 95);
    
    // Add description section
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("DESCRIPTION", 20, 115);
    doc.setFont("helvetica", "normal");
    
    // Add description text with wrapping
    const description = document.description || "Aucune description disponible.";
    const splitDescription = doc.splitTextToSize(description, 170);
    doc.text(splitDescription, 20, 125);
    
    // Add related employees section if there are any
    if (document.relatedEmployees.length > 0) {
      let yPosition = 125 + splitDescription.length * 7 + 10; // Position after description plus some margin
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("EMPLOYÉS CONCERNÉS", 20, yPosition);
      doc.setFont("helvetica", "normal");
      
      yPosition += 10;
      
      document.relatedEmployees.forEach((empId) => {
        const employee = employees.find(emp => emp.id === empId);
        if (employee) {
          doc.text(`• ${employee.firstName} ${employee.lastName} - ${employee.position}`, 25, yPosition);
          yPosition += 7;
        }
      });
    }
    
    // Add footer with company information
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Enterprise Solutions - Documents RH", 105, 280, { align: "center" });
    doc.text(`Document généré le ${new Date().toLocaleDateString('fr-FR')}`, 105, 285, { align: "center" });
    
    // Save the PDF
    doc.save(`document-${document.id}-${document.title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    
    toast.success("Document téléchargé avec succès");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold">Documents RH</h2>
          <p className="text-gray-500">Gérez les documents administratifs et RH</p>
        </div>
        
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button variant="outline" size="sm" onClick={() => setIsFilterDialogOpen(true)}>
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          
          <Button size="sm" onClick={() => {
            setFormData({
              title: '',
              type: 'PDF',
              category: '',
              description: '',
              relatedEmployees: []
            });
            setSelectedEmployees([]);
            setIsAddDialogOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau document
          </Button>
        </div>
      </div>
      
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Rechercher par titre, catégorie..."
          className="pl-8 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Documents Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead>Dernière mise à jour</TableHead>
                <TableHead>Taille</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((document) => (
                <TableRow key={document.id}>
                  <TableCell className="font-medium">{document.title}</TableCell>
                  <TableCell>{document.category}</TableCell>
                  <TableCell>{document.type}</TableCell>
                  <TableCell>{document.createdAt}</TableCell>
                  <TableCell>{document.updatedAt}</TableCell>
                  <TableCell>{document.size}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleViewDocument(document)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDownloadDocument(document)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEditDocument(document)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteDocument(document)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredDocuments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                    Aucun document trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* View Document Dialog */}
      {selectedDocument && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Détails du document</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{selectedDocument.title}</h3>
                  <p className="text-gray-500">{selectedDocument.category}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  selectedDocument.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedDocument.status === 'active' ? 'Actif' : 'Archivé'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">ID du document</p>
                  <p className="font-mono">{selectedDocument.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p>{selectedDocument.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Créé le</p>
                  <p>{selectedDocument.createdAt}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mis à jour le</p>
                  <p>{selectedDocument.updatedAt}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Taille</p>
                  <p>{selectedDocument.size}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Propriétaire</p>
                  <p>{selectedDocument.owner}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Description</p>
                <p className="bg-gray-50 p-3 rounded-md">
                  {selectedDocument.description || "Aucune description disponible."}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Employés concernés</p>
                {selectedDocument.relatedEmployees.length > 0 ? (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <ul className="space-y-1">
                      {selectedDocument.relatedEmployees.map(empId => {
                        const employee = employees.find(emp => emp.id === empId);
                        return (
                          <li key={empId} className="text-sm">
                            {employee 
                              ? `${employee.firstName} ${employee.lastName} - ${employee.position}` 
                              : `Employé ID: ${empId}`}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : (
                  <p className="bg-gray-50 p-3 rounded-md text-gray-500">
                    Aucun employé associé à ce document.
                  </p>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => handleDownloadDocument(selectedDocument)}
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger le document
              </Button>
              <Button onClick={() => handleEditDocument(selectedDocument)}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Edit Document Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier le document</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="title" className="text-right text-sm font-medium">
                Titre
              </label>
              <div className="col-span-3">
                <Input
                  id="title"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="type" className="text-right text-sm font-medium">
                Type
              </label>
              <div className="col-span-3">
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="DOCX">DOCX</SelectItem>
                    <SelectItem value="XLSX">XLSX</SelectItem>
                    <SelectItem value="PPTX">PPTX</SelectItem>
                    <SelectItem value="TXT">TXT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="category" className="text-right text-sm font-medium">
                Catégorie
              </label>
              <div className="col-span-3">
                <Input
                  id="category"
                  name="category"
                  value={formData.category || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right text-sm font-medium">
                Description
              </label>
              <div className="col-span-3">
                <Input
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <label className="text-right text-sm font-medium pt-1">
                Employés concernés
              </label>
              <div className="col-span-3">
                <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                  {employees.map(employee => (
                    <div key={employee.id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={`emp-${employee.id}`}
                        checked={selectedEmployees.includes(employee.id)}
                        onChange={() => handleEmployeeSelect(employee.id)}
                        className="mr-2"
                      />
                      <label htmlFor={`emp-${employee.id}`} className="text-sm">
                        {employee.firstName} {employee.lastName} - {employee.position}
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedEmployees.length} employé(s) sélectionné(s)
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdateDocument}>
              Mettre à jour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Document Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nouveau document</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="title" className="text-right text-sm font-medium">
                Titre
              </label>
              <div className="col-span-3">
                <Input
                  id="title"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  placeholder="Ex: Guide des procédures"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="type" className="text-right text-sm font-medium">
                Type
              </label>
              <div className="col-span-3">
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="DOCX">DOCX</SelectItem>
                    <SelectItem value="XLSX">XLSX</SelectItem>
                    <SelectItem value="PPTX">PPTX</SelectItem>
                    <SelectItem value="TXT">TXT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="category" className="text-right text-sm font-medium">
                Catégorie
              </label>
              <div className="col-span-3">
                <Input
                  id="category"
                  name="category"
                  value={formData.category || ''}
                  onChange={handleInputChange}
                  placeholder="Ex: Règlement intérieur"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right text-sm font-medium">
                Description
              </label>
              <div className="col-span-3">
                <Input
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  placeholder="Description du document..."
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="fileUpload" className="text-right text-sm font-medium">
                Fichier
              </label>
              <div className="col-span-3">
                <div className="border border-dashed rounded-md p-4 text-center">
                  <Upload className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    Glissez-déposez un fichier ici, ou{' '}
                    <span className="text-blue-500 cursor-pointer">parcourir</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Max. 10MB - Formats acceptés: PDF, DOCX, XLSX, PPTX, TXT
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <label className="text-right text-sm font-medium pt-1">
                Employés concernés
              </label>
              <div className="col-span-3">
                <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                  {employees.map(employee => (
                    <div key={employee.id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={`emp-add-${employee.id}`}
                        checked={selectedEmployees.includes(employee.id)}
                        onChange={() => handleEmployeeSelect(employee.id)}
                        className="mr-2"
                      />
                      <label htmlFor={`emp-add-${employee.id}`} className="text-sm">
                        {employee.firstName} {employee.lastName} - {employee.position}
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedEmployees.length} employé(s) sélectionné(s)
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddDocument}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p>Êtes-vous sûr de vouloir supprimer le document "{selectedDocument?.title}" ?</p>
            <p className="text-sm text-gray-500 mt-2">Cette action est irréversible.</p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDeleteDocument}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Filter Dialog */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filtrer les documents</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Type de document
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="DOCX">DOCX</SelectItem>
                  <SelectItem value="XLSX">XLSX</SelectItem>
                  <SelectItem value="PPTX">PPTX</SelectItem>
                  <SelectItem value="TXT">TXT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Catégorie
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  <SelectItem value="Règlement intérieur">Règlement intérieur</SelectItem>
                  <SelectItem value="Guide">Guide</SelectItem>
                  <SelectItem value="Accord collectif">Accord collectif</SelectItem>
                  <SelectItem value="Procédure">Procédure</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Statut
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="archived">Archivé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Date de création (min)
                </label>
                <Input type="date" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Date de création (max)
                </label>
                <Input type="date" />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline">
              Réinitialiser
            </Button>
            <Button>
              Appliquer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesDocuments;
