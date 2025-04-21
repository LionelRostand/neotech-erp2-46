
import React from "react";
import { Info, FileText, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  tab: string;
  setTab: (tab: string) => void;
  onNext?: () => void;
  isLastTab?: boolean;
}

const tabs = [
  { key: 'info', label: "Informations", icon: <Info className="mr-1 h-4 w-4" /> },
  { key: 'articles', label: "Articles", icon: <FileText className="mr-1 h-4 w-4" /> },
  { key: 'pricing', label: "Tarification", icon: <DollarSign className="mr-1 h-4 w-4" /> }
];

const ContainerTabs: React.FC<Props> = ({ tab, setTab, onNext, isLastTab }) => {
  const handleNext = () => {
    const currentIndex = tabs.findIndex(t => t.key === tab);
    if (currentIndex < tabs.length - 1) {
      setTab(tabs[currentIndex + 1].key);
    }
    if (onNext) {
      onNext();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`flex items-center px-4 py-1 rounded-t-md text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-background text-primary border-b-2 border-primary"
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

      {!isLastTab && (
        <div className="flex justify-end mt-4">
          <Button onClick={handleNext} type="button">
            Suivant
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContainerTabs;
