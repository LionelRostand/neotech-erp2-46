
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Upload, X, File } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PackageDocumentsFormProps {
  documents: File[];
  setDocuments: React.Dispatch<React.SetStateAction<File[]>>;
}

const PackageDocumentsForm: React.FC<PackageDocumentsFormProps> = ({
  documents,
  setDocuments
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setDocuments([...documents, ...newFiles]);
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeDocument = (index: number) => {
    const newDocuments = [...documents];
    newDocuments.splice(index, 1);
    setDocuments(newDocuments);
  };

  const documentTypes = [
    { value: 'invoice', label: 'Facture' },
    { value: 'delivery_note', label: 'Bon de livraison' },
    { value: 'customs', label: 'Document douanier' },
    { value: 'other', label: 'Autre' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Documents du colis</h3>
        <p className="text-sm text-gray-500 mb-4">
          Joignez les documents nécessaires pour ce colis (factures, bons de livraison, douanes, etc.)
        </p>
      </div>

      <div className="border rounded-lg p-6 bg-gray-50">
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
          <h3 className="text-lg font-medium">Ajouter des documents</h3>
          <p className="text-sm text-gray-500 mb-4">
            Formats acceptés: PDF, JPG, PNG (max 10 MB)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <Button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
          >
            <Upload className="mr-2 h-4 w-4" />
            Sélectionner des fichiers
          </Button>
        </div>
      </div>

      {documents.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium">Documents ajoutés ({documents.length})</h4>
          <div className="space-y-3">
            {documents.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                <div className="flex items-center gap-3">
                  <File className="h-6 w-6 text-blue-500" />
                  <div>
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select defaultValue="invoice">
                    <SelectTrigger className="w-[140px] h-8">
                      <SelectValue placeholder="Type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeDocument(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageDocumentsForm;
