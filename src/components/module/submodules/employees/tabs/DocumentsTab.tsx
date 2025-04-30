
import React from 'react';
import { Employee, Document } from '@/types/employee';
import { FileText, AlertCircle, Eye, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocumentsTabProps {
  employee: Employee;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ employee }) => {
  // Ensure documents is an array
  const documents = Array.isArray(employee.documents) ? employee.documents : [];
  
  // Helper to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch (error) {
      return dateString;
    }
  };

  // Helper to ensure values are strings
  const ensureString = (value: any) => {
    if (value === undefined || value === null) return '-';
    return typeof value === 'object' ? JSON.stringify(value) : String(value);
  };
  
  // Helper to handle document view/download
  const handleViewDocument = (doc: Document) => {
    // Si fileUrl est un URL, ouvrir dans un nouvel onglet
    if (doc.fileUrl && doc.fileUrl.startsWith('http')) {
      window.open(doc.fileUrl, '_blank');
      return;
    }
    
    // Si fileData existe (base64), créer un blob et ouvrir
    if (doc.fileData) {
      const base64Data = doc.fileData.split(',')[1];
      const mimeType = doc.fileType || 'application/pdf';
      const blob = base64ToBlob(base64Data, mimeType);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    }
  };
  
  const handleDownloadDocument = (doc: Document) => {
    if (!doc.fileData && !doc.fileUrl) return;
    
    try {
      // Si fileUrl existe et est un URL
      if (doc.fileUrl && doc.fileUrl.startsWith('http')) {
        const link = document.createElement('a');
        link.href = doc.fileUrl;
        link.download = doc.title || 'document';
        link.click();
        return;
      }
      
      // Si fileData existe (base64), créer un blob et télécharger
      if (doc.fileData) {
        const base64Data = doc.fileData.split(',')[1];
        const mimeType = doc.fileType || 'application/pdf';
        const blob = base64ToBlob(base64Data, mimeType);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = doc.title || 'document';
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement du document:', error);
    }
  };
  
  // Convertir base64 en Blob
  const base64ToBlob = (base64: string, mimeType: string): Blob => {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    
    return new Blob(byteArrays, { type: mimeType });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Documents</h3>
      
      {documents.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucun document</h3>
          <p className="mt-1 text-sm text-gray-500">
            Aucun document n'a été ajouté pour cet employé.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((document, index) => {
            // S'assurer que document.title/name et document.type sont des chaînes de caractères
            const title = ensureString(document.name || document.title);
            const type = ensureString(document.type);
            const date = ensureString(document.date);
            const fileUrl = ensureString(document.fileUrl);
            const fileData = document.fileData || null;
            const canView = fileUrl !== '-' || fileData;
            
            return (
              <div key={document.id || index} className="border rounded-lg p-4 flex flex-col space-y-3">
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <FileText className={`h-8 w-8 ${type.toLowerCase().includes('contrat') ? 'text-blue-500' : 'text-gray-500'}`} />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium">{title}</h4>
                    <div className="text-sm text-gray-500 mt-1">
                      Type: {type} | Date: {formatDate(date)}
                    </div>
                  </div>
                </div>
                
                {canView && (
                  <div className="flex space-x-2 mt-2 justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => handleViewDocument(document)}
                    >
                      <Eye className="h-4 w-4" />
                      Voir
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => handleDownloadDocument(document)}
                    >
                      <Download className="h-4 w-4" />
                      Télécharger
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DocumentsTab;
