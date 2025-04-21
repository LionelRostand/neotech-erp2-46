
import React from "react";
import { useCollectionData } from "@/hooks/useCollectionData"; // hook Firebase temps réel
import { COLLECTIONS } from "@/lib/firebase-collections";
import { Card } from "@/components/ui/card";
import { Carrier } from "@/types/freight"; // type strict

const FreightCarriersList: React.FC = () => {
  // On récupère toutes les données de la collection freight_carriers
  const { data: carriers, isLoading, error } = useCollectionData(COLLECTIONS.FREIGHT.CARRIERS);

  if (isLoading) {
    return (
      <div className="text-center py-10 text-muted-foreground">Chargement des transporteurs...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-destructive">
        Erreur lors du chargement des transporteurs.
      </div>
    );
  }

  if (!carriers || carriers.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Aucun transporteur trouvé.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {carriers.map((carrier: Carrier) => (
        <Card key={carrier.id} className="p-4 hover:bg-gray-50">
          <div className="font-bold text-lg">{carrier.name}</div>
          <div className="text-sm text-muted-foreground">{carrier.code}</div>
          <div className="mt-1 text-xs">
            Type: <span className="font-medium">{carrier.type}</span>
          </div>
          <div className="mt-1">
            <span className="text-xs">Contact: </span>
            <span className="text-xs font-medium">{carrier.contactName || "—"}</span>
            <span className="text-xs ml-2 text-muted-foreground">{carrier.contactEmail || ""}</span>
          </div>
          <div className="mt-1">
            Actif : <span className={carrier.active ? "text-green-600" : "text-gray-400"}>{carrier.active ? "Oui" : "Non"}</span>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default FreightCarriersList;

