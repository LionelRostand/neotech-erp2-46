
import React from "react";
import { useFreightCarriers } from "@/hooks/freight/useFreightCarriers";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

const FreightCarriersDashboard: React.FC = () => {
  const { carriers, isLoading } = useFreightCarriers();

  // Exemples de stats possibles : total, actifs (si propriété active existe plus tard), ...
  const total = carriers.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="flex flex-col items-center justify-center py-3">
        <div className="flex items-center gap-2">
          <Users className="text-blue-600" />
          <div className="font-semibold text-md">Transporteurs</div>
        </div>
        <div className="font-bold text-2xl mt-1">{isLoading ? "..." : total}</div>
        <span className="text-xs text-gray-500">Nombre total de transporteurs</span>
      </Card>
      {/* Ajouter d'autres stats si besoin plus tard */}
    </div>
  );
};
export default FreightCarriersDashboard;
