
import React from 'react';
import { Employee, Document } from '@/types/employee';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileIcon, PlusIcon } from 'lucide-react';

interface DocumentsTabProps {
  employee: Employee;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ employee }) => {
  const documents = employee.documents || [];

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Documents de {employee.firstName} {employee.lastName}</h2>
        <Button variant="outline" size="sm">
          <PlusIcon className="h-4 w-4 mr-2" />
          Ajouter un document
        </Button>
      </div>
      
      {documents.length === 0 ? (
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <FileIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Aucun document disponible</p>
              <Button variant="outline" className="mt-4">
                <PlusIcon className="h-4 w-4 mr-2" />
                Ajouter un document
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc, index) => (
            <Card key={doc.id || `doc-${index}`}>
              <CardContent className="flex items-center p-4">
                <FileIcon className="h-8 w-8 mr-4 text-blue-500" />
                <div className="flex-1">
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {doc.type} • Ajouté le {doc.date || 'N/A'}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  Voir
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentsTab;
