
import React from 'react';
import { Company } from './types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Eye, Trash, Building } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export interface CompaniesTableProps {
  companies: Company[];
  isLoading?: boolean;
  onView: (company: Company) => void;
  onEdit?: (company: Company) => void;
  onDelete?: (company: Company) => void;
}

const CompaniesTable: React.FC<CompaniesTableProps> = ({
  companies,
  isLoading,
  onView,
  onEdit,
  onDelete
}) => {
  // Ensure companies is an array
  const safeCompanies = Array.isArray(companies) ? companies : [];
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Secteur</TableHead>
            <TableHead>Taille</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                Chargement...
              </TableCell>
            </TableRow>
          ) : safeCompanies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                Aucune entreprise trouvée.
              </TableCell>
            </TableRow>
          ) : (
            safeCompanies.map((company) => {
              if (!company) return null;
              
              return (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">{company.name || 'N/A'}</TableCell>
                  <TableCell>{company.industry || 'N/A'}</TableCell>
                  <TableCell>{company.size || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{company.status || 'N/A'}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Ouvrir le menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(company)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Voir
                        </DropdownMenuItem>
                        {onEdit && (
                          <DropdownMenuItem onClick={() => onEdit(company)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                        )}
                        {onDelete && (
                          <DropdownMenuItem onClick={() => onDelete(company)} className="text-destructive">
                            <Trash className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompaniesTable;
