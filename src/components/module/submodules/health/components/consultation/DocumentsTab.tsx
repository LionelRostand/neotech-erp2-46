
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilePlus } from "lucide-react";

const DocumentsTab: React.FC = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Images et documents médicaux</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
            <FilePlus className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Cliquez pour ajouter des images ou documents</p>
            <p className="text-xs text-gray-400 mt-1">Formats acceptés: JPEG, PNG, PDF, DICOM</p>
            <Button className="mt-4" variant="outline" type="button">
              Ajouter un document
            </Button>
          </div>
          
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2">Documents associés</h4>
            <p className="text-sm text-gray-500 italic">Aucun document associé à cette consultation</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsTab;
