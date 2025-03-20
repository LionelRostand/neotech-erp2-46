
import { useState, useMemo } from 'react';
import { DocumentFile } from '../../../documents/types/document-types';

export const useDocumentFilters = (documents: DocumentFile[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const handleSort = (by: 'name' | 'date' | 'size') => {
    if (sortBy === by) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(by);
      setSortDirection('asc');
    }
  };

  const filteredDocuments = useMemo(() => {
    return documents
      .filter(doc => 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .sort((a, b) => {
        if (sortBy === 'name') {
          return sortDirection === 'asc' 
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        } else if (sortBy === 'size') {
          return sortDirection === 'asc'
            ? a.size - b.size
            : b.size - a.size;
        } else {
          return sortDirection === 'asc'
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
  }, [documents, searchQuery, sortBy, sortDirection]);

  return {
    searchQuery,
    setSearchQuery,
    sortBy,
    sortDirection,
    handleSort,
    view,
    setView,
    filteredDocuments
  };
};
