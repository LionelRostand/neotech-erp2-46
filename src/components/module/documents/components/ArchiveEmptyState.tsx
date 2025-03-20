
import React from 'react';
import { Archive, FileArchive } from 'lucide-react';

interface ArchiveEmptyStateProps {
  searchQuery?: string;
}

export const ArchiveEmptyState: React.FC<ArchiveEmptyStateProps> = ({ searchQuery }) => {
  if (searchQuery) {
    return (
      <div className="text-center py-8">
        <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <h3 className="text-lg font-medium">Aucun document trouvé</h3>
        <p className="text-muted-foreground mt-1">
          Aucun document archivé ne correspond à "{searchQuery}"
        </p>
      </div>
    );
  }
  
  return (
    <div className="text-center py-8">
      <FileArchive className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
      <h3 className="text-lg font-medium">Aucun document archivé</h3>
      <p className="text-muted-foreground mt-1 mb-4">
        Les documents archivés apparaîtront ici
      </p>
    </div>
  );
};
