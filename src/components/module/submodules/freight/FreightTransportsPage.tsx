
import React, { useState } from "react";
import { CarFront, Plus } from "lucide-react";
import { useFreightCarriers } from "@/hooks/freight/useFreightCarriers";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import FreightCarriersDashboard from "./FreightCarriersDashboard";
import CreateCarrierDialog from "./CreateCarrierDialog";
import { Button } from "@/components/ui/button";

const FreightTransportsPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(false);
  const { carriers, isLoading, error, refetchCarriers } = useFreightCarriers();

  // Rafraîchit la liste après ajout
  const handleCreated = () => {
    setReloadFlag((f) => !f);
    refetchCarriers();
  };

  React.useEffect(() => {
    // Rafraîchit la liste si flag changé (après ajout)
    refetchCarriers();
    // eslint-disable-next-line
  }, [reloadFlag]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <CarFront className="text-teal-600" size={28} />
        <h1 className="text-2xl font-bold">Transports / Transporteurs</h1>
      </div>
      <FreightCarriersDashboard />
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white"
        >
          <Plus className="h-4 w-4" />
          Ajouter un transporteur
        </Button>
      </div>
      <p className="text-gray-600 mb-4">
        Retrouvez ici la liste des transporteurs de marchandises.
      </p>
      {isLoading ? (
        <div className="text-center py-8">Chargement des transporteurs…</div>
      ) : error ? (
        <div className="text-red-600 py-8">Erreur lors du chargement des transporteurs.</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nom</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {carriers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-gray-400">
                  Aucun transporteur trouvé.
                </TableCell>
              </TableRow>
            ) : (
              carriers.map(carrier => (
                <TableRow key={carrier.id}>
                  <TableCell>{carrier.id}</TableCell>
                  <TableCell>{carrier.name}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
      <CreateCarrierDialog open={open} onOpenChange={setOpen} onCreated={handleCreated} />
    </div>
  );
};

export default FreightTransportsPage;
