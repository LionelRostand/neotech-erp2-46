
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowUpDown, Link, RefreshCw } from "lucide-react";
import CrmSyncTab from './CrmSyncTab';

const IntegrationsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Link className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium">Intégrations</h3>
      </div>

      <CrmSyncTab />

      <Card className="p-4 mt-6">
        <div className="flex items-center space-x-2 mb-6">
          <ArrowUpDown className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium">Synchronisation des données</h3>
        </div>

        <div className="space-y-6">
          <div>
            <Label className="text-base">Direction de synchronisation</Label>
            <RadioGroup defaultValue="bidirectional" className="mt-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="import" id="import" />
                <Label htmlFor="import">Import uniquement (externe vers notre système)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="export" id="export" />
                <Label htmlFor="export">Export uniquement (notre système vers externe)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bidirectional" id="bidirectional" />
                <Label htmlFor="bidirectional">Bidirectionnel (synchronisation complète)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="pt-4 flex flex-wrap gap-3">
            <Button>
              <RefreshCw className="mr-2 h-4 w-4" />
              Tester toutes les intégrations
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default IntegrationsTab;
