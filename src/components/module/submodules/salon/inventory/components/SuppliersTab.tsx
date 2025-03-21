
import React from 'react';
import { Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Supplier } from '../types/inventory-types';

interface SuppliersTabProps {
  suppliers: Supplier[];
  onAddSupplier: () => void;
}

export const SuppliersTab: React.FC<SuppliersTabProps> = ({ suppliers, onAddSupplier }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Fournisseurs</CardTitle>
        <Button variant="default" onClick={onAddSupplier}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un fournisseur
        </Button>
      </CardHeader>
      <CardContent>
        {suppliers.length > 0 ? (
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">Nom</th>
                  <th className="px-4 py-3 text-left font-medium">Contact</th>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-left font-medium">Téléphone</th>
                  <th className="px-4 py-3 text-center font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier, i) => (
                  <tr key={i} className="border-b hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">{supplier.name}</td>
                    <td className="px-4 py-3">{supplier.contactName}</td>
                    <td className="px-4 py-3">{supplier.email}</td>
                    <td className="px-4 py-3">{supplier.phone}</td>
                    <td className="px-4 py-3 text-center">
                      <Button variant="ghost" size="sm">Détails</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-md border p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Aucun fournisseur</h3>
            <p className="text-muted-foreground mb-4">
              Vous n'avez pas encore ajouté de fournisseurs.
            </p>
            <Button onClick={onAddSupplier}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un fournisseur
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
