
import React from "react";
import { useUnifiedTracking } from "@/hooks/useUnifiedTracking";
import UnifiedTrackingSearch from "./UnifiedTrackingSearch";
import UnifiedTrackingMap from "./UnifiedTrackingMap";
import { Container, MapPin, Package, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PackagesTrackingSection from "../packages/PackagesTrackingSection";
import ContainersTrackingSection from "../containers/ContainersTrackingSection";

const UnifiedTrackingPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Suivi en temps réel</h2>
        <p className="text-muted-foreground mb-4">
          Suivez vos colis, conteneurs et expéditions en temps réel grâce à notre système de géolocalisation avancé.
        </p>

        <Tabs defaultValue="colis" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="colis" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>Colis et Expéditions</span>
            </TabsTrigger>
            <TabsTrigger value="conteneurs" className="flex items-center gap-2">
              <Container className="h-4 w-4" />
              <span>Conteneurs</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="colis" className="mt-0">
            <PackagesTrackingSection />
          </TabsContent>
          
          <TabsContent value="conteneurs" className="mt-0">
            <ContainersTrackingSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UnifiedTrackingPage;
