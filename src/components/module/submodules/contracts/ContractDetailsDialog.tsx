
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Contract } from '@/hooks/useContractsData';
import { formatDate } from '@/lib/formatters';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Briefcase, Building, UserRound, CreditCard } from 'lucide-react';

interface ContractDetailsDialogProps {
  contract: Contract | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContractDetailsDialog: React.FC<ContractDetailsDialogProps> = ({
  contract,
  open,
  onOpenChange,
}) => {
  if (!contract) return null;

  // Fonction pour afficher le bon badge de statut
  const getStatusBadge = (status: 'Actif' | 'À venir' | 'Expiré') => {
    switch (status) {
      case 'Actif':
        return <Badge className="bg-green-500 hover:bg-green-600">Actif</Badge>;
      case 'À venir':
        return <Badge className="bg-blue-500 hover:bg-blue-600">À venir</Badge>;
      case 'Expiré':
        return <Badge className="bg-red-500 hover:bg-red-600">Expiré</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Détails du contrat</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">{contract.employeeName}</h3>
            {getStatusBadge(contract.status)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-2">
              <Briefcase className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Type de contrat</p>
                <p>{contract.type}</p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Building className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Département</p>
                <p>{contract.department || "Non spécifié"}</p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <UserRound className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Poste</p>
                <p>{contract.position}</p>
              </div>
            </div>

            {contract.salary && (
              <div className="flex items-start space-x-2">
                <CreditCard className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Salaire</p>
                  <p>{contract.salary.toLocaleString('fr-FR')} €</p>
                </div>
              </div>
            )}

            <div className="flex items-start space-x-2">
              <CalendarIcon className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Date de début</p>
                <p>{contract.startDate}</p>
              </div>
            </div>

            {contract.endDate && (
              <div className="flex items-start space-x-2">
                <CalendarIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Date de fin</p>
                  <p>{contract.endDate}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContractDetailsDialog;
