
import React from 'react';
import { FileText } from 'lucide-react';

export const DocumentsEmptyState: React.FC = () => {
  return (
    <div className="text-center py-8">
      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
      <h3 className="text-lg font-medium">Aucun document trouvé</h3>
      <p className="text-muted-foreground mt-1 mb-4">
        Commencez par téléverser des documents
      </p>
    </div>
  );
};
