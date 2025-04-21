
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFreightData } from "@/hooks/modules/useFreightData";
import FreightAccountingSummaryDialog from "./FreightAccountingSummaryDialog";

// Define types for the data
interface FreightClient {
  id: string;
  name: string;
  [key: string]: any;
}

interface Container {
  id: string;
  number: string;
  [key: string]: any;
}

interface Shipment {
  id: string;
  reference: string;
  customer: string;
  containerId: string;
  totalPrice?: number;
  status?: string;
  scheduledDate?: string;
  [key: string]: any;
}

const FreightAccountingPage: React.FC = () => {
  const { shipments = [], containers = [], clients = [], loading } = useFreightData();
  const [summaryOpen, setSummaryOpen] = useState(false);

  // Helper functions to safely get properties
  const getClientName = (clientId: string) => {
    const client = clients.find((c: any) => c.id === clientId);
    return client ? client.name || '-' : '-';
  };

  const getContainerNumber = (containerId: string) => {
    const container = containers.find((c: any) => c.id === containerId);
    return container ? container.number || '-' : '-';
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-2">Comptabilité des Expéditions</h2>
      <Button variant="default" onClick={() => setSummaryOpen(true)} className="mb-4">
        Voir le récapitulatif des coûts
      </Button>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">Référence</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">Client</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">Conteneur</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">Coût</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">Statut</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-muted-foreground">
                      Chargement des données...
                    </td>
                  </tr>
                ) : (shipments.length > 0 ? (
                  shipments.map((shipment: Shipment) => (
                    <tr key={shipment.id || shipment.reference} className="border-t last:border-b-0 hover:bg-gray-50">
                      <td className="px-5 py-4">{shipment.reference || "-"}</td>
                      <td className="px-5 py-4">{getClientName(shipment.customer)}</td>
                      <td className="px-5 py-4">{getContainerNumber(shipment.containerId)}</td>
                      <td className="px-5 py-4">
                        {shipment.totalPrice ?
                          shipment.totalPrice.toLocaleString("fr-FR", { style: "currency", currency: "EUR" }) :
                          "-"}
                      </td>
                      <td className="px-5 py-4">{shipment.status || "-"}</td>
                      <td className="px-5 py-4">{shipment.scheduledDate ? new Date(shipment.scheduledDate).toLocaleDateString() : "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-muted-foreground">
                      Aucune donnée d'expédition pour le moment.
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <FreightAccountingSummaryDialog
        open={summaryOpen}
        onOpenChange={setSummaryOpen}
        shipments={shipments as Shipment[]}
        clients={clients as FreightClient[]}
        containers={containers as Container[]}
      />
      <p className="text-xs text-muted-foreground">
        Les coûts sont issus des expéditions, avec les clients et les conteneurs liés.<br />
        Le bouton ci-dessus affiche le récapitulatif dans un popup.
      </p>
    </div>
  );
};

export default FreightAccountingPage;
