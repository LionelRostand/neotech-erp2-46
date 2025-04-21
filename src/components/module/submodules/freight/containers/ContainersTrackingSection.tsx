
import React from "react";
import UnifiedTrackingMap from "@/components/module/submodules/freight/tracking/UnifiedTrackingMap";
import { useUnifiedTracking } from "@/hooks/useUnifiedTracking";
import UnifiedTrackingSearch from "@/components/module/submodules/freight/tracking/UnifiedTrackingSearch";

const ContainersTrackingSection: React.FC = () => {
  const { isLoading, foundItems, searchDone, handleSearch, loading } = useUnifiedTracking();

  return (
    <div className="space-y-4">
      <UnifiedTrackingSearch onResult={handleSearch} isLoading={isLoading || loading} />
      {(!searchDone || isLoading) && (
        <div className="flex items-center justify-center h-40 text-gray-600">
          {isLoading ? "Chargement en cours..." : "Saisissez une référence pour démarrer."}
        </div>
      )}
      {searchDone && foundItems.length > 0 && (
        <UnifiedTrackingMap items={foundItems} />
      )}
      {searchDone && foundItems.length === 0 && (
        <div className="flex items-center justify-center h-40 text-red-500">
          Aucun résultat trouvé pour cette référence.
        </div>
      )}
    </div>
  );
};

export default ContainersTrackingSection;
