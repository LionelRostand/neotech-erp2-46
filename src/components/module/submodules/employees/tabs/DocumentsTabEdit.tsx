
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Employee, Document } from '@/types/employee';
import { Plus, X, File, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DocumentsTabEditProps {
  employee: Employee;
  onSave: (data: Partial<Employee>) => void;
  onCancel: () => void;
}

const DocumentsTabEdit: React.FC<DocumentsTabEditProps> = ({ employee, onSave, onCancel }) => {
  const [documents, setDocuments] = useState<Document[]>(employee.documents || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDocument, setNewDocument] = useState<Partial<Document>>({
    title: '',
    type: 'contract',
    date: new Date().toISOString().split('T')[0],
    description: '',
    fileUrl: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewDocument(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewDocument(prev => ({ ...prev, [name]: value }));
  };

  const handleAddDocument = () => {
    if (newDocument.title && newDocument.date) {
      const document: Document = {
        id: Date.now().toString(),
        title: newDocument.title,
        type: newDocument.type as 'contract' | 'id' | 'certificate' | 'other',
        date: newDocument.date,
        description: newDocument.description || '',
        fileUrl: newDocument.fileUrl || '#',
        uploadedAt: new Date().toISOString()
      };
      
      setDocuments([...documents, document]);
      setNewDocument({
        title: '',
        type: 'contract',
        date: new Date().toISOString().split('T')[0],
        description: '',
        fileUrl: ''
      });
      setShowAddForm(false);
    }
  };

  const handleRemoveDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const handleSave = () => {
    onSave({ documents });
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'contract':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'id':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'certificate':
        return <FileText className="h-4 w-4 text-green-500" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  const getDocumentTypeName = (type: string) => {
    switch (type) {
      case 'contract':
        return 'Contrat';
      case 'id':
        return 'Pièce d\'identité';
      case 'certificate':
        return 'Certificat';
      default:
        return 'Autre';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Documents</h3>
          {!showAddForm && (
            <Button type="button" onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Ajouter un document
            </Button>
          )}
        </div>
        
        {documents.length === 0 && !showAddForm ? (
          <p className="text-gray-500">Aucun document enregistré</p>
        ) : (
          <div className="space-y-4">
            {documents.map(doc => (
              <div key={doc.id} className="border rounded-md p-3 relative">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2"
                  onClick={() => handleRemoveDocument(doc.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center gap-2 mb-2">
                  {getDocumentTypeIcon(doc.type)}
                  <span className="font-medium">{doc.title}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Type :</span> {getDocumentTypeName(doc.type)}
                  </div>
                  <div>
                    <span className="text-gray-500">Date :</span> {formatDate(doc.date)}
                  </div>
                  {doc.description && (
                    <div className="col-span-2">
                      <span className="text-gray-500">Description :</span> {doc.description}
                    </div>
                  )}
                  <div className="col-span-2">
                    <span className="text-gray-500">Ajouté le :</span> {formatDate(doc.uploadedAt)}
                  </div>
                </div>
              </div>
            ))}

            {showAddForm && (
              <div className="border rounded-md p-4 space-y-4">
                <h4 className="font-medium">Nouveau document</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre du document</Label>
                    <Input 
                      id="title" 
                      name="title"
                      value={newDocument.title} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Type de document</Label>
                    <Select 
                      value={newDocument.type} 
                      onValueChange={(value) => handleSelectChange('type', value)}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Choisir le type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contract">Contrat</SelectItem>
                        <SelectItem value="id">Pièce d'identité</SelectItem>
                        <SelectItem value="certificate">Certificat</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Date du document</Label>
                    <Input 
                      id="date" 
                      name="date"
                      type="date"
                      value={newDocument.date} 
                      onChange={handleInputChange} 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fileUrl">URL du fichier</Label>
                    <Input 
                      id="fileUrl" 
                      name="fileUrl"
                      value={newDocument.fileUrl} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description"
                    value={newDocument.description} 
                    onChange={handleInputChange} 
                    rows={2}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAddForm(false)}
                  >
                    Annuler
                  </Button>
                  <Button type="button" onClick={handleAddDocument}>
                    Ajouter
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2 border-t pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="button" onClick={handleSave}>
          Sauvegarder
        </Button>
      </div>
    </div>
  );
};

export default DocumentsTabEdit;
