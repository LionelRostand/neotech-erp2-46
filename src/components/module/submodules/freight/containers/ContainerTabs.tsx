
import React from "react";
import { Info, FileText, DollarSign } from "lucide-react";

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

  const handlePrevious = () => {
    const currentIndex = tabs.findIndex(t => t.key === tab);
    if (currentIndex > 0) {
      setTab(tabs[currentIndex - 1].key);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2 border-b">
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

      <div className="flex justify-between mt-4">
        {tab !== "info" && (
          <button 
            onClick={handlePrevious} 
            type="button"
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 text-gray-700 rounded-md transition-colors"
          >
            Précédent
          </button>
        )}
        
        {tab !== "pricing" && (
          <button 
            onClick={handleNext} 
            type="button"
            className="bg-green-600 hover:bg-green-700 px-4 py-2 text-white rounded-md transition-colors ml-auto"
          >
            Suivant
          </button>
        )}
      </div>
    </div>
  );
};

export default ContainerTabs;
