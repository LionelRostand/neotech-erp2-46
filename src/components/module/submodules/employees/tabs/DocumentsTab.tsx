
import React from 'react';
import { Employee } from '@/types/employee';
import { FileText, FileArchive, FileCheck, HelpCircle } from 'lucide-react';

interface DocumentsTabProps {
  employee: Employee;
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({ employee }) => {
  const documents = employee.documents || [];
  
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-500">
        <p>Aucun document disponible pour cet employé</p>
      </div>
    );
  }
  
  // Fonction pour obtenir l'icône selon le type de document
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'contract':
        return <FileCheck className="w-5 h-5 text-blue-500" />;
      case 'certificate':
        return <FileCheck className="w-5 h-5 text-green-500" />;
      case 'id':
        return <FileArchive className="w-5 h-5 text-amber-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc, index) => (
          <div 
            key={doc.id || index} 
            className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer flex items-start gap-3"
          >
            <div className="mt-1">
              {getDocumentIcon(doc.type)}
            </div>
            <div className="flex-1">
              <p className="font-semibold">{doc.title}</p>
              <p className="text-sm text-gray-600 capitalize">{doc.type}</p>
              <p className="text-xs text-gray-500">
                {new Date(doc.date).toLocaleDateString('fr-FR')}
              </p>
              {doc.description && (
                <p className="text-sm mt-2 text-gray-700">{doc.description}</p>
              )}
            </div>
            <a 
              href={doc.fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline text-sm"
            >
              Voir
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
