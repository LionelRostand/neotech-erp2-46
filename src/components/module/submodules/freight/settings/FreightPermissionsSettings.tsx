
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, AlertCircle, Save, Info, CheckCircle2 } from "lucide-react";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from '@/hooks/use-toast';
import { useFirestore } from '@/hooks/useFirestore';
import { useEmployeesPermissions } from '@/hooks/useEmployeesPermissions';

// Types pour les rôles et permissions
type RoleType = 'admin' | 'manager' | 'user' | 'viewer';

interface ModulePermissions {
  admin: string;
  manager: string;
  user: string;
  viewer: string;
}

interface FreightPermissionsState {
  expeditions: ModulePermissions;
  conteneurs: ModulePermissions;
  tarification: ModulePermissions;
  documents: ModulePermissions;
  clientPortal: ModulePermissions;
  parametres: ModulePermissions;
}

const defaultPermissions: ModulePermissions = {
  admin: "Contrôle total et configuration",
  manager: "Modification et gestion",
  user: "Utilisation standard",
  viewer: "Consultation uniquement"
};

const initialPermissionsState: FreightPermissionsState = {
  expeditions: { ...defaultPermissions },
  conteneurs: { ...defaultPermissions },
  tarification: { ...defaultPermissions },
  documents: { ...defaultPermissions },
  clientPortal: { ...defaultPermissions },
  parametres: { ...defaultPermissions }
};

interface FreightPermissionsSettingsProps {
  isAdmin: boolean;
}

