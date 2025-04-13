
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentsTable } from './DocumentsTable';
import { Badge } from '@/components/ui/badge';
import { HrDocument } from '@/hooks/useDocumentsData';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import { format } from 'date-fns';
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
      return format(date, 'dd MMMM yyyy', { locale: fr });
    } catch (e) {
      console.error('Error formatting date in tabs:', e);
      return '';
    }
  };

  return (
    <Tabs defaultValue="all">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="all">
            Tous <Badge variant="secondary" className="ml-2">{documents.length}</Badge>
          </TabsTrigger>
          
          {documentTypes.map(type => (
            <TabsTrigger key={type} value={type}>
              {type} <Badge variant="secondary" className="ml-2">{documentsByType[type]?.length || 0}</Badge>
            </TabsTrigger>
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
      
      {documentTypes.map(type => (
        <TabsContent key={type} value={type} className="mt-0">
          <DocumentsTable 
            documents={documentsByType[type] || []} 
            isLoading={isLoading}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};
