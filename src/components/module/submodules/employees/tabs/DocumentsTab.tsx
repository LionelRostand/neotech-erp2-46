
import React from 'react';
import { Employee, Document } from '@/types/employee';
import { FileText, AlertCircle } from 'lucide-react';

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
            const title = ensureString(document.name || document.title);
            const type = ensureString(document.type);
            const date = ensureString(document.date);
            const fileUrl = ensureString(document.fileUrl);
            
            return (
              <div key={document.id || index} className="border rounded-lg p-4 flex space-x-4">
                <div className="flex-shrink-0">
                  <FileText className="h-8 w-8 text-blue-500" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-medium">{title}</h4>
                  <div className="text-sm text-gray-500 mt-1">
                    Type: {type} | Date: {formatDate(date)}
                  </div>
                  {fileUrl && fileUrl !== '-' && (
                    <a 
                      href={fileUrl} 
                      className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Voir le document
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DocumentsTab;
