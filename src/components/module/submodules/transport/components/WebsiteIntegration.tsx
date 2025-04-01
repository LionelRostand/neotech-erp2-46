
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { WebsiteIntegration as WebsiteIntegrationType } from '../types/transport-types';
import { generateIntegrationCode, createNewIntegration } from '../utils/website-integration';
import { toast } from "@/components/ui/use-toast";

interface WebsiteIntegrationProps {
  integration: WebsiteIntegrationType | null;
}

const WebsiteIntegration: React.FC<WebsiteIntegrationProps> = ({ integration }) => {
  const [isActive, setIsActive] = useState(integration?.status === 'active');
  const [apiKey, setApiKey] = useState("abc123xyz789");
  const [showCode, setShowCode] = useState(false);
  const [integrationCode, setIntegrationCode] = useState("");

  const handleStatusToggle = () => {
    setIsActive(!isActive);
    toast({
      title: !isActive ? "Intégration activée" : "Intégration désactivée",
      description: !isActive 
        ? "L'intégration est maintenant active sur votre site web." 
        : "L'intégration a été désactivée.",
    });
  };

  const handleGenerateCode = () => {
    // Generate the code using the utility function
    const code = generateIntegrationCode(apiKey);
    setIntegrationCode(code);
    setShowCode(true);
    
    toast({
      title: "Code généré",
      description: "Le code d'intégration a été généré avec succès.",
    });
  };

  const handleCreateIntegration = () => {
    // Create a new integration if none exists
    if (!integration) {
      // Use the createNewIntegration function with moduleId parameter
      const newIntegration = createNewIntegration("transport", "booking-page");
      
      toast({
        title: "Intégration créée",
        description: "Une nouvelle intégration a été créée avec succès.",
      });
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(integrationCode);
    toast({
      title: "Code copié",
      description: "Le code a été copié dans le presse-papiers.",
    });
  };

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Intégration Site Web</CardTitle>
        <div className="flex items-center space-x-2">
          <Label htmlFor="integration-active">Activer l'intégration</Label>
          <Switch
            id="integration-active"
            checked={isActive}
            onCheckedChange={handleStatusToggle}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">Widget de réservation</h3>
              <p className="text-sm text-gray-600 mt-1">
                {integration
                  ? `ID de la page: ${integration.pageId}`
                  : "Aucune intégration configurée"}
              </p>
            </div>
            <Badge
              variant={integration?.status === 'active' ? 'default' : 'outline'}
            >
              {!integration
                ? "Non configuré"
                : integration.status === 'active'
                ? "Actif"
                : integration.status === 'inactive'
                ? "Inactif"
                : "En attente"}
            </Badge>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">URL d'API:</span>
              <span className="text-sm">https://api.votre-domaine.com/transport</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Clé API:</span>
              <span className="text-sm font-mono">{apiKey}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Dernière mise à jour:</span>
              <span className="text-sm">{integration?.updatedAt ? new Date(integration.updatedAt).toLocaleDateString() : "N/A"}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={handleGenerateCode}
            className="flex-1"
          >
            Générer le code d'intégration
          </Button>
          {!integration && (
            <Button
              onClick={handleCreateIntegration}
              className="flex-1"
            >
              Créer une nouvelle intégration
            </Button>
          )}
        </div>

        {showCode && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Code d'intégration</h3>
            <div className="bg-gray-800 p-4 rounded-md text-white font-mono text-xs overflow-x-auto">
              <pre>{integrationCode}</pre>
            </div>
            <Button
              variant="outline"
              onClick={handleCopyCode}
              className="mt-2"
              size="sm"
            >
              Copier le code
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WebsiteIntegration;
