
import React from "react";
import UnifiedTrackingMap from "@/components/module/submodules/freight/tracking/UnifiedTrackingMap";
import { useUnifiedTracking } from "@/hooks/useUnifiedTracking";
import UnifiedTrackingSearch from "@/components/module/submodules/freight/tracking/UnifiedTrackingSearch";

const ContainersTrackingSection: React.FC = () => {
  const { isLoading, foundItems, searchDone, handleSearch, loading, searchQuery } = useUnifiedTracking();

  return (
    <div className="space-y-4">
      <UnifiedTrackingSearch 
        onResult={handleSearch} 
        isLoading={isLoading || loading}
        lastQuery={searchQuery} 
      />
      
      {(!searchDone || isLoading) && (
        <div className="flex items-center justify-center h-40 text-gray-600">
          {isLoading ? "Chargement en cours..." : "Saisissez une référence pour démarrer."}
        </div>
      )}
      
      {searchDone && foundItems.length > 0 && (
        <UnifiedTrackingMap items={foundItems} />
      )}
      
      {searchDone && !isLoading && foundItems.length === 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <div className="font-medium">
            Aucun résultat
          </div>
          <div className="text-sm">
            Aucun colis ou conteneur trouvé avec cette référence.
          </div>
        </div>
      )}
    </div>
  );
};

export default ContainersTrackingSection;
