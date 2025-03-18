
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { Employee } from '@/types/employee';

interface DocumentsTabProps {
  employee: Employee;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ employee }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Documents</h3>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Ajouter un document
          </Button>
        </div>
        
        <div className="space-y-4">
          {employee.documents.map((doc, index) => (
            <div key={index} className="flex justify-between items-center p-4 border rounded-md hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-sm text-gray-500">Ajouté le {doc.date}</p>
                </div>
              </div>
              <Badge variant="outline">{doc.type}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentsTab;
