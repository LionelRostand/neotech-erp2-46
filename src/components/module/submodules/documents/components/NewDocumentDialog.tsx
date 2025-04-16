import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Employee } from '@/types/employee';
import { Document } from '@/types/employee';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { getDocumentTypes } from '@/components/module/submodules/employees/services/documentService';

interface NewDocumentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDocumentCreated: (document: Document, employeeId: string) => Promise<void>;
}

const NewDocumentDialog: React.FC<NewDocumentDialogProps> = ({
  isOpen,
  onOpenChange,
  onDocumentCreated
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [documentTypes, setDocumentTypes] = useState<string[]>([]);
  const [fileData, setFileData] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');
  const { employees } = useHrModuleData();
  
  // Load document types when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      const loadDocumentTypes = async () => {
        const types = await getDocumentTypes();
        setDocumentTypes(types);
      };
      loadDocumentTypes();
    }
  }, [isOpen]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    setFileType(file.type);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFileData(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleSubmit = async () => {
    if (!name || !type || !selectedEmployeeId) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    if (!fileData) {
      toast.error('Veuillez sélectionner un fichier');
      return;
    }
    
    const fileSizeNumber = fileData ? fileData.length : 0;
    
    const document: Document = {
      id: `doc_${Date.now()}`,
      name,
      type,
      date: new Date().toISOString().split('T')[0],
      fileData,
      fileType,
      fileSize: fileSizeNumber,
      employeeId: selectedEmployeeId
    };
    
    try {
      await onDocumentCreated(document, selectedEmployeeId);
      resetForm();
      onOpenChange(false);
      toast.success('Document créé avec succès');
    } catch (error) {
      console.error('Erreur lors de la création du document:', error);
      toast.error('Erreur lors de la création du document');
    }
  };
  
  const resetForm = () => {
    setName('');
    setType('');
    setDescription('');
    setSelectedEmployeeId('');
    setFileData(null);
    setFileName('');
    setFileType('');
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) resetForm();
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouveau document RH</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="employee" className="text-right">
              Employé
            </Label>
            <div className="col-span-3">
              <Select 
                value={selectedEmployeeId} 
                onValueChange={setSelectedEmployeeId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un employé" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem 
                      key={employee.id} 
                      value={employee.id}
                    >
                      {employee.firstName} {employee.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nom du document
            </Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="col-span-3" 
              placeholder="Entrez le nom du document"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type de document
            </Label>
            <div className="col-span-3">
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((docType) => (
                    <SelectItem key={docType} value={docType}>
                      {docType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="col-span-3" 
              placeholder="Entrez une description (optionnel)"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file" className="text-right">
              Fichier
            </Label>
            <div className="col-span-3">
              <Input 
                id="file" 
                type="file" 
                onChange={handleFileChange} 
                className="col-span-3"
              />
              {fileName && (
                <p className="text-sm text-gray-500 mt-1">
                  Fichier sélectionné: {fileName}
                </p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleSubmit}>Créer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewDocumentDialog;
