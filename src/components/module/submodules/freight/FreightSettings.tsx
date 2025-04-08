
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Shield, AlertCircle } from "lucide-react";
import FreightGeneralSettings from './settings/FreightGeneralSettings';
import FreightPermissionsSettings from './settings/FreightPermissionsSettings';
import { usePermissions } from '@/hooks/usePermissions';
import { toast } from '@/hooks/use-toast';
import { FreightAlert } from './components/FreightAlert';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Button } from '@/components/ui/button';

const FreightSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");
  const { isAdmin, checkPermission, loading } = usePermissions('freight');
  const [canEditSettings, setCanEditSettings] = useState(false);
  const [isCheckingPermissions, setIsCheckingPermissions] = useState(true);
  const [isGrantingAdminRights, setIsGrantingAdminRights] = useState(false);
  
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

  // Fonction pour accorder les droits d'administrateur à admin@neotech-consulting.com
  const grantAdminRightsToSpecificUser = async () => {
    try {
      setIsGrantingAdminRights(true);
      
      // 1. Trouver l'utilisateur par son email
      const usersCollection = await getDoc(doc(db, COLLECTIONS.USERS, 'admin-permissions-config'));
      const adminEmail = 'admin@neotech-consulting.com';
      let adminUserId = '';
      
      if (usersCollection.exists()) {
        const config = usersCollection.data();
        adminUserId = config.adminUserId || '';
      } else {
        // Créer le document de configuration s'il n'existe pas
        await updateDoc(doc(db, COLLECTIONS.USERS, 'admin-permissions-config'), {
          adminEmail: adminEmail,
          adminUserId: adminUserId,
          updatedAt: new Date()
        });
      }
      
      // 2. Vérifier si l'utilisateur existe
      if (!adminUserId) {
        toast({
          title: "Information",
          description: "Configuration pour admin@neotech-consulting.com prête. Veuillez vous assurer que cet utilisateur existe dans le système.",
          variant: "default"
        });
        return;
      }
      
      // 3. Mettre à jour les permissions pour le module Freight
      const userPermissionsRef = doc(db, COLLECTIONS.USER_PERMISSIONS, adminUserId);
      const userPermissionsDoc = await getDoc(userPermissionsRef);
      
      if (userPermissionsDoc.exists()) {
        const currentPermissions = userPermissionsDoc.data();
        
        // Mettre à jour les permissions spécifiques du module Freight
        await updateDoc(userPermissionsRef, {
          permissions: {
            ...currentPermissions.permissions,
            freight: {
              view: true,
              create: true,
              edit: true,
              delete: true,
              export: true,
              modify: true
            }
          }
        });
        
        toast({
          title: "Succès",
          description: "Les droits d'administration pour le module Freight ont été accordés à admin@neotech-consulting.com",
          variant: "default"
        });
      } else {
        // Créer des permissions complètes pour cet utilisateur
        await updateDoc(userPermissionsRef, {
          userId: adminUserId,
          permissions: {
            freight: {
              view: true,
              create: true,
              edit: true,
              delete: true,
              export: true,
              modify: true
            }
          },
          updatedAt: new Date()
        });
        
        toast({
          title: "Succès",
          description: "Nouvelles permissions créées pour admin@neotech-consulting.com avec droits complets sur le module Freight",
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'attribution des droits d'administrateur:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'attribution des droits d'administrateur.",
        variant: "destructive"
      });
    } finally {
      setIsGrantingAdminRights(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Paramètres du Module Fret</h2>
      
      {isAdmin && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-md">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Administration spéciale</h3>
          <p className="text-blue-700 mb-4">En tant qu'administrateur système, vous pouvez accorder des droits d'administrateur complets sur ce module à admin@neotech-consulting.com.</p>
          <Button 
            onClick={grantAdminRightsToSpecificUser}
            disabled={isGrantingAdminRights}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isGrantingAdminRights ? "Attribution en cours..." : "Accorder les pleins droits"}
          </Button>
        </div>
      )}
      
      {isCheckingPermissions ? (
        <div className="p-4 border rounded-md bg-slate-50 animate-pulse">
          Vérification des permissions...
        </div>
      ) : !canEditSettings && !isAdmin ? (
        <FreightAlert 
          variant="warning" 
          title="Accès limité"
          className="mb-4"
        >
          <p>
            Vous n'avez pas les droits suffisants pour modifier les paramètres du module Fret. 
            Vous pouvez consulter les informations, mais ne pourrez pas les modifier.
          </p>
        </FreightAlert>
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
            <FreightPermissionsSettings isAdmin={isAdmin} />
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
