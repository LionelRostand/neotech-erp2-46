
import React from "react";
import { useContainersData } from "@/hooks/modules/useContainersData";
import StatCard from "@/components/StatCard";
import { Package, TruckIcon, Ship, Clock, CheckCircle, FileSearch } from "lucide-react";

// Correspondance entre les statuts en anglais et en français
const STATUS_LABELS: Record<string, string> = {
  delivered: "Livré",
  in_transit: "En transit",
  loading: "En chargement",
  ready: "Prêt",
  customs: "En douane",
  // Ajout des statuts en français pour assurer la compatibilité
  "Livré": "Livré",
  "En transit": "En transit",
  "En chargement": "En chargement", 
  "Prêt": "Prêt",
  "En douane": "En douane",
  "chargement": "En chargement"
};

// Couleurs associées aux statuts
const STATUS_COLORS: Record<string, string> = {
  delivered: "bg-green-100 text-green-700",
  in_transit: "bg-blue-100 text-blue-700",
  loading: "bg-yellow-100 text-yellow-700",
  ready: "bg-gray-100 text-gray-700",
  customs: "bg-indigo-100 text-indigo-700",
  // Ajout des statuts en français
  "Livré": "bg-green-100 text-green-700",
  "En transit": "bg-blue-100 text-blue-700",
  "En chargement": "bg-yellow-100 text-yellow-700", 
  "Prêt": "bg-gray-100 text-gray-700",
  "En douane": "bg-indigo-100 text-indigo-700",
  "chargement": "bg-yellow-100 text-yellow-700"
};

// Icônes associées aux statuts
const STATUS_ICONS: Record<string, React.ReactNode> = {
  delivered: <CheckCircle className="h-5 w-5" />,
  in_transit: <Ship className="h-5 w-5" />,
  loading: <TruckIcon className="h-5 w-5" />,
  ready: <Package className="h-5 w-5" />,
  customs: <FileSearch className="h-5 w-5" />,
  // Ajout des statuts en français
  "Livré": <CheckCircle className="h-5 w-5" />,
  "En transit": <Ship className="h-5 w-5" />,
  "En chargement": <TruckIcon className="h-5 w-5" />,
  "Prêt": <Package className="h-5 w-5" />,
  "En douane": <FileSearch className="h-5 w-5" />,
  "chargement": <TruckIcon className="h-5 w-5" />
};

const ContainersDashboard: React.FC = () => {
  const { containers, isLoading } = useContainersData();

  // Compter par statut
  const total = containers.length;
  const counts: Record<string, number> = {
    "Livré": 0,
    "En transit": 0,
    "En chargement": 0,
    "Prêt": 0,
    "En douane": 0
  };

  // Normaliser les statuts pour le comptage
  containers.forEach((container) => {
    const status = container.status || "unknown";
    
    // Gérer les cas où le statut est en français ou en anglais
    if (status === "delivered" || status === "Livré") {
      counts["Livré"]++;
    } else if (status === "in_transit" || status === "En transit") {
      counts["En transit"]++;
    } else if (status === "loading" || status === "En chargement" || status === "chargement") {
      counts["En chargement"]++;
    } else if (status === "ready" || status === "Prêt") {
      counts["Prêt"]++;
    } else if (status === "customs" || status === "En douane") {
      counts["En douane"]++;
    }
  });

  console.log("Statuts des conteneurs:", counts);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-6 gap-4 mb-6 animate-fade-in">
      <StatCard
        title="Total conteneurs"
        value={isLoading ? "..." : total.toString()}
        icon={<Package className="h-6 w-6 text-primary" />}
        description="Nombre total de conteneurs"
        className="col-span-1"
      />
      <StatCard
        title="Livré"
        value={isLoading ? "..." : counts["Livré"].toString()}
        icon={STATUS_ICONS["Livré"]}
        description="Conteneurs livrés"
        className={`col-span-1 ${counts["Livré"] > 0 ? STATUS_COLORS["Livré"] : "bg-card"}`}
      />
      <StatCard
        title="En transit"
        value={isLoading ? "..." : counts["En transit"].toString()}
        icon={STATUS_ICONS["En transit"]}
        description="Conteneurs en transit"
        className={`col-span-1 ${counts["En transit"] > 0 ? STATUS_COLORS["En transit"] : "bg-card"}`}
      />
      <StatCard
        title="En chargement"
        value={isLoading ? "..." : counts["En chargement"].toString()}
        icon={STATUS_ICONS["En chargement"]}
        description="Conteneurs en cours de chargement"
        className={`col-span-1 ${counts["En chargement"] > 0 ? STATUS_COLORS["En chargement"] : "bg-card"}`}
      />
      <StatCard
        title="Prêt"
        value={isLoading ? "..." : counts["Prêt"].toString()}
        icon={STATUS_ICONS["Prêt"]}
        description="Conteneurs prêts"
        className={`col-span-1 ${counts["Prêt"] > 0 ? STATUS_COLORS["Prêt"] : "bg-card"}`}
      />
      <StatCard
        title="En douane"
        value={isLoading ? "..." : counts["En douane"].toString()}
        icon={STATUS_ICONS["En douane"]}
        description="Conteneurs en douane"
        className={`col-span-1 ${counts["En douane"] > 0 ? STATUS_COLORS["En douane"] : "bg-card"}`}
      />
    </div>
  );
};

export default ContainersDashboard;
