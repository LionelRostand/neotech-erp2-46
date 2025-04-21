
import React from "react";

interface Props {
  tab: string;
  setTab: (tab: string) => void;
}

const tabs = [
  { key: 'info', label: "Informations" },
  { key: 'articles', label: "Articles" },
  { key: 'pricing', label: "Tarification" },
];

const ContainerTabs: React.FC<Props> = ({ tab, setTab }) => (
  <div className="flex space-x-2 mb-5 border-b">
    {tabs.map((t) => (
      <button
        key={t.key}
        className={`px-4 py-1 rounded-t-md text-sm font-medium transition-colors border-b-2 ${
          tab === t.key
            ? "bg-background text-primary border-primary"
            : "text-muted-foreground border-transparent hover:bg-accent"
        }`}
        onClick={() => setTab(t.key)}
        type="button"
      >
        {t.label}
      </button>
    ))}
  </div>
);

export default ContainerTabs;
