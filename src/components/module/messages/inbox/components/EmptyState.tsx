
import React from 'react';
import { Inbox, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  searchTerm?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ searchTerm }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {searchTerm ? (
        <>
          <Search className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Aucun résultat trouvé</h3>
          <p className="text-muted-foreground mt-2 mb-4">
            Aucun message ne correspond à votre recherche "{searchTerm}"
          </p>
        </>
      ) : (
        <>
          <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Boîte de réception vide</h3>
          <p className="text-muted-foreground mt-2 mb-4">
            Vous n'avez pas encore de messages.
          </p>
        </>
      )}
      
      <Button asChild>
        <Link to="/modules/messages/compose">
          Composer un message
        </Link>
      </Button>
    </div>
  );
};

export default EmptyState;
