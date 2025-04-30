
import React from 'react';
import { Employee } from '@/types/employee';

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
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc, index) => (
          <div 
            key={doc.id || index} 
            className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <p className="font-semibold">{doc.title}</p>
            <p className="text-sm text-gray-600">{doc.type}</p>
            <p className="text-xs text-gray-500">
              {new Date(doc.date).toLocaleDateString('fr-FR')}
            </p>
            {doc.description && (
              <p className="text-sm mt-2 text-gray-700">{doc.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
