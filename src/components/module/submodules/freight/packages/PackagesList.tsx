import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shipment } from "@/hooks/freight/useFreightShipments";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import PackageDetailsDialog from "./PackageDetailsDialog";
import EditPackageDialog from "./EditPackageDialog";
import { deleteShipment } from "../services/shipmentService";
import { toast } from "sonner";

const ConfirmDeleteDialog: React.FC<{
  open: boolean,
  onOpenChange: (v: boolean) => void,
  onConfirm: () => void,
  isLoading: boolean,
  reference?: string
}> = ({ open, onOpenChange, onConfirm, isLoading, reference }) => (
  <div className={open ? "fixed inset-0 z-50 flex items-center justify-center bg-black/40" : "hidden"}>
    <div className="bg-white rounded p-6 max-w-md w-full">
      <div className="font-semibold text-lg mb-2">Confirmer la suppression</div>
      <div className="mb-4">
        Êtes-vous sûr de vouloir supprimer le colis <span className="font-bold">{reference}</span> ? Cette action est irréversible.
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
          Annuler
        </Button>
        <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? "Suppression..." : "Supprimer"}
        </Button>
      </div>
    </div>
  </div>
);

interface PackagesListProps {
  packages: Shipment[];
  isLoading: boolean;
  onRefresh?: () => void;
}

const PackagesList: React.FC<PackagesListProps> = ({ packages, isLoading, onRefresh }) => {
  const [selectedPackage, setSelectedPackage] = React.useState<Shipment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [editPackage, setEditPackage] = React.useState<Shipment | null>(null);

  const [deletePackage, setDeletePackage] = React.useState<Shipment | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const getTotalCost = (pkg: Shipment) => {
    if (Array.isArray(pkg.lines) && pkg.lines.length > 0) {
      const sum = pkg.lines.reduce((total: number, line: any) => total + ((line.cost ?? 0) * (line.quantity ?? 1)), 0);
      return `${sum.toFixed(2)} €`;
    }
    if (typeof pkg.totalPrice === "number") {
      return `${(pkg.totalPrice).toFixed(2)} €`;
    }
    return "0 €";
  };

  const getStatusBadge = (status: string | undefined) => {
    if (!status) return <Badge variant="outline">Inconnu</Badge>;
    switch (status.toLowerCase()) {
      case 'draft': return <Badge variant="outline">Brouillon</Badge>;
      case 'confirmed': return <Badge className="bg-blue-500">Confirmé</Badge>;
      case 'in_transit': return <Badge className="bg-yellow-500">En transit</Badge>;
      case 'delivered': return <Badge className="bg-green-500">Livré</Badge>;
      case 'cancelled': return <Badge className="bg-red-500">Annulé</Badge>;
      case 'delayed': return <Badge className="bg-orange-500">Retardé</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateValue: any): string => {
    if (!dateValue) return "-";
    if (dateValue && typeof dateValue === 'object' && 'seconds' in dateValue) {
      try {
        const date = new Date(dateValue.seconds * 1000);
        return format(date, "dd MMM yyyy", { locale: fr });
      } catch (error) {
        return "Date invalide";
      }
    }
    if (typeof dateValue === 'string') {
      try {
        return format(new Date(dateValue), "dd MMM yyyy", { locale: fr });
      } catch (error) {
        return dateValue;
      }
    }
    return "Format de date non reconnu";
  };

  const handleViewDetails = (pkg: Shipment) => {
    setSelectedPackage(pkg);
    setIsDetailsOpen(true);
  };

  const handleEdit = (pkg: Shipment) => {
    setEditPackage(pkg);
    setIsEditOpen(true);
  };

  const handleDelete = (pkg: Shipment) => {
    setDeletePackage(pkg);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletePackage) return;
    setIsDeleting(true);
    try {
      await deleteShipment(deletePackage.id);
      toast.success("Colis supprimé avec succès");
      setIsDeleteDialogOpen(false);
      setDeletePackage(null);
      onRefresh?.();
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Chargement...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>RÉFÉRENCE</TableHead>
            <TableHead>CLIENT</TableHead>
            <TableHead>COÛT</TableHead>
            <TableHead>TRANSPORTEUR</TableHead>
            <TableHead>N° SUIVI</TableHead>
            <TableHead>CRÉÉ LE</TableHead>
            <TableHead>STATUT</TableHead>
            <TableHead>ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {packages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground">Aucun colis trouvé</TableCell>
            </TableRow>
          ) : (
            packages.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell>{pkg.reference || "-"}</TableCell>
                <TableCell>{pkg.customerName || "-"}</TableCell>
                <TableCell>{getTotalCost(pkg)}</TableCell>
                <TableCell>{pkg.carrierName || "-"}</TableCell>
                <TableCell>{pkg.trackingNumber || "-"}</TableCell>
                <TableCell>{formatDate(pkg.createdAt)}</TableCell>
                <TableCell>{getStatusBadge(pkg.status)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(pkg)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(pkg)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(pkg)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <PackageDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        packageData={selectedPackage}
      />

      <EditPackageDialog
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) setEditPackage(null);
        }}
        packageData={editPackage}
        onSuccess={onRefresh}
      />

      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) setDeletePackage(null);
        }}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        reference={deletePackage?.reference}
      />
    </div>
  );
};

export default PackagesList;
