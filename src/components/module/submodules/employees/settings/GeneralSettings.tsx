
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

const GeneralSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuration générale</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Paramètres de visualisation */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Affichage</h3>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Afficher les photos de profil</Label>
                <p className="text-sm text-muted-foreground">
                  Afficher les photos de profil des employés dans les listes
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mode compact</Label>
                <p className="text-sm text-muted-foreground">
                  Réduire l'espacement entre les éléments
                </p>
              </div>
              <Switch />
            </div>
          </div>

          {/* Paramètres par défaut */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Valeurs par défaut</h3>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Département par défaut</Label>
                <Input placeholder="Sélectionnez un département" />
              </div>
              <div className="space-y-2">
                <Label>Rôle par défaut</Label>
                <Input placeholder="Sélectionnez un rôle" />
              </div>
            </div>
          </div>

          {/* Options d'exportation */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Options d'exportation</h3>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Inclure les données confidentielles</Label>
                <p className="text-sm text-muted-foreground">
                  Inclure les informations sensibles dans les exports
                </p>
              </div>
              <Switch />
            </div>
          </div>

          <div className="flex justify-end">
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Enregistrer les modifications
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneralSettings;
