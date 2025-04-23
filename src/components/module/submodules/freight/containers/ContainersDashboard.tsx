
import React from "react";
import { useContainersData } from "@/hooks/modules/useContainersData";

// Statuts principaux : personnalisez selon les besoins
const STATUS_LABELS: Record<string, string> = {
  delivered: "Livré",
  in_transit: "En transit",
  loading: "En chargement",
  ready: "Prêt",
  customs: "En douane",
};

const STATUS_COLORS: Record<string, string> = {
  delivered: "bg-green-100 text-green-700",
  in_transit: "bg-blue-100 text-blue-700",
  loading: "bg-yellow-100 text-yellow-700",
  ready: "bg-gray-100 text-gray-700",
  customs: "bg-indigo-100 text-indigo-700",
};

const ContainersDashboard: React.FC = () => {
  const { containers, isLoading } = useContainersData();

  // Count by status
  const total = containers.length;
  const counts: Record<string, number> = {};
  containers.forEach((c) => {
    const key = c.status || "unknown";
    counts[key] = (counts[key] || 0) + 1;
  });

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 animate-fade-in">
      <div className="p-4 rounded-xl border bg-card flex flex-col items-center justify-center shadow-sm">
        <span className="text-lg font-bold">
          {isLoading ? "…" : total}
        </span>
        <span className="text-xs text-muted-foreground">Total conteneurs</span>
      </div>
      {Object.entries(STATUS_LABELS).map(([status, label]) => (
        <div
          key={status}
          className={`p-4 rounded-xl border bg-card flex flex-col items-center justify-center shadow-sm ${STATUS_COLORS[status]}`}
        >
          <span className="text-lg font-bold">
            {isLoading ? "…" : counts[status] || 0}
          </span>
          <span className="text-xs">{label}</span>
        </div>
      ))}
    </div>
  );
};

export default ContainersDashboard;
