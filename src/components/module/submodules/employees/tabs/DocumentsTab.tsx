
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Employee } from '@/types/employee';
import { useDocumentsData } from '@/hooks/useDocumentsData';
import { DocumentsTable } from '../../documents/components/DocumentsTable';
import { DocumentUploadForm } from './documents/DocumentUploadForm';

interface DocumentsTabProps {
  employee: Employee;
  isEditing?: boolean;
  onFinishEditing?: () => void;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ 
  employee,
  isEditing 
}) => {
  const { documents, isLoading } = useDocumentsData();
  
  // Filter documents for this employee, including contracts and payslips
  const employeeDocuments = documents.filter(doc => 
    doc.employeeId === employee.id || 
    doc.type === 'Contrat de travail' || 
    doc.type === 'Fiche de paie'
  );

  return (
    <div className="space-y-6">
      {isEditing && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Ajouter un document</h3>
          <DocumentUploadForm 
            employeeId={employee.id} 
            onUploadComplete={() => {
              // Refresh documents list if needed
            }} 
          />
        </Card>
      )}

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Documents</h3>
        <DocumentsTable 
          documents={employeeDocuments} 
          isLoading={isLoading} 
        />
      </Card>
    </div>
  );
};

export default DocumentsTab;
