import React from 'react';
import { DocumentFile } from '../types/document-types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  MoreHorizontal, 
  Trash2, 
  Download, 
  Archive, 
  Calendar, 
  Search 
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { formatFileSize } from '../utils/formatUtils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export interface SearchResultsProps {
  results: DocumentFile[];
  isLoading: boolean;
  onSelect?: (document: DocumentFile) => void;
  selectedDocument?: DocumentFile | null;
  getDocumentIcon?: (document: DocumentFile) => React.ReactNode;
  searchQuery?: string; // Search query property
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isLoading,
  onSelect = () => {},
  selectedDocument = null,
  getDocumentIcon = () => <Search className="h-4 w-4" />,
  searchQuery = ''
}) => {
  // Loading skeleton
  if (isLoading) {
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
  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <h3 className="text-lg font-medium">Aucun résultat trouvé</h3>
        <p className="text-muted-foreground mt-1 mb-4">
          {searchQuery ? `Aucun document trouvé pour "${searchQuery}"` : "Essayez de modifier vos critères de recherche"}
        </p>
      </div>
    );
  }
  
  // Results table
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Taille</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((doc) => (
            <TableRow 
              key={doc.id} 
              className={`cursor-pointer hover:bg-gray-50 ${
                selectedDocument?.id === doc.id ? 'bg-gray-50' : ''
              }`}
              onClick={() => onSelect(doc)}
            >
              <TableCell>{getDocumentIcon(doc)}</TableCell>
              <TableCell className="font-medium">
                {doc.name.length > 30 ? doc.name.substring(0, 30) + '...' : doc.name}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{doc.format.toUpperCase()}</Badge>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                  <span className="text-sm">
                    {(() => {
                      try {
                        return format(new Date(doc.createdAt), 'PPP', { locale: fr });
                      } catch (e) {
                        console.error('Error formatting date:', e);
                        return 'Date non disponible';
                      }
                    })()}
                  </span>
                </div>
              </TableCell>
              <TableCell>{formatFileSize(doc.size)}</TableCell>
              <TableCell>
                <Badge 
                  variant={doc.status === 'active' ? 'default' : 'secondary'}
                  className={doc.status === 'archived' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100' : ''}
                >
                  {doc.status === 'active' ? 'Actif' : 'Archivé'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
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
                    
                    {doc.status === 'active' ? (
                      <DropdownMenuItem onClick={e => {
                        e.stopPropagation();
                        // Handle archive
                      }}>
                        <Archive className="h-4 w-4 mr-2" />
                        Archiver
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={e => {
                        e.stopPropagation();
                        // Handle restore
                      }}>
                        <Archive className="h-4 w-4 mr-2" />
                        Restaurer
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-600" 
                      onClick={e => {
                        e.stopPropagation();
                        // Handle delete
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
