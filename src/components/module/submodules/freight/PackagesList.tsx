
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
import { Eye, Printer, FileText, Trash } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { Shipment } from '@/hooks/freight/useFreightShipments';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import PackageDetailsDialog from './packages/PackageDetailsDialog';
import DeletePackageDialog from './packages/DeletePackageDialog';
import { toast } from 'sonner';

interface PackagesListProps {
  packages: Shipment[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

const PackagesList: React.FC<PackagesListProps> = ({ packages, isLoading = false, onRefresh }) => {
  const [selectedPackage, setSelectedPackage] = React.useState<Shipment | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  
  // Fonction sécurisée pour formater les dates
  const safeFormatDate = (dateValue: any) => {
    if (!dateValue) return '-';
    
    // Si c'est un Timestamp Firestore (avec seconds et nanoseconds)
    if (dateValue && typeof dateValue === 'object' && 'seconds' in dateValue) {
      try {
        const date = new Date(dateValue.seconds * 1000);
        return format(date, 'dd MMM yyyy', { locale: fr });
      } catch (error) {
        console.error('Error formatting Firestore timestamp:', error);
        return '-';
      }
    }
    
    // Si c'est une chaîne de date
    if (typeof dateValue === 'string') {
      try {
        return format(new Date(dateValue), 'dd MMM yyyy', { locale: fr });
      } catch (error) {
        console.error('Invalid date string:', dateValue, error);
        return '-';
      }
    }
    
    // Si c'est déjà un objet Date
    if (dateValue instanceof Date) {
      try {
        return format(dateValue, 'dd MMM yyyy', { locale: fr });
      } catch (error) {
        console.error('Error formatting Date object:', error);
        return '-';
      }
    }
    
    return '-';
  };
  
  const getStatusInfo = (status: string): { type: "success" | "warning" | "danger", text: string } => {
    switch (status) {
      case 'delivered':
        return { type: 'success', text: 'Livré' };
      case 'shipped':
        return { type: 'warning', text: 'Expédié' };
      case 'confirmed':
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

  const handlePackageDeleted = () => {
    toast.success("Colis supprimé avec succès");
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleDeleteClick = (pkg: Shipment) => {
    setSelectedPackage(pkg);
    setIsDeleteDialogOpen(true);
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
              <TableHead>Client</TableHead>
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
                    <TableCell>{pkg.customerName || '-'}</TableCell>
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
                      {safeFormatDate(pkg.createdAt)}
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
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteClick(pkg)}
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
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
        <>
          <PackageDetailsDialog
            open={!!selectedPackage && !isDeleteDialogOpen}
            onOpenChange={(open) => !open && setSelectedPackage(null)}
            packageData={selectedPackage}
          />
          
          <DeletePackageDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            shipment={selectedPackage}
            onDeleted={handlePackageDeleted}
          />
        </>
      )}
    </>
  );
};

export default PackagesList;
