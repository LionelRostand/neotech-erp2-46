
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportAppConfig } from '@/utils/configExport';
import { toast } from 'sonner';

const ExportConfigButton = () => {
  const handleExport = () => {
    try {
      exportAppConfig();
      toast.success('Configuration exportée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'exportation:', error);
      toast.error('Erreur lors de l\'exportation de la configuration');
    }
  };

  return (
    <Button
      onClick={handleExport}
      variant="outline"
      className="flex items-center gap-2"
    >
      <Download size={16} />
      Exporter la configuration
    </Button>
  );
};

export default ExportConfigButton;
