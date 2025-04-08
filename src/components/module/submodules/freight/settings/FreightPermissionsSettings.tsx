
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useFirestore } from '@/hooks/useFirestore';
import { useEmployeesPermissions, EmployeeUser } from '@/hooks/useEmployeesPermissions';
import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define the permissions interface
interface ModulePermission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

interface FreightPermissions {
  id?: string;
  permissions: {
    [userId: string]: ModulePermission;
  };
  updatedAt?: Date;
}

const FreightPermissionsSettings: React.FC = () => {
  // Optimisation: Cache local des permissions pour éviter les requêtes répétées
  const [permissions, setPermissions] = useState<{[userId: string]: ModulePermission}>({});
  const [initialPermissions, setInitialPermissions] = useState<{[userId: string]: ModulePermission}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [hasChanges, setHasChanges] = useState(false);
  
  const { employees, isLoading: isLoadingEmployees } = useEmployeesPermissions();
  
  // Use the appropriate collection path
  const permissionsCollectionPath = COLLECTIONS.FREIGHT.PERMISSIONS;
  const permissionsDocumentId = 'permissions';
  const firestore = useFirestore(permissionsCollectionPath);

  // Optimisation: Utilisation de useCallback pour éviter les re-rendus inutiles
  const loadPermissions = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsOffline(false);
      
      // Optimisation: Utiliser une seule requête pour récupérer toutes les permissions
      const permissionsData = await firestore.getById(permissionsDocumentId);
      
      if (permissionsData) {
        // Cast to our interface
        const data = permissionsData as FreightPermissions;
        const permissionsObj = data.permissions || {};
        setPermissions(permissionsObj);
        setInitialPermissions(JSON.parse(JSON.stringify(permissionsObj))); // Copie profonde pour comparaison ultérieure
      } else {
        // Initialiser avec un objet vide si aucune donnée n'existe
        setPermissions({});
        setInitialPermissions({});
      }
      
      setHasChanges(false);
    } catch (error: any) {
      console.error("Error loading freight permissions:", error);
      
      // Check if error is related to offline status
      if (error.code === 'unavailable' || error.message?.includes('offline')) {
        setIsOffline(true);
        toast.error("Vous êtes hors ligne. Les permissions ne peuvent pas être chargées.");
      } else {
        toast.error("Erreur lors du chargement des permissions");
      }
    } finally {
      setIsLoading(false);
    }
  }, [firestore, permissionsDocumentId]);
  
  useEffect(() => {
    loadPermissions();
  }, [loadPermissions, retryCount]);

  // Optimisation: Vérifier s'il y a des changements à sauvegarder
  useEffect(() => {
    // Comparer les permissions actuelles avec les permissions initiales
    const currentJSON = JSON.stringify(permissions);
    const initialJSON = JSON.stringify(initialPermissions);
    setHasChanges(currentJSON !== initialJSON);
  }, [permissions, initialPermissions]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  // Optimisation: Mise à jour optimisée des permissions
  const togglePermission = (userId: string, action: keyof ModulePermission) => {
    setPermissions(prev => {
      // Créer une copie des permissions précédentes
      const newPermissions = { ...prev };
      
      // S'assurer que l'utilisateur existe dans l'objet des permissions
      if (!newPermissions[userId]) {
        newPermissions[userId] = { view: false, create: false, edit: false, delete: false };
      }
      
      // Cloner les permissions actuelles de l'utilisateur
      const userPermissions = { ...newPermissions[userId] };
      
      // Inverser la permission spécifique
      userPermissions[action] = !userPermissions[action];
      
      // Si la permission de visualisation est désactivée, désactiver toutes les autres permissions
      if (action === 'view' && !userPermissions.view) {
        userPermissions.create = false;
        userPermissions.edit = false;
        userPermissions.delete = false;
      }
      
      // Si une autre permission est activée, s'assurer que la visualisation est également activée
      if (action !== 'view' && userPermissions[action]) {
        userPermissions.view = true;
      }
      
      // Mettre à jour les permissions de l'utilisateur
      newPermissions[userId] = userPermissions;
      
      return newPermissions;
    });
  };

  // Optimisation: Réinitialiser les modifications non sauvegardées
  const handleCancel = () => {
    setPermissions(JSON.parse(JSON.stringify(initialPermissions)));
    setHasChanges(false);
    toast.info("Modifications annulées");
  };

  const savePermissions = async () => {
    if (!hasChanges) {
      toast.info("Aucune modification à enregistrer");
      return;
    }
    
    try {
      setIsSaving(true);
      
      const permissionsData: FreightPermissions = {
        permissions,
        updatedAt: new Date()
      };
      
      // Optimisation: Écrire les données uniquement si des modifications ont été apportées
      await firestore.set(permissionsDocumentId, permissionsData);
      
      // Mettre à jour les permissions initiales après la sauvegarde
      setInitialPermissions(JSON.parse(JSON.stringify(permissions)));
      setHasChanges(false);
      
      toast.success("Permissions enregistrées avec succès");
      setIsOffline(false);
    } catch (error: any) {
      console.error("Error saving freight permissions:", error);
      
      // Check if error is related to offline status
      if (error.code === 'unavailable' || error.message?.includes('offline')) {
        setIsOffline(true);
        toast.error("Impossible d'enregistrer les permissions en mode hors ligne");
      } else {
        toast.error(`Erreur lors de l'enregistrement des permissions: ${(error as Error).message}`);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Droits d'accès au Module Fret</CardTitle>
        <CardDescription>
          Gérez les permissions d'accès des utilisateurs au module Fret
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isOffline && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Vous êtes actuellement hors ligne. Les modifications ne seront pas enregistrées.</span>
              <Button variant="outline" size="sm" onClick={handleRetry} className="ml-2 flex items-center gap-1">
                <RefreshCw className="h-3 w-3" /> Réessayer
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {isLoading || isLoadingEmployees ? (
          <div className="text-center py-4">Chargement des données...</div>
        ) : isOffline && Object.keys(permissions).length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Impossible de charger les permissions en mode hors ligne</p>
            <Button onClick={handleRetry} className="flex items-center gap-2 mx-auto">
              <RefreshCw className="h-4 w-4" /> Réessayer
            </Button>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">Utilisateur</TableHead>
                  <TableHead className="text-center">Voir</TableHead>
                  <TableHead className="text-center">Créer</TableHead>
                  <TableHead className="text-center">Modifier</TableHead>
                  <TableHead className="text-center">Supprimer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee: EmployeeUser) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="font-medium">{employee.firstName} {employee.lastName}</div>
                      <div className="text-sm text-muted-foreground">{employee.email}</div>
                    </TableCell>
                    
                    {(['view', 'create', 'edit', 'delete'] as const).map((action) => (
                      <TableCell key={action} className="text-center">
                        <Checkbox 
                          checked={!!permissions[employee.id]?.[action]}
                          onCheckedChange={() => togglePermission(employee.id, action)}
                          disabled={isOffline || isSaving}
                          aria-label={`Permission ${action} pour ${employee.firstName} ${employee.lastName}`}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <Separator className="my-6" />
            
            <div className="flex justify-end space-x-4">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                disabled={isSaving || isOffline || !hasChanges}
              >
                Annuler
              </Button>
              <Button 
                onClick={savePermissions} 
                disabled={isSaving || isOffline || !hasChanges}
              >
                {isSaving ? "Enregistrement..." : "Enregistrer les permissions"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FreightPermissionsSettings;
