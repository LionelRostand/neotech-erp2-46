import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Employee, Document } from '@/types/employee';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { FileUp, FileText, Download, Eye, Pencil, Trash2, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { toast } from 'sonner';

interface DocumentsTabProps {
  employee: Employee;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ employee }) => {
  const [documents, setDocuments] = useState<Document[]>(employee.documents || []);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [newDocumentName, setNewDocumentName] = useState('');
  const [newDocumentType, setNewDocumentType] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleAddDocument = () => {
    if (!newDocumentName || !newDocumentType || !uploadedFile) {
      toast.error("Veuillez remplir tous les champs et sélectionner un fichier");
      return;
    }

    const today = new Date().toLocaleDateString('fr-FR');
    const newDocument: Document = {
      name: newDocumentName,
      date: today,
      type: newDocumentType
    };

    setDocuments([...documents, newDocument]);
    toast.success("Document ajouté avec succès");
    resetForm();
  };

  const handleEditDocument = () => {
    if (!selectedDocument || !newDocumentName || !newDocumentType) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    const updatedDocuments = documents.map(doc => 
      doc === selectedDocument 
        ? { ...doc, name: newDocumentName, type: newDocumentType } 
        : doc
    );

    setDocuments(updatedDocuments);
    toast.success("Document mis à jour avec succès");
    resetForm();
  };

  const handleDeleteDocument = () => {
    if (!selectedDocument) return;

    const updatedDocuments = documents.filter(doc => doc !== selectedDocument);
    setDocuments(updatedDocuments);
    toast.success("Document supprimé avec succès");
    resetForm();
  };

  const handleDownload = (document: Document) => {
    toast.success(`Téléchargement de "${document.name}" en cours...`);
    setTimeout(() => {
      toast.success(`Document "${document.name}" téléchargé avec succès`);
    }, 1500);
  };

  const resetForm = () => {
    setNewDocumentName('');
    setNewDocumentType('');
    setUploadedFile(null);
    setSelectedDocument(null);
    setIsUploadOpen(false);
    setIsViewOpen(false);
    setIsEditOpen(false);
    setIsDeleteConfirmOpen(false);
  };

  const openViewDialog = (document: Document) => {
    setSelectedDocument(document);
    setIsViewOpen(true);
  };

  const openEditDialog = (document: Document) => {
    setSelectedDocument(document);
    setNewDocumentName(document.name);
    setNewDocumentType(document.type);
    setIsEditOpen(true);
  };

  const openDeleteConfirmDialog = (document: Document) => {
    setSelectedDocument(document);
    setIsDeleteConfirmOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Documents</CardTitle>
        <Button onClick={() => setIsUploadOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un document
        </Button>
      </CardHeader>
      <CardContent>
        {documents.length > 0 ? (
          <div className="space-y-4">
            {documents.map((document, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-500 mr-3" />
                  <div>
                    <div className="font-medium">{document.name}</div>
                    <div className="text-sm text-gray-500">
                      {document.type} | Ajouté le {document.date}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => openViewDialog(document)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDownload(document)}>
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(document)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openDeleteConfirmDialog(document)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <FileText className="h-10 w-10 mx-auto mb-2 text-gray-400" />
            <p>Aucun document disponible</p>
            <p className="text-sm">Ajoutez des documents avec le bouton ci-dessus</p>
          </div>
        )}

        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un document</DialogTitle>
              <DialogDescription>
                Téléchargez un document pour cet employé.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="docName">Nom du document</Label>
                <Input 
                  id="docName" 
                  value={newDocumentName} 
                  onChange={(e) => setNewDocumentName(e.target.value)} 
                  placeholder="Ex: Contrat de travail"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="docType">Type de document</Label>
                <Select onValueChange={setNewDocumentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Contrat">Contrat</SelectItem>
                    <SelectItem value="Avenant">Avenant</SelectItem>
                    <SelectItem value="Attestation">Attestation</SelectItem>
                    <SelectItem value="Formation">Formation</SelectItem>
                    <SelectItem value="Administratif">Administratif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="docFile">Fichier</Label>
                <div className="border-2 border-dashed rounded-md p-6 text-center">
                  <FileUp className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <div className="text-sm mb-2">
                    {uploadedFile ? (
                      <span className="text-green-500 font-medium">{uploadedFile.name}</span>
                    ) : (
                      "Glissez-déposez ou cliquez pour sélectionner"
                    )}
                  </div>
                  <Input 
                    id="docFile" 
                    type="file" 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadedFile(e.target.files[0]);
                      }
                    }}
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => document.getElementById('docFile')?.click()}
                  >
                    Parcourir
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetForm}>Annuler</Button>
              <Button onClick={handleAddDocument}>Ajouter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedDocument?.name}</DialogTitle>
            </DialogHeader>
            <div className="py-6">
              <div className="bg-gray-100 rounded-md p-8 flex flex-col items-center justify-center">
                <FileText className="h-16 w-16 text-blue-500 mb-4" />
                <p className="font-medium mb-1">{selectedDocument?.name}</p>
                <p className="text-sm text-gray-500 mb-3">Type: {selectedDocument?.type}</p>
                <p className="text-sm text-gray-500">Ajouté le {selectedDocument?.date}</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewOpen(false)}>Fermer</Button>
              <Button onClick={() => selectedDocument && handleDownload(selectedDocument)}>Télécharger</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier un document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editDocName">Nom du document</Label>
                <Input 
                  id="editDocName" 
                  value={newDocumentName} 
                  onChange={(e) => setNewDocumentName(e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editDocType">Type de document</Label>
                <Select value={newDocumentType} onValueChange={setNewDocumentType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Contrat">Contrat</SelectItem>
                    <SelectItem value="Avenant">Avenant</SelectItem>
                    <SelectItem value="Attestation">Attestation</SelectItem>
                    <SelectItem value="Formation">Formation</SelectItem>
                    <SelectItem value="Administratif">Administratif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Fichier actuel</Label>
                <div className="flex items-center p-2 border rounded-md">
                  <FileText className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm">Document original (non modifiable)</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetForm}>Annuler</Button>
              <Button onClick={handleEditDocument}>Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer la suppression</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer ce document ? Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={resetForm}>Annuler</Button>
              <Button variant="destructive" onClick={handleDeleteDocument}>Supprimer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default DocumentsTab;
