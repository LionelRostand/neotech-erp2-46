
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Shield, AlertCircle } from "lucide-react";
import FreightGeneralSettings from './settings/FreightGeneralSettings';
import FreightPermissionsSettings from './settings/FreightPermissionsSettings';
import { usePermissions } from '@/hooks/usePermissions';
import { toast } from '@/components/ui/use-toast';

const FreightSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");
  const { isAdmin, checkPermission, loading } = usePermissions('freight');
  const [canEditSettings, setCanEditSettings] = useState(false);
  const [isCheckingPermissions, setIsCheckingPermissions] = useState(true);
  
  // Vérifier les permissions d'édition des paramètres uniquement une fois lors du chargement initial
  useEffect(() => {
    if (!loading) {
      const checkEditAccess = async () => {
        try {
          setIsCheckingPermissions(true);
          // Les administrateurs ont toujours accès
          if (isAdmin) {
            setCanEditSettings(true);
            return;
          }
          
          // Vérifier la permission d'édition pour les autres utilisateurs
          const hasAccess = await checkPermission('freight', 'modify');
          setCanEditSettings(hasAccess);
        } catch (error) {
          console.error("Erreur lors de la vérification des permissions:", error);
          toast({
            title: "Erreur",
            description: "Impossible de vérifier vos permissions. Veuillez réessayer.",
            variant: "destructive"
          });
        } finally {
          setIsCheckingPermissions(false);
        }
      };
      
      checkEditAccess();
    }
  }, [loading, isAdmin, checkPermission]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Paramètres du Module Fret</h2>
      
      {isCheckingPermissions ? (
        <div className="p-4 border rounded-md bg-slate-50 animate-pulse">
          Vérification des permissions...
        </div>
      ) : !canEditSettings && !isAdmin ? (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-3 text-amber-800">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium">Accès limité</h3>
            <p className="text-sm mt-1">
              Vous n'avez pas les droits suffisants pour modifier les paramètres du module Fret. 
              Vous pouvez consulter les informations, mais ne pourrez pas les modifier.
            </p>
          </div>
        </div>
      ) : null}
      
      <Tabs defaultValue="general" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            Général
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2" disabled={!canEditSettings && !isAdmin}>
            <Shield className="h-4 w-4" />
            Droits d'accès
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <FreightGeneralSettings isAdmin={isAdmin} canEdit={canEditSettings} />
        </TabsContent>
        
        <TabsContent value="permissions">
          {canEditSettings || isAdmin ? (
            <FreightPermissionsSettings />
          ) : (
            <div className="p-6 text-center bg-gray-50 rounded-lg border border-gray-200">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <h3 className="text-lg font-medium text-gray-900">Accès restreint</h3>
              <p className="text-gray-500">
                Vous n'avez pas les droits nécessaires pour gérer les permissions des utilisateurs.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FreightSettings;
