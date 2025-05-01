
import React from 'react';
import { MoreVertical, Trash2 } from 'lucide-react';
import { DocumentIcon } from './DocumentIcon'; 
import { DocumentFile } from '../types/document-types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { formatFileSize, formatDate } from '../utils/formatUtils';
import { HrDocument } from '@/hooks/useDocumentsData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DocumentGridItemProps {
  document: DocumentFile | HrDocument;
  selected?: boolean;
  onSelect?: (document: DocumentFile | HrDocument) => void;
  onDelete?: (documentId: string) => void;
}

export const DocumentGridItem: React.FC<DocumentGridItemProps> = ({
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
  
  // Handle employee information if available
  const hasEmployeeInfo = 'employeeName' in document && document.employeeName;
  
  return (
    <div 
      className={`relative group rounded-md border p-3 hover:shadow-md transition-all cursor-pointer ${selected ? 'ring-2 ring-primary' : ''}`}
      onClick={() => onSelect(document)}
    >
      <div className="absolute right-2 top-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Options</span>
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

      <div className="flex flex-col items-center gap-2 mb-2">
        <DocumentIcon fileType={type} size={48} />
        <div className="text-sm font-medium text-center line-clamp-2" title={documentTitle}>
          {documentTitle}
        </div>
      </div>

      <div className="text-xs text-muted-foreground flex flex-col gap-1 mt-2">
        <div className="flex justify-between items-center">
          <span>Type:</span>
          <span className="font-medium">{type}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span>Date:</span>
          <span>{dateDisplay}</span>
        </div>
        
        {'fileSize' in document && document.fileSize && (
          <div className="flex justify-between items-center">
            <span>Taille:</span>
            <span>{typeof document.fileSize === 'number' ? formatFileSize(document.fileSize) : document.fileSize}</span>
          </div>
        )}
        
        {'position' in document && document.position && (
          <div className="flex justify-between items-center">
            <span>Poste:</span>
            <span>{document.position}</span>
          </div>
        )}
        
        {'status' in document && document.status && (
          <div className="flex justify-between items-center">
            <span>Statut:</span>
            <span>{document.status}</span>
          </div>
        )}
        
        {hasEmployeeInfo && (
          <div className="flex items-center gap-2 mt-2 border-t pt-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={'employeePhoto' in document ? document.employeePhoto : undefined} />
              <AvatarFallback>{('employeeName' in document && document.employeeName) ? document.employeeName.charAt(0) : '?'}</AvatarFallback>
            </Avatar>
            <span className="text-xs truncate">{'employeeName' in document ? document.employeeName : ''}</span>
          </div>
        )}
      </div>
    </div>
  );
};
