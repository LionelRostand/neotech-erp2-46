
import React from 'react';
import { DocumentFile } from '../types/document-types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal, 
  Trash2, 
  Download, 
  Archive, 
  Lock, 
  Calendar,
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatFileSize } from '../utils/formatUtils';
import { format, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DocumentIcon } from './DocumentIcon';

interface DocumentGridItemProps {
  document: DocumentFile;
  selected: boolean;
  onSelect: (document: DocumentFile) => void;
  onDelete: (documentId: string) => void;
}

export const DocumentGridItem: React.FC<DocumentGridItemProps> = ({
  document,
  selected,
  onSelect,
  onDelete
}) => {
  // Function to safely format date with validation
  const formatSafeDate = (date: Date | string | number | null | undefined) => {
    if (!date) return 'Date inconnue';
    
    // If it's a string, try to convert it to a date object
    const dateObj = typeof date === 'string' || typeof date === 'number' 
      ? new Date(date) 
      : date;
    
    // Validate the date is actually valid before formatting
    if (!dateObj || !isValid(dateObj)) {
      return 'Date invalide';
    }
    
    try {
      return format(dateObj, 'PPP', { locale: fr });
    } catch (error) {
      console.error('Error formatting date:', error, dateObj);
      return 'Date invalide';
    }
  };

  return (
    <div 
      className={`border rounded-md p-4 space-y-2 hover:bg-gray-50 cursor-pointer transition-colors ${
        selected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={() => onSelect(document)}
    >
      <div className="flex justify-center">
        <DocumentIcon format={document.format} />
      </div>
      <h3 className="font-medium text-center truncate" title={document.name}>
        {document.name}
      </h3>
      <div className="flex justify-center items-center gap-1 text-xs text-muted-foreground">
        <span>{formatFileSize(document.size)}</span>
        {document.isEncrypted && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Lock className="h-3 w-3 ml-1" />
              </TooltipTrigger>
              <TooltipContent>Fichier chiffré</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="flex justify-center pt-1">
        <Badge variant="outline" className="text-xs">
          {document.format.toUpperCase()}
        </Badge>
      </div>
      <div className="flex justify-between items-center mt-2 pt-1 border-t">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              {formatSafeDate(document.createdAt)}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={e => {
              e.stopPropagation();
              // Handle download
            }}>
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </DropdownMenuItem>
            <DropdownMenuItem onClick={e => {
              e.stopPropagation();
              // Handle archive
            }}>
              <Archive className="h-4 w-4 mr-2" />
              Archiver
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600" 
              onClick={e => {
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
