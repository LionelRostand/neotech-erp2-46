
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";

interface DriversEmptyStateProps {
  error: Error | null;
  searchTerm: string;
}

const DriversEmptyState: React.FC<DriversEmptyStateProps> = ({ error, searchTerm }) => {
  return (
    <TableRow>
      <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
        {error 
          ? "Erreur lors du chargement des données. Veuillez réessayer." 
          : searchTerm
            ? "Aucun chauffeur trouvé pour cette recherche"
            : "Aucun chauffeur disponible"
        }
      </TableCell>
    </TableRow>
  );
};

export default DriversEmptyState;
