
import React from 'react';
import { DocumentFile } from '../types/document-types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  MoreHorizontal, 
  Trash2, 
  Download, 
  FileText, 
  Archive, 
  Lock, 
  Calendar,
  FileImage,
  FileCode,
  FileSpreadsheet,
  File, // Changed: Using File instead of FilePpt
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
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DocumentsListProps {
  documents: DocumentFile[];
  isLoading: boolean;
  view: 'grid' | 'list';
  onSelect: (document: DocumentFile) => void;
  onDelete: (documentId: string) => void;
  selected?: string;
}

export const DocumentsList: React.FC<DocumentsListProps> = ({
  documents,
  isLoading,
  view,
  onSelect,
  onDelete,
  selected
}) => {
  // Get icon for document based on format
  const getDocumentIcon = (document: DocumentFile) => {
    const format = document.format.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(format)) {
      return <FileImage className="h-8 w-8 text-blue-500" />;
    }
    
    if (['pdf'].includes(format)) {
      return <FileText className="h-8 w-8 text-red-500" />;
    }
    
    if (['doc', 'docx'].includes(format)) {
      return <FileText className="h-8 w-8 text-blue-700" />;
    }
    
    if (['xls', 'xlsx'].includes(format)) {
      return <FileSpreadsheet className="h-8 w-8 text-green-600" />;
    }
    
    if (['ppt', 'pptx'].includes(format)) {
      // Changed: Using File instead of FilePpt
      return <File className="h-8 w-8 text-orange-500" />;
    }
    
    if (['html', 'css', 'js', 'ts', 'json', 'xml'].includes(format)) {
      return <FileCode className="h-8 w-8 text-green-500" />;
    }
    
    return <FileText className="h-8 w-8 text-gray-500" />;
  };
  
  // Loading skeleton for grid view
  if (isLoading && view === 'grid') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="border rounded-md p-4 space-y-3">
            <div className="flex justify-center">
              <Skeleton className="h-8 w-8" />
            </div>
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <Skeleton className="h-3 w-1/2 mx-auto" />
            <div className="flex justify-center mt-2">
              <Skeleton className="h-6 w-14" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  // Loading skeleton for list view
  if (isLoading && view === 'list') {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="border rounded-md p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-8 w-8" />
              <div>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24 mt-1" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  // Empty state
  if (!isLoading && documents.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <h3 className="text-lg font-medium">Aucun document trouvé</h3>
        <p className="text-muted-foreground mt-1 mb-4">
          Commencez par téléverser des documents
        </p>
      </div>
    );
  }
  
  // Grid view
  if (view === 'grid') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {documents.map(document => (
          <div 
            key={document.id}
            className={`border rounded-md p-4 space-y-2 hover:bg-gray-50 cursor-pointer transition-colors ${
              selected === document.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onSelect(document)}
          >
            <div className="flex justify-center">
              {getDocumentIcon(document)}
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
                    {format(new Date(document.createdAt), 'PPP', { locale: fr })}
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
        ))}
      </div>
    );
  }
  
  // List view
  return (
    <div className="space-y-2">
      {documents.map(document => (
        <div 
          key={document.id}
          className={`border rounded-md p-3 flex justify-between items-center hover:bg-gray-50 cursor-pointer transition-colors ${
            selected === document.id ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => onSelect(document)}
        >
          <div className="flex items-center space-x-3">
            {getDocumentIcon(document)}
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
                  // Fixed: Removed title attribute and added aria-label
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
      ))}
    </div>
  );
};
