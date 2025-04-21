
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
  <div className="flex space-x-2 mb-5">
    {tabs.map((t) => (
      <button
        key={t.key}
        className={`px-4 py-1 rounded-md text-sm font-medium ${tab === t.key ? "bg-muted text-primary" : "text-muted-foreground hover:bg-accent"}`}
        style={{ transition: "background 0.2s" }}
        onClick={() => setTab(t.key)}
        type="button"
      >
        {t.label}
      </button>
    ))}
  </div>
);

export default ContainerTabs;
