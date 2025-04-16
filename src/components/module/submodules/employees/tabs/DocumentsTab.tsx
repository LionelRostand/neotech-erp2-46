
import React from 'react';
import { Card } from '@/components/ui/card';
import { Employee } from '@/types/employee';
import { DocumentsTable } from '../../documents/components/DocumentsTable';
import { useDocumentsData } from '@/hooks/useDocumentsData';
import { Button } from '@/components/ui/button';
import { FilePlus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DocumentsTabProps {
  employee: Employee;
  isEditing?: boolean;
  onFinishEditing?: () => void;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ 
  employee,
  isEditing = false
}) => {
  const { documents, isLoading } = useDocumentsData();
  const [selectedType, setSelectedType] = React.useState<string>('');
  
  // Filter documents for this employee
  const employeeDocuments = documents.filter(doc => 
    doc.employeeId === employee.id
  );

  const documentTypes = [
    'Contrat de travail',
    'Fiche de paie',
    'Attestation',
    'CV',
    'Diplôme',
    'Autre'
  ];

  const handleAddDocument = () => {
    // Trigger file input click
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png';
    fileInput.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        // Handle file upload here
        console.log('File selected:', target.files[0]);
        console.log('Document type:', selectedType);
      }
    };
    fileInput.click();
  };

  return (
    <div className="space-y-6">
      {isEditing && (
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Type de document" />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={handleAddDocument} 
              disabled={!selectedType}
              className="ml-auto"
            >
              <FilePlus className="h-4 w-4 mr-2" />
              Ajouter un document
            </Button>
          </div>
        </Card>
      )}

      <Card>
        <div className="p-6">
          <DocumentsTable 
            documents={employeeDocuments} 
            isLoading={isLoading} 
          />
        </div>
      </Card>
    </div>
  );
};

export default DocumentsTab;
