
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
import { Eye, Pencil, Trash2 } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import type { Shipment } from '@/types/freight';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import ViewPackageDialog from './ViewPackageDialog';
import EditPackageDialog from './EditPackageDialog';
import { deleteShipment } from '../services/shipmentService';
import { toast } from 'sonner';

interface PackagesListProps {
  packages: Shipment[];
  isLoading?: boolean;
}

const PackagesList: React.FC<PackagesListProps> = ({ packages, isLoading }) => {
  const [selectedPackage, setSelectedPackage] = React.useState<Shipment | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [packageToDelete, setPackageToDelete] = React.useState<Shipment | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

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

  // Handler suppression
  const handleDelete = async () => {
    if (!packageToDelete) return;
    setIsDeleting(true);
    try {
      await deleteShipment(packageToDelete.id);
      toast.success("Colis supprimé avec succès");
      setDeleteDialogOpen(false);
    } catch (err) {
      toast.error("Erreur lors de la suppression : " + (err instanceof Error ? err.message : ""));
    } finally {
      setIsDeleting(false);
    }
  };

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
                          onClick={() => {
                            setSelectedPackage(pkg);
                            setViewDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedPackage(pkg);
                            setEditDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setPackageToDelete(pkg);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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

      {/* Voir */}
      <ViewPackageDialog
        open={viewDialogOpen}
        onOpenChange={(open) => {
          setViewDialogOpen(open);
          if (!open) setSelectedPackage(null);
        }}
        packageData={selectedPackage}
      />

      {/* Modifier */}
      <EditPackageDialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) setSelectedPackage(null);
        }}
        packageData={selectedPackage}
      />

      {/* Supprimer */}
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        packageData={packageToDelete}
      />
    </>
  );
};

// Dialogue de suppression de colis
const DeleteDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  packageData: Shipment | null;
}> = ({ open, onClose, onConfirm, isDeleting, packageData }) => {
  if (!packageData) return null;
  return (
    <div>
      <div className={`fixed inset-0 z-50 bg-black bg-opacity-40 ${open ? "" : "hidden"}`} />
      <div className={`fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 ${open ? "" : "hidden"} transition-all`}>
        <h2 className="text-lg font-bold mb-2">Supprimer ce colis ?</h2>
        <p>Le colis <span className="font-semibold">{packageData.reference}</span> sera définitivement supprimé !</p>
        <div className="flex gap-2 justify-end mt-6">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Annuler
          </Button>
          <Button className="bg-red-600 hover:bg-red-700" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting && <span className="mr-2 animate-spin"><svg width={18} height={18} fill="none" viewBox="0 0 24 24"><circle cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} opacity={.3}/><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth={4} strokeLinecap="round"/></svg></span>}
            Supprimer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PackagesList;
