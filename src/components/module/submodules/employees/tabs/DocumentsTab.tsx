
import React from 'react';
import { Employee, Document } from '@/types/employee';
import { FileText, Download, Eye, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocumentsTabProps {
  employee: Employee;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ employee }) => {
  // Make sure documents is always an array
  const documents = Array.isArray(employee.documents) ? employee.documents : [];

  if (documents.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-md">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucun document</h3>
        <p className="mt-1 text-sm text-gray-500">
          Aucun document n'a été ajouté pour cet employé.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Documents</h3>
      
      <div className="grid grid-cols-1 gap-4">
        {documents.map((doc, index) => {
          // Handle both string and object documents
          const document = typeof doc === 'string' ? { name: doc, type: 'other', date: new Date().toISOString() } : doc;
          
          // Make sure document is valid
          if (!document || !document.name) return null;
          
          // Ensure document name is a string
          const documentName = typeof document.name === 'object' ? 
            JSON.stringify(document.name) : String(document.name || '');
          
          // Ensure document type is a string
          const documentType = typeof document.type === 'object' ? 
            JSON.stringify(document.type) : String(document.type || 'Document');
            
          // Format date or use fallback
          let documentDate = 'Date inconnue';
          try {
            if (document.date) {
              documentDate = new Date(document.date).toLocaleDateString();
            }
          } catch (e) {
            console.error("Error formatting document date", e);
          }
          
          return (
            <div 
              key={index} 
              className="flex items-center justify-between p-4 border rounded-lg bg-white"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-50 rounded-md">
                  <FileText className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">{documentName}</p>
                  <p className="text-sm text-gray-500">
                    {documentType} • {documentDate}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentsTab;
