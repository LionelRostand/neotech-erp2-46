
import React from "react";
import { CarFront } from "lucide-react";
import { useFreightCarriers } from "@/hooks/freight/useFreightCarriers";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";

const FreightTransportsPage: React.FC = () => {
  const { carriers, isLoading, error } = useFreightCarriers();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <CarFront className="text-teal-600" size={28} />
        <h1 className="text-2xl font-bold">Transports / Transporteurs</h1>
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
    </div>
  );
};

export default FreightTransportsPage;
