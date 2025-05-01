
import React from 'react';
import { DocumentFile } from '../types/document-types';
import { HrDocument } from '@/hooks/useDocumentsData';
import { DocumentIcon } from './DocumentIcon';
import { cn } from '@/lib/utils';
import { formatFileSize, formatDate } from '../utils/formatUtils';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Download, Trash2, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DocumentListItemProps {
  document: DocumentFile | HrDocument;
  selected?: boolean;
  onSelect?: (document: DocumentFile | HrDocument) => void;
  onDelete?: (documentId: string) => void;
}

export const DocumentListItem: React.FC<DocumentListItemProps> = ({
  document,
  selected = false,
  onSelect = () => {},
  onDelete = () => {},
}) => {
  // Handle empty or undefined fields
  const name = document.name || 'Document sans titre';
  const documentTitle = 'title' in document ? document.title : name;
  const type = document.type || 'Autre';
  const dateValue = 'uploadDate' in document ? document.uploadDate : (document.createdAt || 'Date inconnue');
  const dateDisplay = formatDate(dateValue);
  
  return (
    <div
      className={cn(
        "flex items-center space-x-4 p-3 rounded-md border hover:bg-muted/30 cursor-pointer",
        selected && "ring-2 ring-primary bg-muted/20"
      )}
      onClick={() => onSelect(document)}
    >
      <div className="flex-shrink-0">
        <DocumentIcon fileType={type} size={36} />
      </div>
      
      <div className="flex-grow min-w-0">
        <div className="font-medium truncate">{documentTitle}</div>
        <div className="text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 mt-1">
          <span>Type: {type}</span>
          <span>Date: {dateDisplay}</span>
          {document && 'fileSize' in document && document.fileSize && (
            <span>Taille: {typeof document.fileSize === 'number' ? formatFileSize(document.fileSize) : document.fileSize}</span>
          )}
          {'position' in document && document.position && (
            <span>Poste: {document.position}</span>
          )}
          {'status' in document && document.status && (
            <span>Status: {document.status}</span>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            const url = 'url' in document ? document.url : undefined;
            if (url) window.open(url, '_blank');
          }}
        >
          <Eye className="h-4 w-4" />
          <span className="sr-only">Aperçu</span>
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            const url = 'url' in document ? document.url : undefined;
            if (url) window.location.href = url;
          }}
        >
          <Download className="h-4 w-4" />
          <span className="sr-only">Télécharger</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Plus d'options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              const url = 'url' in document ? document.url : undefined;
              if (url) window.open(url, '_blank');
            }}>
              Aperçu
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              const url = 'url' in document ? document.url : undefined;
              if (url) window.location.href = url;
            }}>
              Télécharger
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(document.id);
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
