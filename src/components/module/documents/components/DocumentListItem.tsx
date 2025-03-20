
import React from 'react';
import { DocumentFile } from '../types/document-types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Archive, 
  Trash2,
  Lock
} from 'lucide-react';
import { formatFileSize } from '../utils/formatUtils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DocumentIcon } from './DocumentIcon';

interface DocumentListItemProps {
  document: DocumentFile;
  selected: boolean;
  onSelect: (document: DocumentFile) => void;
  onDelete: (documentId: string) => void;
}

export const DocumentListItem: React.FC<DocumentListItemProps> = ({
  document,
  selected,
  onSelect,
  onDelete
}) => {
  return (
    <div 
      className={`border rounded-md p-3 flex justify-between items-center hover:bg-gray-50 cursor-pointer transition-colors ${
        selected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={() => onSelect(document)}
    >
      <div className="flex items-center space-x-3">
        <DocumentIcon format={document.format} />
        <div>
          <h3 className="font-medium" title={document.name}>
            {document.name.length > 30 ? document.name.substring(0, 30) + '...' : document.name}
          </h3>
          <div className="flex items-center text-xs text-muted-foreground">
            <span>{formatFileSize(document.size)}</span>
            <span className="mx-1">•</span>
            <Badge variant="outline" className="text-xs h-5">
              {document.format.toUpperCase()}
            </Badge>
            {document.isEncrypted && (
              <Lock className="h-3 w-3 ml-1" aria-label="Fichier chiffré" />
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center">
        <div className="text-xs text-muted-foreground mr-3 hidden md:block">
          {format(new Date(document.createdAt), 'Pp', { locale: fr })}
        </div>
        
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={e => {
            e.stopPropagation();
            // Handle download
          }}>
            <Download className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={e => {
            e.stopPropagation();
            // Handle archive
          }}>
            <Archive className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={e => {
            e.stopPropagation();
            onDelete(document.id);
          }}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
