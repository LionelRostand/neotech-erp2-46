
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Palette, BarChart } from "lucide-react";
import WebBookingTabs from './tabs/WebBookingTabs';
import WebsiteBuilder from './web-booking/WebsiteBuilder';

const TransportWebBooking: React.FC = () => {
  const [activeTab, setActiveTab] = useState('website');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Réservation en ligne</h2>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Configuration du site de réservation</CardTitle>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-[500px]">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="website" className="flex items-center gap-2">
                  <Globe size={16} />
                  <span>Site web</span>
                </TabsTrigger>
                <TabsTrigger value="integration" className="flex items-center gap-2">
                  <Palette size={16} />
                  <span>Intégration</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart size={16} />
                  <span>Statistiques</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === 'website' ? (
            <WebsiteBuilder />
          ) : (
            <WebBookingTabs activeTab={activeTab} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransportWebBooking;
