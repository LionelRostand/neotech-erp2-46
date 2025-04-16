import React from 'react';
import { Card } from '@/components/ui/card';
import { Employee } from '@/types/employee';
import { useDocumentsData } from '@/hooks/useDocumentsData';
import { FileIcon } from '@/components/icons/FileIcon';

interface DocumentsTabProps {
  employee: Employee;
  isEditing?: boolean;
  onFinishEditing?: () => void;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ employee }) => {
  const { documents, isLoading } = useDocumentsData();
  const employeeDocuments = documents.filter(doc => doc.employeeId === employee.id);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex flex-col space-y-4">
          <div className="h-8 bg-gray-200 rounded-md animate-pulse w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-md animate-pulse"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!employeeDocuments.length) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Aucun document n'a été trouvé pour cet employé</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {employeeDocuments.map((doc) => (
          <div 
            key={doc.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded">
                <FileIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">{doc.title}</h4>
                <p className="text-sm text-muted-foreground">{doc.uploadDate}</p>
              </div>
            </div>
            {doc.url && (
              <a 
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Voir le document
              </a>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default DocumentsTab;
