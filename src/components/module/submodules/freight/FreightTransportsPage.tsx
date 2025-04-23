
import React, { useState } from "react";
import { CarFront, Plus } from "lucide-react";
import { useFreightCarriers } from "@/hooks/freight/useFreightCarriers";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import FreightCarriersDashboard from "./FreightCarriersDashboard";
import CreateCarrierDialog from "./CreateCarrierDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const FreightTransportsPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(false);
  const { carriers, isLoading, error, refetchCarriers } = useFreightCarriers();

  const handleCreated = () => {
    setReloadFlag((f) => !f);
    refetchCarriers();
  };

  React.useEffect(() => {
    refetchCarriers();
  }, [reloadFlag, refetchCarriers]);

  const getTypeColor = (type: string) => {
    const colors = {
      international: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      national: "bg-green-100 text-green-800 hover:bg-green-200",
      local: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <CarFront className="text-blue-600" size={28} />
        <h1 className="text-2xl font-bold">Transports / Transporteurs</h1>
      </div>

      <FreightCarriersDashboard />

      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          Retrouvez ici la liste des transporteurs de marchandises.
        </p>
        <Button
          onClick={() => setOpen(true)}
          className="bg-blue-700 hover:bg-blue-800 text-white flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Ajouter un transporteur
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Chargement des transporteurs…</span>
          </div>
        ) : error ? (
          <div className="text-red-600 p-8 text-center">
            Une erreur est survenue lors du chargement des transporteurs.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-600">ID</TableHead>
                <TableHead className="font-semibold text-gray-600">Nom</TableHead>
                <TableHead className="font-semibold text-gray-600">Code</TableHead>
                <TableHead className="font-semibold text-gray-600">Type</TableHead>
                <TableHead className="font-semibold text-gray-600">Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {carriers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    Aucun transporteur trouvé.
                  </TableCell>
                </TableRow>
              ) : (
                carriers.map((carrier) => (
                  <TableRow 
                    key={carrier.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <TableCell className="font-medium">{carrier.id}</TableCell>
                    <TableCell>{carrier.name}</TableCell>
                    <TableCell>
                      <code className="px-2 py-1 bg-gray-100 rounded text-sm">
                        {carrier.code}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("font-medium", getTypeColor(carrier.type))}>
                        {carrier.type.charAt(0).toUpperCase() + carrier.type.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={carrier.active ? "default" : "secondary"}
                        className={cn(
                          "font-medium",
                          carrier.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        )}
                      >
                        {carrier.active ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
      <CreateCarrierDialog open={open} onOpenChange={setOpen} onCreated={handleCreated} />
    </div>
  );
};

export default FreightTransportsPage;
