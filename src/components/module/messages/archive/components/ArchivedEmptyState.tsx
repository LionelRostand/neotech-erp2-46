
import React from 'react';
import { Archive } from 'lucide-react';

const ArchivedEmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <Archive className="h-12 w-12 mb-2 text-gray-300" />
      <p className="text-lg font-medium text-gray-500 mb-1">
        Aucun message archivé
      </p>
      <p className="text-sm text-gray-400">
        Les messages que vous archivez apparaîtront ici
      </p>
    </div>
  );
};

export default ArchivedEmptyState;
