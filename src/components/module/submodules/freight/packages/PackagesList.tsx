
import React from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Printer, FileText } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import type { Shipment } from '@/types/freight';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import PackageDetailsDialog from './PackageDetailsDialog';

interface PackagesListProps {
  packages: Shipment[];
  isLoading?: boolean;
}

const PackagesList: React.FC<PackagesListProps> = ({ packages, isLoading }) => {
  const [selectedPackage, setSelectedPackage] = React.useState<Shipment | null>(null);
  
  // Helper function to safely format dates
  const safeFormatDate = (dateString: string | undefined): string => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date:', dateString);
        return '-';
      }
      return format(date, 'dd MMM yyyy', { locale: fr });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '-';
    }
  };

  const getStatusInfo = (status: string): { type: "success" | "warning" | "danger", text: string } => {
    switch (status) {
      case 'delivered':
        return { type: 'success', text: 'Livré' };
      case 'in_transit':
        return { type: 'warning', text: 'Expédié' };
      case 'confirmed':
        return { type: 'warning', text: 'Prêt' };
      case 'draft':
        return { type: 'danger', text: 'Brouillon' };
      case 'cancelled':
        return { type: 'danger', text: 'Annulé' };
      case 'delayed':
        return { type: 'danger', text: 'Retardé' };
      default:
        return { type: 'danger', text: status };
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-6 text-gray-500">
        Chargement des colis...
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Référence</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>N° Suivi</TableHead>
              <TableHead>Créé le</TableHead>
              <TableHead>Coût</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages.length > 0 ? (
              packages.map((pkg) => {
                const statusInfo = getStatusInfo(pkg.status);
                return (
                  <TableRow key={pkg.id}>
                    <TableCell className="font-medium">{pkg.reference}</TableCell>
                    <TableCell>{pkg.customer || '-'}</TableCell>
                    <TableCell>
                      {pkg.trackingNumber ? 
                        <span className="text-blue-600 hover:underline cursor-pointer">
                          {pkg.trackingNumber}
                        </span> 
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      {safeFormatDate(pkg.createdAt)}
                    </TableCell>
                    <TableCell>
                      {pkg.totalPrice ? `${pkg.totalPrice.toFixed(2)} €` : '-'}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={statusInfo.type}>
                        {statusInfo.text}
                      </StatusBadge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedPackage(pkg)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {pkg.trackingNumber && (
                          <Button variant="ghost" size="sm">
                            <Printer className="h-4 w-4" />
                          </Button>
                        )}
                        {pkg.lines?.length > 0 && (
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                  Aucun colis trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedPackage && (
        <PackageDetailsDialog
          open={!!selectedPackage}
          onOpenChange={(open) => !open && setSelectedPackage(null)}
          packageData={selectedPackage}
        />
      )}
    </>
  );
};

export default PackagesList;
