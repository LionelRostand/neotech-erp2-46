
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentsTable } from './DocumentsTable';
import { Badge } from '@/components/ui/badge';
import { HrDocument } from '@/hooks/useDocumentsData';
import { Button } from '@/components/ui/button';
import { XCircle, FileText, FileUser } from 'lucide-react';
import { format, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DocumentsTabsProps {
  documents: HrDocument[];
  documentsByType: Record<string, HrDocument[]>;
  documentTypes: string[];
  isLoading: boolean;
  selectedDate: Date | null;
  onClearDateFilter: () => void;
}

export const DocumentsTabs: React.FC<DocumentsTabsProps> = ({
  documents,
  documentsByType,
  documentTypes,
  isLoading,
  selectedDate,
  onClearDateFilter
}) => {
  // Safe format function
  const safeFormatDate = (date: Date | null) => {
    if (!date) return '';
    try {
      // Vérifier que la date est valide avant de la formater
      if (!isValid(date)) {
        console.warn('Invalid date provided to safeFormatDate:', date);
        return '';
      }
      return format(date, 'dd MMMM yyyy', { locale: fr });
    } catch (e) {
      console.error('Error formatting date in tabs:', e);
      return '';
    }
  };

  // Filter documents for CV and Contracts tabs
  const cvDocuments = documents.filter(doc => 
    doc.type?.toLowerCase() === 'cv' || 
    doc.title?.toLowerCase().includes('cv') || 
    doc.description?.toLowerCase().includes('cv')
  );
  
  const contractDocuments = documents.filter(doc => 
    doc.type?.toLowerCase() === 'contrat' || 
    doc.type?.toLowerCase() === 'contract' || 
    doc.title?.toLowerCase().includes('contrat') || 
    doc.description?.toLowerCase().includes('contrat')
  );

  return (
    <Tabs defaultValue="all">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="all">
            Tous <Badge variant="secondary" className="ml-2">{documents.length}</Badge>
          </TabsTrigger>
          
          <TabsTrigger value="cv">
            <FileUser className="h-4 w-4 mr-2" />
            CV <Badge variant="secondary" className="ml-2">{cvDocuments.length}</Badge>
          </TabsTrigger>
          
          <TabsTrigger value="contrats">
            <FileText className="h-4 w-4 mr-2" />
            Contrats <Badge variant="secondary" className="ml-2">{contractDocuments.length}</Badge>
          </TabsTrigger>
          
          {documentTypes.map(type => (
            type.toLowerCase() !== 'cv' && type.toLowerCase() !== 'contrat' && (
              <TabsTrigger key={type} value={type}>
                {type} <Badge variant="secondary" className="ml-2">{documentsByType[type]?.length || 0}</Badge>
              </TabsTrigger>
            )
          ))}
        </TabsList>
        
        {selectedDate && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Filtré par date: {safeFormatDate(selectedDate)}
            </span>
            <Button variant="ghost" size="icon" onClick={onClearDateFilter}>
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      <TabsContent value="all" className="mt-0">
        <DocumentsTable documents={documents} isLoading={isLoading} />
      </TabsContent>
      
      <TabsContent value="cv" className="mt-0">
        <DocumentsTable documents={cvDocuments} isLoading={isLoading} />
      </TabsContent>
      
      <TabsContent value="contrats" className="mt-0">
        <DocumentsTable documents={contractDocuments} isLoading={isLoading} />
      </TabsContent>
      
      {documentTypes.map(type => (
        type.toLowerCase() !== 'cv' && type.toLowerCase() !== 'contrat' && (
          <TabsContent key={type} value={type} className="mt-0">
            <DocumentsTable 
              documents={documentsByType[type] || []} 
              isLoading={isLoading}
            />
          </TabsContent>
        )
      ))}
    </Tabs>
  );
};
