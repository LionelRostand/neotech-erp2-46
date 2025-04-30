
import React from 'react';
import { Employee, Document } from '@/types/employee';
import { FilePlus, FileText, FileArchive, FileImage, FileX } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';

interface DocumentsTabProps {
  employee: Employee;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ employee }) => {
  const documents = employee.documents || [];
  
  const getFileIcon = (type: string) => {
    switch(type) {
      case 'contract':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'id':
        return <FileArchive className="h-5 w-5 text-amber-500" />;
      case 'certificate':
        return <FileImage className="h-5 w-5 text-green-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const formatFileDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'PPP', { locale: fr });
    } catch (e) {
      return dateStr;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Documents</h3>
        <Button size="sm">
          <FilePlus className="h-4 w-4 mr-2" />
          Ajouter un document
        </Button>
      </div>
      
      {documents.length > 0 ? (
        <div className="border rounded-md divide-y">
          {documents.map((doc) => (
            <div key={doc.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {getFileIcon(doc.type)}
                <div>
                  <h4 className="font-medium text-gray-900">{doc.title}</h4>
                  <div className="text-sm text-gray-500">
                    <span>Ajouté le {formatFileDate(doc.uploadedAt)}</span>
                    {doc.description && <span> • {doc.description}</span>}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">Télécharger</Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border rounded-md p-8 text-center">
          <FileX className="mx-auto h-10 w-10 text-gray-400 mb-2" />
          <h3 className="text-gray-500 font-medium">Aucun document</h3>
          <p className="text-gray-400 text-sm mt-1">Les documents de l'employé apparaîtront ici.</p>
        </div>
      )}
    </div>
  );
};

export default DocumentsTab;
