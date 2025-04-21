
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ContainerTabsProps {
  tab: string;
  setTab: (tab: string) => void;
  isLastTab?: boolean;
}

const ContainerTabs: React.FC<ContainerTabsProps> = ({ tab, setTab }) => {
  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="info" className="data-[state=active]:bg-green-50">
          Informations
        </TabsTrigger>
        <TabsTrigger value="articles" className="data-[state=active]:bg-green-50">
          Articles
        </TabsTrigger>
        <TabsTrigger value="pricing" className="data-[state=active]:bg-green-50">
          Tarification
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ContainerTabs;
