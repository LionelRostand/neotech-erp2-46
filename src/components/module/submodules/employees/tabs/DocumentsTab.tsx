
import React from 'react';
import { Employee, Document } from '@/types/employee';
import { File, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';

interface DocumentsTabProps {
  employee: Employee;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ employee }) => {
  const documents = employee.documents || [];

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
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'id':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'certificate':
        return <FileText className="h-5 w-5 text-green-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
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
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Documents</h3>
      </div>
      
      {documents.length === 0 ? (
        <p className="text-gray-500">Aucun document enregistré</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {documents.map(doc => (
            <div key={doc.id} className="border rounded-md p-4">
              <div className="flex items-start gap-3">
                <div className="pt-1">{getDocumentTypeIcon(doc.type)}</div>
                <div className="flex-grow">
                  <h4 className="font-medium">{doc.title}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm">
                    <div>
                      <span className="text-gray-500">Type:</span> {getDocumentTypeName(doc.type)}
                    </div>
                    <div>
                      <span className="text-gray-500">Date:</span> {formatDate(doc.date)}
                    </div>
                    {doc.description && (
                      <div className="md:col-span-2">
                        <span className="text-gray-500">Description:</span> {doc.description}
                      </div>
                    )}
                    <div className="md:col-span-2">
                      <span className="text-gray-500">Ajouté le:</span> {formatDate(doc.uploadedAt)}
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                    Voir
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentsTab;
