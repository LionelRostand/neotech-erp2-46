
import React from "react";
import UnifiedTrackingMap from "@/components/module/submodules/freight/tracking/UnifiedTrackingMap";
import { useUnifiedTracking } from "@/hooks/useUnifiedTracking";
import UnifiedTrackingSearch from "@/components/module/submodules/freight/tracking/UnifiedTrackingSearch";
import { MapPin } from "lucide-react";

const PackagesTrackingSection: React.FC = () => {
  const { isLoading, foundItems, searchDone, handleSearch, loading, searchQuery } = useUnifiedTracking();

  return (
    <div className="space-y-4">
      <UnifiedTrackingSearch 
        onResult={handleSearch} 
        isLoading={isLoading || loading}
        lastQuery={searchQuery} 
      />

      <div className="bg-slate-50 border border-slate-200 rounded-lg min-h-[400px] flex items-center justify-center relative">
        {(isLoading || !searchDone) && (
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <MapPin className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-gray-500 text-sm">
              Saisissez une référence pour démarrer le suivi sur la carte.
            </span>
          </div>
        )}

        {searchDone && foundItems.length > 0 && (
          <div className="w-full h-[400px]">
            <UnifiedTrackingMap items={foundItems} />
          </div>
        )}

        {searchDone && !isLoading && foundItems.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <MapPin className="h-8 w-8 text-red-400 mb-2" />
            <span className="text-red-700 text-sm font-medium">
              Aucun colis ou conteneur trouvé avec cette référence.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackagesTrackingSection;
