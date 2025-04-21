
import React from "react";

const STATUS_COLORS: Record<string, string> = {
  "in_transit": "bg-blue-500 text-white",
  "ready": "bg-purple-500 text-white",
  "loading": "bg-yellow-500 text-black",
  "customs": "bg-orange-400 text-white",
  "delivered": "bg-green-500 text-white",
  "delayed": "bg-red-500 text-white",
  "draft": "bg-gray-300 text-black",
  "cancelled": "bg-red-600 text-white",
};

export const getStatusLabel = (status: string) => {
  switch (status) {
    case "in_transit": return "En transit";
    case "ready": return "Prêt";
    case "loading": return "En chargement";
    case "customs": return "En douane";
    case "delivered": return "Livré";
    case "delayed": return "Retardé";
    case "draft": return "Brouillon";
    case "cancelled": return "Annulé";
    default: return status;
  }
};

const ContainerStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const label = getStatusLabel(status);
  const colorClass = STATUS_COLORS[status] || "bg-gray-200 text-gray-800";
  return (
    <span className={`inline-block px-2 py-1 text-xs rounded ${colorClass}`}>
      {label}
    </span>
  );
};

export default ContainerStatusBadge;
