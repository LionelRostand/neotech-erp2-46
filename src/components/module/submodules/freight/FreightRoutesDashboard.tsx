
import React from "react";
import { useFreightRoutes } from "@/hooks/freight/useFreightRoutes";
import { Card, CardContent } from "@/components/ui/card";
import StatCard from "@/components/StatCard";
import { LayoutDashboard, ChartBar, ChartLine, ChartPie } from "lucide-react";
import { Route as RouteType } from "@/types/freight/route-types";

const transportLabels: Record<string, string> = {
  road: "Routier",
  sea: "Maritime",
  air: "Aérien",
  rail: "Ferroviaire",
  multimodal: "Multimodal"
};

const transportColors: Record<string, string> = {
  road: "bg-blue-100 text-blue-800",
  sea: "bg-sky-100 text-sky-800",
  air: "bg-purple-100 text-purple-800",
  rail: "bg-gray-100 text-gray-700",
  multimodal: "bg-green-100 text-green-800"
};

const transportIcons: Record<string, React.ReactNode> = {
  road: <ChartLine className="h-5 w-5 text-blue-700" />,
  sea: <ChartPie className="h-5 w-5 text-sky-700" />,
  air: <ChartBar className="h-5 w-5 text-purple-700" />,
  rail: <LayoutDashboard className="h-5 w-5 text-gray-700" />,
  multimodal: <ChartPie className="h-5 w-5 text-green-700" />
};

const FreightRoutesDashboard: React.FC = () => {
  const { routes, isLoading } = useFreightRoutes();

  // Pour l'exemple, mock des types 'Route' complets sinon fallback champ par champ
  const totalRoutes = routes.length;
  const activeRoutes = routes.filter((r: any) => r.active !== false).length;

  // Comptage par type de transport
  const transportCounts: Record<string, number> = {
    road: 0,
    sea: 0,
    air: 0,
    rail: 0,
    multimodal: 0
  };
  routes.forEach((r: any) => {
    if (r.transportType && typeof r.transportType === "string" && transportCounts.hasOwnProperty(r.transportType)) {
      transportCounts[r.transportType]++;
    }
  });

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 animate-fade-in">
      <StatCard
        title="Nombre total de routes"
        value={isLoading ? "..." : totalRoutes.toString()}
        icon={<LayoutDashboard className="h-6 w-6 text-primary" />}
        description="Toutes les routes enregistrées"
      />
      <StatCard
        title="Routes actives"
        value={isLoading ? "..." : activeRoutes.toString()}
        icon={<ChartLine className="h-6 w-6 text-green-600" />}
        description="Nombre de routes actives"
        className="bg-green-50"
      />
      {Object.keys(transportCounts).map((type) =>
        <StatCard
          key={type}
          title={transportLabels[type]}
          value={isLoading ? "..." : transportCounts[type].toString()}
          icon={transportIcons[type]}
          description={`Routes ${transportLabels[type].toLowerCase()}`}
          className={transportCounts[type] > 0 ? `${transportColors[type]}` : "bg-card"}
        />
      )}
    </div>
  );
};

export default FreightRoutesDashboard;
