import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shipment } from "@/hooks/freight/useFreightShipments";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import PackageDetailsDialog from "./PackageDetailsDialog";

interface PackagesListProps {
  packages: Shipment[];
  isLoading: boolean;
  onRefresh?: () => void;
}

const PackagesList: React.FC<PackagesListProps> = ({ packages, isLoading, onRefresh }) => {
  const [selectedPackage, setSelectedPackage] = React.useState<Shipment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);

  // Calcule le coût total d'un colis (somme des coûts de chaque ligne)
  const getTotalCost = (pkg: Shipment) => {
    // Certaines expéditions ont un champ lines, d'autres un champ cost ou coût unique
    // On regarde d'abord s'il y a un champ lines (array d'objets avec un champ cost)
    if (Array.isArray((pkg as any).lines) && (pkg as any).lines.length > 0) {
      const sum = (pkg as any).lines.reduce((total: number, line: any) => total + ((line.cost ?? 0) * (line.quantity ?? 1)), 0);
      return `${sum.toFixed(2)} €`;
    }
    // On regarde s'il y a un champ cost unique
    if (typeof (pkg as any).cost === "number") {
      return `${((pkg as any).cost).toFixed(2)} €`;
    }
    // Par défaut 0€
    return "0 €";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Brouillon</Badge>;
      case 'confirmed':
        return <Badge className="bg-blue-500">Confirmé</Badge>;
      case 'in_transit':
        return <Badge className="bg-yellow-500">En transit</Badge>;
      case 'delivered':
        return <Badge className="bg-green-500">Livré</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Annulé</Badge>;
      case 'delayed':
        return <Badge className="bg-orange-500">Retardé</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateValue: any): string => {
    if (!dateValue) return "-";
    
    // Handle Firebase timestamp (object with seconds and nanoseconds)
    if (dateValue && typeof dateValue === 'object' && 'seconds' in dateValue) {
      try {
        const date = new Date(dateValue.seconds * 1000);
        return format(date, "dd MMM yyyy", { locale: fr });
      } catch (error) {
        return "Date invalide";
      }
    }
    
    // Handle string dates
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
            <TableHead>DATE</TableHead>
            <TableHead>ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {packages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">Aucun colis trouvé</TableCell>
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
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(pkg)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
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
    </div>
  );
};

export default PackagesList;
