
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilePlus, FileText, Trash2, X } from "lucide-react";
import { toast } from "sonner";

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
}

const DocumentsTab: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [dragActive, setDragActive] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const newDocuments = files.map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      type: file.type,
      size: file.size,
      uploadDate: new Date()
    }));
    
    setDocuments(prev => [...prev, ...newDocuments]);
    toast.success(`${files.length} document(s) ajouté(s)`);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    toast.info("Document supprimé");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Images et documents médicaux</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className={`flex flex-col items-center justify-center border-2 ${dragActive ? 'border-green-500 bg-green-50' : 'border-dashed border-gray-300'} rounded-lg p-6`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <FilePlus className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Cliquez pour ajouter des images ou documents</p>
            <p className="text-xs text-gray-400 mt-1">Formats acceptés: JPEG, PNG, PDF, DICOM</p>
            <p className="text-xs text-gray-400">Glissez-déposez les fichiers ici</p>
            <Button 
              className="mt-4" 
              variant="outline" 
              type="button"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              Ajouter un document
            </Button>
            <input 
              id="file-upload" 
              type="file" 
              multiple 
              className="hidden" 
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf,.dcm"
            />
          </div>
          
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2">Documents associés</h4>
            {documents.length > 0 ? (
              <div className="space-y-2">
                {documents.map(doc => (
                  <div 
                    key={doc.id} 
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-xs text-gray-500">
                          {(doc.size / 1024).toFixed(2)} KB • {doc.uploadDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeDocument(doc.id)}
                    >
                      <Trash2 className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">Aucun document associé à cette consultation</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsTab;
