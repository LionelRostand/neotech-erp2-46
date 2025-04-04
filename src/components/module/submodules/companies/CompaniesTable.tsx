
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Company } from './types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Users, FileText, Building } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CompaniesTableProps {
  companies: Company[];
  isLoading: boolean;
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
  onManageEmployees?: (company: Company) => void;
  onManageDocuments?: (company: Company) => void;
  onViewDetails?: (company: Company) => void;
}

const CompaniesTable: React.FC<CompaniesTableProps> = ({
  companies,
  isLoading,
  onEdit,
  onDelete,
  onManageEmployees,
  onManageDocuments,
  onViewDetails
}) => {
  // Format address as single line text
  const formatAddress = (address: any) => {
    if (!address) return '-';
    
    const parts = [];
    if (address.street) parts.push(address.street);
    if (address.city) parts.push(address.city);
    if (address.postalCode) parts.push(address.postalCode);
    if (address.country) parts.push(address.country);
    
    return parts.length > 0 ? parts.join(', ') : '-';
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">Entreprise</TableHead>
            <TableHead>Adresse</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Créée le</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                Chargement des entreprises...
              </TableCell>
            </TableRow>
          ) : companies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                Aucune entreprise trouvée
              </TableCell>
            </TableRow>
          ) : (
            companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="font-semibold">{company.name}</span>
                    <span className="text-xs text-gray-500">SIRET: {company.siret || 'Non renseigné'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {formatAddress(company.address)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{company.email || '-'}</span>
                    <span className="text-xs text-gray-500">{company.phone || '-'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    className={
                      company.status === 'active' 
                        ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                        : company.status === 'inactive'
                        ? 'bg-red-100 text-red-800 hover:bg-red-100'
                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                    }
                  >
                    {company.status === 'active' 
                      ? 'Actif' 
                      : company.status === 'inactive' 
                      ? 'Inactif' 
                      : 'En attente'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {company.createdAt 
                    ? format(new Date(company.createdAt), 'dd/MM/yyyy', { locale: fr })
                    : '-'
                  }
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    {onViewDetails && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onViewDetails(company)}
                        title="Voir détails"
                      >
                        <Building className="h-4 w-4" />
                      </Button>
                    )}
                    {onManageEmployees && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onManageEmployees(company)}
                        title="Gérer les employés"
                      >
                        <Users className="h-4 w-4" />
                      </Button>
                    )}
                    {onManageDocuments && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onManageDocuments(company)}
                        title="Gérer les documents"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onEdit(company)}
                      title="Modifier"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onDelete(company)}
                      title="Supprimer"
                      className="text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompaniesTable;
