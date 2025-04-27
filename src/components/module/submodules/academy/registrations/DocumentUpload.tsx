
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FileText, Upload, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface DocumentStatus {
  id: string;
  name: string;
  description: string;
  required: boolean;
  uploaded: boolean;
  file?: File;
}

const DocumentUpload = () => {
  const [documents, setDocuments] = useState<DocumentStatus[]>([
    {
      id: 'birth-certificate',
      name: "Acte de naissance",
      description: "Document original ou copie certifiée",
      required: true,
      uploaded: false
    },
    {
      id: 'school-certificate',
      name: "Certificat de scolarité",
      description: "Pour l'année scolaire précédente",
      required: true,
      uploaded: false
    },
    {
      id: 'id-copy',
      name: "Photocopie pièce d'identité",
      description: "De l'élève ou du parent/tuteur",
      required: true,
      uploaded: false
    },
    {
      id: 'photos',
      name: "Photos d'identité",
      description: "4 photos d'identité récentes",
      required: true,
      uploaded: false
    },
    {
      id: 'medical-certificate',
      name: "Certificat médical",
      description: "Pour les activités sportives",
      required: false,
      uploaded: false
    },
  ]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, docId: string) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setDocuments(prevDocs => 
      prevDocs.map(doc => 
        doc.id === docId 
          ? { ...doc, uploaded: true, file: file } 
          : doc
      )
    );
    
    toast.success(`Document "${documents.find(d => d.id === docId)?.name}" uploadé avec succès`);
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments(prevDocs => 
      prevDocs.map(doc => 
        doc.id === docId 
          ? { ...doc, uploaded: false, file: undefined } 
          : doc
      )
    );
    
    toast.info(`Document supprimé`);
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-600 mb-4">
        Les documents suivants sont nécessaires pour finaliser l'inscription. Veuillez les télécharger au format PDF ou image.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((document) => (
          <Card key={document.id} className={`border ${document.uploaded ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <FileText className={document.uploaded ? 'text-green-500' : 'text-gray-400'} />
                  <div>
                    <h3 className="font-medium">
                      {document.name}
                      {document.required && <span className="text-red-500 ml-1">*</span>}
                    </h3>
                    <p className="text-sm text-gray-500">{document.description}</p>
                  </div>
                </div>
                
                {document.uploaded && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteDocument(document.id)}
                  >
                    <XCircle className="h-5 w-5 text-red-500" />
                  </Button>
                )}
              </div>
              
              {!document.uploaded ? (
                <div className="mt-3">
                  <div className="flex items-center">
                    <Label 
                      htmlFor={`file-upload-${document.id}`}
                      className="cursor-pointer flex items-center gap-1 bg-primary/10 text-primary hover:bg-primary/20 transition-colors px-3 py-1 rounded-md text-sm"
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      Télécharger
                    </Label>
                    <Input 
                      id={`file-upload-${document.id}`}
                      type="file" 
                      className="sr-only"
                      onChange={(e) => handleFileChange(e, document.id)}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-700">Document téléchargé</span>
                  </span>
                  <span className="text-xs text-gray-500">
                    {document.file?.name.substring(0, 20)}{document.file?.name.length > 20 ? '...' : ''}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="border-t pt-4 mt-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            <span className="text-red-500">*</span> Documents obligatoires
          </p>
          <Button 
            disabled={!documents.filter(d => d.required).every(d => d.uploaded)}
          >
            Finaliser l'inscription
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
