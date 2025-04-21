
import React from "react";
import { Info, FileText, DollarSign } from "lucide-react";

interface Props {
  tab: string;
  setTab: (tab: string) => void;
}

const tabs = [
  { key: 'info', label: "Informations", icon: <Info className="mr-1 h-4 w-4" /> },
  { key: 'articles', label: "Articles", icon: <FileText className="mr-1 h-4 w-4" /> },
  { key: 'pricing', label: "Tarification", icon: <DollarSign className="mr-1 h-4 w-4" /> }
];

const ContainerTabs: React.FC<Props> = ({ tab, setTab }) => (
  <div className="flex space-x-2 mb-5">
    {tabs.map((t) => (
      <button
        key={t.key}
        className={`flex items-center px-4 py-1 rounded-t-md text-sm font-medium transition-colors ${
          tab === t.key
            ? "bg-background text-primary"
            : "text-muted-foreground hover:bg-accent"
        }`}
        onClick={() => setTab(t.key)}
        type="button"
      >
        {t.icon}
        {t.label}
      </button>
    ))}
  </div>
);

export default ContainerTabs;
