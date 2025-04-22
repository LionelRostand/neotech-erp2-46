
import React, { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { 
  Eye, 
  Trash, 
  Download, 
  MoreHorizontal,
  FileText,
  Printer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Shipment } from '@/hooks/freight/useFreightShipments';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import PackageDetailsDialog from './packages/PackageDetailsDialog';
import DeletePackageDialog from './packages/DeletePackageDialog';

interface PackagesListProps {
  packages: Shipment[];
  isLoading: boolean;
  onRefresh: () => void;
}

const PackagesList: React.FC<PackagesListProps> = ({ packages, isLoading, onRefresh }) => {
  const [selectedPackage, setSelectedPackage] = useState<Shipment | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const formatDate = (dateValue: any): string => {
    if (!dateValue) return "-";
    
    // Handle Firebase timestamp (object with seconds and nanoseconds)
    if (dateValue && typeof dateValue === 'object' && 'seconds' in dateValue) {
      try {
        const date = new Date(dateValue.seconds * 1000);
        return format(date, "dd MMM yyyy", { locale: fr });
      } catch (error) {
        console.error("Error formatting timestamp:", error);
        return "Date invalide";
      }
    }
    
    // Handle string dates
    if (typeof dateValue === 'string') {
      try {
        return format(new Date(dateValue), "dd MMM yyyy", { locale: fr });
      } catch (error) {
        console.error("Error formatting date string:", error);
        return dateValue;
      }
    }
    
    // Handle Date objects
    if (dateValue instanceof Date) {
      try {
        return format(dateValue, "dd MMM yyyy", { locale: fr });
      } catch (error) {
        console.error("Error formatting Date object:", error);
        return "Date invalide";
      }
    }
    
    return "Format de date non reconnu";
  };

  const handleViewDetails = (pkg: Shipment) => {
    setSelectedPackage(pkg);
    setDetailsDialogOpen(true);
  };

  const handleDelete = (pkg: Shipment) => {
    setSelectedPackage(pkg);
    setDeleteDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return <Badge variant="outline">Brouillon</Badge>;
      case 'confirmed':
        return <Badge className="bg-green-500">Prêt</Badge>;
      case 'in_transit':
        return <Badge className="bg-blue-500">En transit</Badge>;
      case 'delivered':
        return <Badge className="bg-green-700">Livré</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Annulé</Badge>;
      case 'delayed':
        return <Badge className="bg-amber-500">Retardé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const columns = [
    {
      header: "Référence",
      accessorKey: "reference",
    },
    {
      header: "Client",
      accessorKey: "customerName",
      cell: ({ row }: any) => <span>{row.original.customerName || "-"}</span>
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: ({ row }: any) => <span>{row.original.description || "-"}</span>
    },
    {
      header: "Poids",
      accessorKey: "weight",
      cell: ({ row }: any) => (
        <span>
          {row.original.weight} {row.original.weightUnit || "kg"}
        </span>
      ),
    },
    {
      header: "Transporteur",
      accessorKey: "carrierName",
      cell: ({ row }: any) => <span>{row.original.carrierName || "-"}</span>
    },
    {
      header: "N° Suivi",
      accessorKey: "trackingNumber",
      cell: ({ row }: any) => <span>{row.original.trackingNumber || "-"}</span>
    },
    {
      header: "Créé le",
      accessorKey: "createdAt",
      cell: ({ row }: any) => <span>{formatDate(row.original.createdAt)}</span>
    },
    {
      header: "Statut",
      accessorKey: "status",
      cell: ({ row }: any) => getStatusBadge(row.original.status)
    },
    {
      header: "Actions",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => handleViewDetails(row.original)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleViewDetails(row.original)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" /> Voir détails
              </DropdownMenuItem>
              {row.original.labelGenerated && (
                <DropdownMenuItem className="flex items-center gap-2">
                  <Printer className="h-4 w-4" /> Imprimer étiquette
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="flex items-center gap-2">
                <FileText className="h-4 w-4" /> Documents
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Download className="h-4 w-4" /> Exporter
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleDelete(row.original)}
                className="flex items-center gap-2 text-red-600 focus:text-red-600"
              >
                <Trash className="h-4 w-4" /> Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={packages}
        isLoading={isLoading}
        emptyMessage="Aucun colis trouvé"
      />
      
      <PackageDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        packageData={selectedPackage}
      />
      
      <DeletePackageDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        shipment={selectedPackage}
        onDeleted={onRefresh}
      />
    </>
  );
};

export default PackagesList;
