
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
import { Package } from '@/types/freight';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import PackageDetailsDialog from './packages/PackageDetailsDialog';

interface PackagesListProps {
  packages: Package[];
  isLoading?: boolean; // Add optional loading prop
}

const PackagesList: React.FC<PackagesListProps> = ({ packages, isLoading = false }) => {
  const [selectedPackage, setSelectedPackage] = React.useState<Package | null>(null);
  
  const getStatusInfo = (status: string): { type: "success" | "warning" | "danger", text: string } => {
    switch (status) {
      case 'delivered':
        return { type: 'success', text: 'Livré' };
      case 'shipped':
        return { type: 'warning', text: 'Expédié' };
      case 'ready':
        return { type: 'warning', text: 'Prêt' };
      case 'draft':
        return { type: 'danger', text: 'Brouillon' };
      case 'returned':
        return { type: 'danger', text: 'Retourné' };
      case 'lost':
        return { type: 'danger', text: 'Perdu' };
      default:
        return { type: 'danger', text: status };
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
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
              <TableHead>Client</TableHead> {/* New column for client */}
              <TableHead>Description</TableHead>
              <TableHead>Poids</TableHead>
              <TableHead>Transporteur</TableHead>
              <TableHead>N° Suivi</TableHead>
              <TableHead>Créé le</TableHead>
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
                    <TableCell>{pkg.customer || '-'}</TableCell> {/* Display customer name */}
                    <TableCell>{pkg.description || '-'}</TableCell>
                    <TableCell>{pkg.weight} {pkg.weightUnit}</TableCell>
                    <TableCell>{pkg.carrierName || '-'}</TableCell>
                    <TableCell>
                      {pkg.trackingNumber ? 
                        <span className="text-blue-600 hover:underline cursor-pointer">
                          {pkg.trackingNumber}
                        </span> 
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      {format(new Date(pkg.createdAt), 'dd MMM yyyy', { locale: fr })}
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
                        {pkg.labelGenerated && (
                          <Button variant="ghost" size="sm">
                            <Printer className="h-4 w-4" />
                          </Button>
                        )}
                        {pkg.documents && pkg.documents.length > 0 && (
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
                <TableCell colSpan={9} className="text-center py-6 text-gray-500">
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
