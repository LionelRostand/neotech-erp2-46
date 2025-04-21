import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, MoreHorizontal, FileText, Trash2, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Shipment } from "@/types/freight";
import useFreightData from "@/hooks/modules/useFreightData";
import { useNavigate } from "react-router-dom";
import ShipmentCreateDialog from "./ShipmentCreateDialog";
import { formatDate } from "@/lib/utils";

const FreightShipmentsPage = () => {
  const navigate = useNavigate();
  const { shipments, loading } = useFreightData();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Filter shipments based on search term and active tab
  const filteredShipments = shipments
    .filter((shipment: Shipment) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        shipment.reference.toLowerCase().includes(searchLower) ||
        shipment.customer.toLowerCase().includes(searchLower) ||
        shipment.origin.toLowerCase().includes(searchLower) ||
        shipment.destination.toLowerCase().includes(searchLower)
      );
    })
    .filter((shipment: Shipment) => {
      if (activeTab === "all") return true;
      if (activeTab === "active") return ["confirmed", "in_transit"].includes(shipment.status);
      if (activeTab === "completed") return shipment.status === "delivered";
      if (activeTab === "draft") return shipment.status === "draft";
      return true;
    });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Brouillon</Badge>;
      case "confirmed":
        return <Badge className="bg-blue-500">Confirmé</Badge>;
      case "in_transit":
        return <Badge className="bg-amber-500">En transit</Badge>;
      case "delivered":
        return <Badge className="bg-green-500">Livré</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Annulé</Badge>;
      case "delayed":
        return <Badge className="bg-purple-500">Retardé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleCreateShipment = () => {
    setIsCreateDialogOpen(true);
  };

  const handleEditShipment = (id: string) => {
    navigate(`/modules/freight/shipments/${id}/edit`);
  };

  const handleViewDetails = (id: string) => {
    navigate(`/modules/freight/shipments/${id}`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Expéditions</h1>
        <Button onClick={handleCreateShipment}>
          <Plus className="mr-2 h-4 w-4" /> Nouvelle Expédition
        </Button>
      </div>

      <div className="mb-6">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="active">En cours</TabsTrigger>
              <TabsTrigger value="completed">Terminées</TabsTrigger>
              <TabsTrigger value="draft">Brouillons</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="all" className="m-0">
            <ShipmentsTable
              shipments={filteredShipments}
              loading={loading}
              getStatusBadge={getStatusBadge}
              onEdit={handleEditShipment}
              onView={handleViewDetails}
            />
          </TabsContent>
          <TabsContent value="active" className="m-0">
            <ShipmentsTable
              shipments={filteredShipments}
              loading={loading}
              getStatusBadge={getStatusBadge}
              onEdit={handleEditShipment}
              onView={handleViewDetails}
            />
          </TabsContent>
          <TabsContent value="completed" className="m-0">
            <ShipmentsTable
              shipments={filteredShipments}
              loading={loading}
              getStatusBadge={getStatusBadge}
              onEdit={handleEditShipment}
              onView={handleViewDetails}
            />
          </TabsContent>
          <TabsContent value="draft" className="m-0">
            <ShipmentsTable
              shipments={filteredShipments}
              loading={loading}
              getStatusBadge={getStatusBadge}
              onEdit={handleEditShipment}
              onView={handleViewDetails}
            />
          </TabsContent>
        </Tabs>
      </div>

      <ShipmentCreateDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </div>
  );
};

interface ShipmentsTableProps {
  shipments: Shipment[];
  loading: boolean;
  getStatusBadge: (status: string) => React.ReactNode;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
}

const ShipmentsTable: React.FC<ShipmentsTableProps> = ({
  shipments,
  loading,
  getStatusBadge,
  onEdit,
  onView,
}) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-40">
            <p className="text-muted-foreground">Chargement des expéditions...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (shipments.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col justify-center items-center h-40">
            <p className="text-muted-foreground mb-2">Aucune expédition trouvée</p>
            <p className="text-sm text-muted-foreground">
              Créez une nouvelle expédition pour commencer
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th className="px-4 py-3 text-left text-sm font-medium">Référence</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Client</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Origine</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Destination</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Prévue</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Coût</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Statut</th>
              <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((shipment) => (
              <tr key={shipment.id} className="border-t hover:bg-muted/50">
                <td className="px-4 py-3 text-sm">{shipment.reference}</td>
                <td className="px-4 py-3 text-sm">{shipment.customer}</td>
                <td className="px-4 py-3 text-sm">{shipment.origin}</td>
                <td className="px-4 py-3 text-sm">{shipment.destination}</td>
                <td className="px-4 py-3 text-sm">
                  {shipment.scheduledDate ? formatDate(shipment.scheduledDate) : "-"}
                </td>
                <td className="px-4 py-3 text-sm font-semibold">
                  {typeof shipment.totalPrice === "number"
                    ? shipment.totalPrice.toFixed(2) + " €"
                    : "-"}
                </td>
                <td className="px-4 py-3 text-sm">{getStatusBadge(shipment.status)}</td>
                <td className="px-4 py-3 text-sm text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onView(shipment.id)}>
                        <FileText className="mr-2 h-4 w-4" />
                        Voir les détails
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(shipment.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FreightShipmentsPage;
