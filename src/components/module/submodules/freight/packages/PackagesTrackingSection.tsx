
import React from "react";
import UnifiedTrackingMap from "@/components/module/submodules/freight/tracking/UnifiedTrackingMap";
import { useUnifiedTracking } from "@/hooks/useUnifiedTracking";
import UnifiedTrackingSearch from "@/components/module/submodules/freight/tracking/UnifiedTrackingSearch";

const PackagesTrackingSection: React.FC = () => {
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
      
      {searchDone && foundItems.length === 0 && (
        <div className="flex flex-col items-center justify-center h-40 gap-2">
          <div className="text-red-500 font-medium">
            Aucun résultat trouvé pour cette référence.
          </div>
          <div className="text-sm text-gray-500">
            Vérifiez que le numéro saisi est correct ou essayez une autre référence.
          </div>
        </div>
      )}
    </div>
  );
};

export default PackagesTrackingSection;
