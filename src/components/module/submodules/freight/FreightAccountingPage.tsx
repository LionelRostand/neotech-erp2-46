
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useFreightData } from "@/hooks/modules/useFreightData";

// Table simple (adaptable selon le besoin)
const FreightAccountingPage: React.FC = () => {
  const { shipments = [], containers = [], clients = [], loading } = useFreightData();

  // Helper pour trouver le client et le conteneur liés à une expédition
  const getClient = (clientId: string) =>
    clients.find((c: any) => c.id === clientId) || { name: "-", id: clientId };
  const getContainer = (containerId: string) =>
    containers.find((c: any) => c.id === containerId) || { number: "-", id: containerId };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-2">Comptabilité des Expéditions</h2>
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
                  shipments.map((shipment: any) => (
                    <tr key={shipment.id || shipment.reference} className="border-t last:border-b-0 hover:bg-gray-50">
                      <td className="px-5 py-4">{shipment.reference}</td>
                      <td className="px-5 py-4">{getClient(shipment.customer)?.name || "-"}</td>
                      <td className="px-5 py-4">{getContainer(shipment.containerId)?.number || "-"}</td>
                      <td className="px-5 py-4">
                        {shipment.totalPrice ? 
                          shipment.totalPrice.toLocaleString("fr-FR", { style: "currency", currency: "EUR" }) : "-"}
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
      <p className="text-xs text-muted-foreground">
        Les coûts sont issus des expéditions, avec les clients et les conteneurs liés.
      </p>
    </div>
  );
};

export default FreightAccountingPage;