const FreightPermissionsSettings: React.FC<FreightPermissionsSettingsProps> = ({ isAdmin }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [permissions, setPermissions] = useState<FreightPermissionsState>(initialPermissionsState);
  const [activeTab, setActiveTab] = useState<string>("roles");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  
  const firestore = useFirestore();
  const { employees, isLoading: employeesLoading } = useEmployeesPermissions();
  
  useEffect(() => {
    const loadPermissions = async () => {
      setLoading(true);
      setSaveSuccess(false);
      setSaveError(null);
      
      try {
        // Vérifier si nous sommes hors ligne
        if (!navigator.onLine) {
          setIsOffline(true);
          console.log("Mode hors ligne détecté, chargement depuis le cache si disponible");
        }
        
        const permissionsRef = doc(db, COLLECTIONS.FREIGHT.PERMISSIONS, 'default');
        const docSnap = await getDoc(permissionsRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          // Vérifier si les données ont la structure correcte et les fusionner avec les valeurs par défaut
          const validatedData: FreightPermissionsState = {
            expeditions: { ...defaultPermissions, ...(data.expeditions || {}) },
            conteneurs: { ...defaultPermissions, ...(data.conteneurs || {}) },
            tarification: { ...defaultPermissions, ...(data.tarification || {}) },
            documents: { ...defaultPermissions, ...(data.documents || {}) },
            clientPortal: { ...defaultPermissions, ...(data.clientPortal || {}) },
            parametres: { ...defaultPermissions, ...(data.parametres || {}) }
          };
          
          setPermissions(validatedData);
          console.log("Permissions chargées:", validatedData);
        } else {
          console.log("Aucune configuration trouvée, utilisation des valeurs par défaut");
          // Enregistrer les valeurs par défaut dans Firestore lors de la première utilisation
          if (navigator.onLine && isAdmin) {
            await setDoc(permissionsRef, initialPermissionsState);
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des permissions:", error);
        toast({
          variant: "destructive",
          title: "Erreur de chargement",
          description: "Impossible de charger les permissions. Vérifiez votre connexion réseau."
        });
        
        // En cas d'erreur, nous utilisons les permissions par défaut
        if (!navigator.onLine) {
          setIsOffline(true);
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadPermissions();
    
    // Surveillez l'état de la connexion
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isAdmin]);
  
  const handleSavePermissions = async () => {
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous n'avez pas les droits pour modifier les permissions"
      });
      return;
    }
    
    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);
    
    try {
      if (isOffline) {
        toast({
          variant: "destructive",
          title: "Mode hors ligne",
          description: "Les modifications seront enregistrées lorsque vous serez de nouveau connecté."
        });
        setSaving(false);
        return;
      }
      
      const permissionsRef = doc(db, COLLECTIONS.FREIGHT.PERMISSIONS, 'default');
      await setDoc(permissionsRef, permissions);
      
      setSaveSuccess(true);
      toast({
        title: "Permissions enregistrées",
        description: "Les modifications ont été appliquées avec succès."
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des permissions:", error);
      const errorMessage = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
      setSaveError(errorMessage);
      toast({
        variant: "destructive",
        title: "Erreur d'enregistrement",
        description: "Impossible d'enregistrer les modifications. Veuillez réessayer."
      });
    } finally {
      setSaving(false);
    }
  };
  
  const updateRoleDescription = (
    module: keyof FreightPermissionsState,
    role: keyof ModulePermissions,
    value: string
  ) => {
    setPermissions(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [role]: value
      }
    }));
  };
  
  // Rendu des composants pour chaque onglet
  const renderRolesTab = () => (
    <div className="space-y-6">
      <Alert variant="warning" className="mb-4">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle>Configuration des rôles</AlertTitle>
        <AlertDescription>
          Les modifications apportées ici affecteront les descriptions des rôles pour tous les utilisateurs.
          Ces descriptions sont utilisées pour expliquer les niveaux d'accès dans l'interface.
        </AlertDescription>
      </Alert>
      
      {Object.entries(permissions).map(([moduleKey, modulePermissions]) => (
        <Card key={moduleKey} className="overflow-hidden">
          <CardHeader className="bg-slate-50">
            <CardTitle className="text-lg font-medium capitalize">
              {moduleKey === 'expeditions' ? 'Expéditions' :
               moduleKey === 'conteneurs' ? 'Conteneurs' :
               moduleKey === 'tarification' ? 'Tarification' :
               moduleKey === 'documents' ? 'Documents' :
               moduleKey === 'clientPortal' ? 'Portail Client' :
               moduleKey === 'parametres' ? 'Paramètres' : moduleKey}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {Object.entries(modulePermissions).map(([roleKey, description]) => (
                <div key={`${moduleKey}-${roleKey}`} className="flex flex-col space-y-2">
                  <label htmlFor={`${moduleKey}-${roleKey}`} className="text-sm font-medium capitalize">
                    {roleKey === 'admin' ? 'Administrateur' :
                     roleKey === 'manager' ? 'Gestionnaire' :
                     roleKey === 'user' ? 'Utilisateur' :
                     roleKey === 'viewer' ? 'Spectateur' : roleKey}
                  </label>
                  <input
                    type="text"
                    id={`${moduleKey}-${roleKey}`}
                    value={description}
                    onChange={(e) => updateRoleDescription(
                      moduleKey as keyof FreightPermissionsState,
                      roleKey as keyof ModulePermissions,
                      e.target.value
                    )}
                    className="w-full p-2 border rounded-md"
                    disabled={!isAdmin || saving}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
  
  const renderUsersTab = () => (
    <div className="space-y-6">
      <Alert variant="warning" className="mb-4">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle>Gestion des utilisateurs</AlertTitle>
        <AlertDescription>
          Attribuez des rôles spécifiques aux utilisateurs pour le module Fret.
          Les permissions seront appliquées selon le rôle attribué.
        </AlertDescription>
      </Alert>
      
      {employeesLoading ? (
        <div className="py-8 text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Chargement des utilisateurs...</p>
        </div>
      ) : employees.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Shield className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">Aucun utilisateur trouvé</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {employees.map(employee => (
            <Card key={employee.id} className="overflow-hidden">
              <CardHeader className="py-3 bg-slate-50">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-medium">
                    {employee.firstName} {employee.lastName}
                  </CardTitle>
                  <span className="text-xs bg-slate-200 px-2 py-1 rounded">
                    {employee.role || 'Sans rôle'}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-sm text-gray-500 mb-2">Email: {employee.email}</div>
                <div className="text-sm text-gray-500 mb-4">Département: {employee.department || 'Non assigné'}</div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {Object.keys(permissions).map((moduleKey) => (
                    <div key={`${employee.id}-${moduleKey}`} className="border rounded-md p-3 bg-slate-50">
                      <div className="font-medium text-sm mb-2 capitalize">
                        {moduleKey === 'expeditions' ? 'Expéditions' :
                         moduleKey === 'conteneurs' ? 'Conteneurs' :
                         moduleKey === 'tarification' ? 'Tarification' :
                         moduleKey === 'documents' ? 'Documents' :
                         moduleKey === 'clientPortal' ? 'Portail Client' :
                         moduleKey === 'parametres' ? 'Paramètres' : moduleKey}
                      </div>
                      <select
                        className="w-full p-1 text-sm border rounded"
                        defaultValue={employee.permissions?.freight?.[moduleKey as string] || 'viewer'}
                        disabled={!isAdmin || saving}
                      >
                        <option value="admin">Administrateur</option>
                        <option value="manager">Gestionnaire</option>
                        <option value="user">Utilisateur</option>
                        <option value="viewer">Spectateur</option>
                        <option value="none">Aucun accès</option>
                      </select>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
  
  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Chargement des paramètres de permission...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {isOffline && (
        <Alert variant="warning" className="mb-4">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Mode hors ligne</AlertTitle>
          <AlertDescription>
            Vous êtes actuellement en mode hors ligne. Vous pouvez consulter les paramètres, 
            mais les modifications ne seront pas enregistrées.
          </AlertDescription>
        </Alert>
      )}
      
      {!isAdmin && (
        <Alert variant="warning" className="mb-4">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Mode consultation</AlertTitle>
          <AlertDescription>
            Vous êtes en mode consultation uniquement. Seuls les administrateurs peuvent 
            modifier les permissions du module Fret.
          </AlertDescription>
        </Alert>
      )}
      
      {saveSuccess && (
        <Alert variant="default" className="bg-green-50 border-green-200 text-green-800 mb-4">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <AlertTitle>Modifications enregistrées</AlertTitle>
          <AlertDescription>
            Les permissions ont été mises à jour avec succès.
          </AlertDescription>
        </Alert>
      )}
      
      {saveError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>
            {saveError}
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 w-full sm:w-auto">
          <TabsTrigger value="roles" className="flex-1 sm:flex-initial">
            Définition des rôles
          </TabsTrigger>
          <TabsTrigger value="users" className="flex-1 sm:flex-initial">
            Utilisateurs et permissions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="roles" className="pt-2">
          {renderRolesTab()}
        </TabsContent>
        
        <TabsContent value="users" className="pt-2">
          {renderUsersTab()}
        </TabsContent>
      </Tabs>
      
      {isAdmin && (
        <div className="flex justify-end mt-6">
          <Button
            onClick={handleSavePermissions}
            disabled={saving || isOffline}
            className="flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Enregistrer les modifications
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default FreightPermissionsSettings;
