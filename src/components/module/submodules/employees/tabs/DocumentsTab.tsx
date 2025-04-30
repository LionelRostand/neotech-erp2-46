
import React from 'react';
import { Employee } from '@/types/employee';
import { FileText, FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate } from '../utils/employeeUtils';

interface DocumentsTabProps {
  employee: Employee;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ employee }) => {
  const { documents = [] } = employee;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Documents</h3>
        <Button size="sm">
          <FileUp className="h-4 w-4 mr-2" />
          Ajouter un document
        </Button>
      </div>
      
      {documents && documents.length > 0 ? (
        <div className="space-y-4">
          {documents.map((doc) => (
            <div 
              key={doc.id} 
              className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-md">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">{doc.title}</p>
                  <p className="text-sm text-gray-500">
                    {doc.type} • Ajouté le {formatDate(doc.uploadedAt)}
                  </p>
                </div>
              </div>
              <a 
                href={doc.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                Télécharger
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center border border-dashed rounded-md">
          <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
          <h3 className="text-lg font-medium">Aucun document</h3>
          <p className="text-gray-500 mt-1">
            Aucun document n'a été ajouté pour cet employé
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentsTab;
