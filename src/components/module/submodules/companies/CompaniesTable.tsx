
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
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CompaniesTableProps {
  companies: Company[];
  loading: boolean;
  onView: (company: Company) => void;
  onEdit?: (company: Company) => void;
  onDelete?: (company: Company) => void;
}

const CompaniesTable: React.FC<CompaniesTableProps> = ({
  companies,
  loading,
  onView,
  onEdit,
  onDelete
}) => {
  // Helper function to safely format dates
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: fr });
    } catch (error) {
      return "—";
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>SIRET/Numéro</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Date de création</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
              Chargement des entreprises...
            </TableCell>
          </TableRow>
        ) : companies.length > 0 ? (
          companies.map((company) => (
            <TableRow 
              key={company.id} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onView(company)}
            >
              <TableCell className="font-medium">{company.name}</TableCell>
              <TableCell>{company.siret || company.registrationNumber || "—"}</TableCell>
              <TableCell>{company.contactEmail || company.contactName || "—"}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  company.status === 'active' ? 'bg-green-100 text-green-800' :
                  company.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                  company.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {company.status === 'active' ? 'Actif' :
                   company.status === 'inactive' ? 'Inactif' :
                   company.status === 'pending' ? 'En attente' : '—'}
                </span>
              </TableCell>
              <TableCell>
                {company.createdAt ? formatDate(company.createdAt) : "—"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2" onClick={e => e.stopPropagation()}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(company);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {onEdit && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(company);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(company);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
              Aucune entreprise trouvée
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default CompaniesTable;
