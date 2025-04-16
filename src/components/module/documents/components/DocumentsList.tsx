
import React from 'react';
import { DocumentFile } from '../types/document-types';
import { DocumentsLoading } from './DocumentsLoading';
import { DocumentsEmptyState } from './DocumentsEmptyState';
import { DocumentGridItem } from './DocumentGridItem';
import { DocumentListItem } from './DocumentListItem';

interface DocumentsListProps {
  documents: DocumentFile[];
  isLoading?: boolean;
  view?: 'grid' | 'list';
  onSelect?: (document: DocumentFile) => void;
  onDelete?: (documentId: string) => void;
  selected?: string;
}

export const DocumentsList: React.FC<DocumentsListProps> = ({
  documents,
  isLoading = false,
  view = 'grid',
  onSelect = () => {},
  onDelete = () => {},
  selected
}) => {
  // Loading state
  if (isLoading) {
    return <DocumentsLoading view={view} />;
  }
  
  // Empty state
  if (documents.length === 0) {
    return <DocumentsEmptyState />;
  }
  
  // Grid view
  if (view === 'grid') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {documents.map(document => (
          <DocumentGridItem
            key={document.id}
            document={document}
            selected={selected === document.id}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }
  
  // List view
  return (
    <div className="space-y-2">
      {documents.map(document => (
        <DocumentListItem
          key={document.id}
          document={document}
          selected={selected === document.id}
          onSelect={onSelect}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
