
import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, CheckCircle, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { isNetworkError } from '@/hooks/firestore/network-handler';

interface FreightPermissionsSettingsProps {
  isAdmin: boolean;
}

// Define the permissions structure type
interface PermissionsSettings {
  expeditions: {
    admin: string;
    manager: string;
    user: string;
    viewer: string;
  };
  conteneurs: {
    admin: string;
    manager: string;
    user: string;
    viewer: string;
  };
  tarification: {
    admin: string;
    manager: string;
    user: string;
    viewer: string;
  };
  documents: {
    admin: string;
    manager: string;
    user: string;
    viewer: string;
  };
  clientPortal: {
    admin: string;
    manager: string;
    user: string;
    viewer: string;
  };
  parametres: {
    admin: string;
    manager: string;
    user: string;
    viewer: string;
  };
}

// Liste des niveaux d'accès disponibles
const ACCESS_LEVELS = [
  { value: "all", label: "Contrôle total" },
  { value: "edit", label: "Modification" },
  { value: "create", label: "Création" },
  { value: "view", label: "Lecture seule" },
  { value: "none", label: "Aucun accès" },
];

// Default permissions structure
const DEFAULT_PERMISSIONS: PermissionsSettings = {
  expeditions: {
    admin: "all",
    manager: "edit",
    user: "create",
    viewer: "view"
  },
  conteneurs: {
    admin: "all",
    manager: "edit",
    user: "view",
    viewer: "view"
  },
  tarification: {
    admin: "all",
    manager: "edit",
    user: "view",
    viewer: "none"
  },
  documents: {
    admin: "all",
    manager: "edit",
    user: "view",
    viewer: "view"
  },
  clientPortal: {
    admin: "all",
    manager: "edit",
    user: "view",
    viewer: "view"
  },
  parametres: {
    admin: "all",
    manager: "view",
    user: "none",
    viewer: "none"
  }
};

const FreightPermissionsSettings: React.FC<FreightPermissionsSettingsProps> = ({ isAdmin }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [permissionsId, setPermissionsId] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<PermissionsSettings>(DEFAULT_PERMISSIONS);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("roles");

  // Charger les paramètres de permission au montage du composant
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setIsOffline(false);

        // Essayer de récupérer le document des permissions
        const permissionsRef = doc(db, COLLECTIONS.FREIGHT.PERMISSIONS);
        const permissionsDoc = await getDoc(permissionsRef);

        if (permissionsDoc.exists()) {
          const data = permissionsDoc.data();
          setPermissionsId(permissionsDoc.id);
          
          // Create a properly typed permissions object
          const loadedPermissions: PermissionsSettings = {
            expeditions: {
              admin: data.expeditions?.admin || "all",
              manager: data.expeditions?.manager || "edit",
              user: data.expeditions?.user || "create",
              viewer: data.expeditions?.viewer || "view"
            },
            conteneurs: {
              admin: data.conteneurs?.admin || "all",
              manager: data.conteneurs?.manager || "edit",
              user: data.conteneurs?.user || "view",
              viewer: data.conteneurs?.viewer || "view"
            },
            tarification: {
              admin: data.tarification?.admin || "all",
              manager: data.tarification?.manager || "edit",
              user: data.tarification?.user || "view",
              viewer: data.tarification?.viewer || "none"
            },
            documents: {
              admin: data.documents?.admin || "all",
              manager: data.documents?.manager || "edit",
              user: data.documents?.user || "view",
              viewer: data.documents?.viewer || "view"
            },
            clientPortal: {
              admin: data.clientPortal?.admin || "all",
              manager: data.clientPortal?.manager || "edit",
              user: data.clientPortal?.user || "view",
              viewer: data.clientPortal?.viewer || "view"
            },
            parametres: {
              admin: data.parametres?.admin || "all",
              manager: data.parametres?.manager || "view",
              user: data.parametres?.user || "none",
              viewer: data.parametres?.viewer || "none"
            }
          };
          
          setPermissions(loadedPermissions);
        } else {
          // Si le document n'existe pas encore, on utilise les valeurs par défaut
          console.log("Aucune permission existante, utilisation des valeurs par défaut");
        }
      } catch (err: any) {
        console.error("Erreur lors du chargement des permissions:", err);
        
        if (isNetworkError(err)) {
          setIsOffline(true);
          // En mode hors ligne, on continue avec les valeurs par défaut
          toast({
            title: "Mode hors ligne",
            description: "Vous êtes en mode hors ligne. Les modifications seront enregistrées localement.",
            variant: "default"
          });
        } else {
          setError(`Erreur lors du chargement des permissions: ${err.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  // Fonction pour mettre à jour une permission spécifique
  const updatePermission = (section: keyof PermissionsSettings, role: keyof PermissionsSettings['expeditions'], value: string) => {
    setPermissions(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [role]: value
      }
    }));
  };

  // Enregistrer les modifications
  const savePermissions = async () => {
    if (!isAdmin) {
      toast({
        title: "Accès refusé",
        description: "Seuls les administrateurs peuvent modifier les permissions.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      const permissionsRef = doc(db, COLLECTIONS.FREIGHT.PERMISSIONS);
      
      if (permissionsId) {
        // Mise à jour d'un document existant
        await updateDoc(permissionsRef, {
          ...permissions,
          updatedAt: new Date(),
          updatedBy: 'current-user', // Idéalement, utiliser l'ID de l'utilisateur actuel
        });
      } else {
        // Création d'un nouveau document
        await setDoc(permissionsRef, {
          ...permissions,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'current-user', // Idéalement, utiliser l'ID de l'utilisateur actuel
        });
        setPermissionsId(permissionsRef.id);
      }

      setSuccessMessage("Permissions enregistrées avec succès");
      toast({
        title: "Succès",
        description: "Les permissions ont été mises à jour.",
        variant: "default"
      });
    } catch (err: any) {
      console.error("Erreur lors de l'enregistrement des permissions:", err);
      
      if (isNetworkError(err)) {
        setIsOffline(true);
        toast({
          title: "Mode hors ligne",
          description: "Vous êtes en mode hors ligne. Les modifications seront enregistrées localement.",
          variant: "default"
        });
      } else {
        setError(`Erreur lors de l'enregistrement: ${err.message}`);
        toast({
          title: "Erreur",
          description: `Impossible d'enregistrer les permissions: ${err.message}`,
          variant: "destructive"
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p>Chargement des permissions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {isOffline && (
        <Alert variant="default">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Vous êtes actuellement en mode hors ligne. Les modifications seront enregistrées localement
            jusqu'à ce que la connexion soit rétablie.
          </AlertDescription>
        </Alert>
      )}

      {!isAdmin && (
        <Alert variant="default">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Seuls les administrateurs peuvent modifier les permissions du module.
          </AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert variant="default">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-600">{successMessage}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Gestion des permissions</CardTitle>
          <CardDescription>
            Définir les niveaux d'accès pour chaque rôle au sein du module Fret
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="roles">Par rôle</TabsTrigger>
              <TabsTrigger value="modules">Par fonction</TabsTrigger>
            </TabsList>
            
            <TabsContent value="roles">
              <div className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">Fonction</TableHead>
                        <TableHead>Administrateur</TableHead>
                        <TableHead>Responsable</TableHead>
                        <TableHead>Utilisateur</TableHead>
                        <TableHead>Observateur</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(permissions).map(([section, roles]) => (
                        <TableRow key={section}>
                          <TableCell className="font-medium">
                            {getModuleLabel(section as keyof PermissionsSettings)}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={roles.admin}
                              onValueChange={(value) => updatePermission(section as keyof PermissionsSettings, 'admin', value)}
                              disabled={!isAdmin}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Sélectionner un niveau" />
                              </SelectTrigger>
                              <SelectContent>
                                {ACCESS_LEVELS.map((level) => (
                                  <SelectItem key={level.value} value={level.value}>
                                    {level.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={roles.manager}
                              onValueChange={(value) => updatePermission(section as keyof PermissionsSettings, 'manager', value)}
                              disabled={!isAdmin}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Sélectionner un niveau" />
                              </SelectTrigger>
                              <SelectContent>
                                {ACCESS_LEVELS.map((level) => (
                                  <SelectItem key={level.value} value={level.value}>
                                    {level.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={roles.user}
                              onValueChange={(value) => updatePermission(section as keyof PermissionsSettings, 'user', value)}
                              disabled={!isAdmin}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Sélectionner un niveau" />
                              </SelectTrigger>
                              <SelectContent>
                                {ACCESS_LEVELS.map((level) => (
                                  <SelectItem key={level.value} value={level.value}>
                                    {level.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={roles.viewer}
                              onValueChange={(value) => updatePermission(section as keyof PermissionsSettings, 'viewer', value)}
                              disabled={!isAdmin}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Sélectionner un niveau" />
                              </SelectTrigger>
                              <SelectContent>
                                {ACCESS_LEVELS.map((level) => (
                                  <SelectItem key={level.value} value={level.value}>
                                    {level.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="modules">
              <div className="space-y-4">
                {Object.entries(permissions).map(([section, roles]) => (
                  <Card key={section} className="overflow-hidden">
                    <CardHeader className="bg-muted/50 py-3">
                      <CardTitle className="text-lg">{getModuleLabel(section as keyof PermissionsSettings)}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Rôle</TableHead>
                              <TableHead>Niveau d'accès</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {Object.entries(roles).map(([role, access]) => (
                              <TableRow key={role}>
                                <TableCell className="font-medium">{getRoleLabel(role)}</TableCell>
                                <TableCell>
                                  <Select
                                    value={access}
                                    onValueChange={(value) => updatePermission(section as keyof PermissionsSettings, role as keyof PermissionsSettings['expeditions'], value)}
                                    disabled={!isAdmin}
                                  >
                                    <SelectTrigger className="w-[200px]">
                                      <SelectValue placeholder="Sélectionner un niveau" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {ACCESS_LEVELS.map((level) => (
                                        <SelectItem key={level.value} value={level.value}>
                                          {level.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            <Badge variant="outline" className="mr-2">
              {isOffline ? 'Mode hors ligne' : 'Connecté'}
            </Badge>
            {permissionsId && (
              <Badge variant="outline">
                ID: {permissionsId.substring(0, 8)}...
              </Badge>
            )}
          </div>
          
          {isAdmin && (
            <Button 
              onClick={savePermissions} 
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                'Enregistrer les permissions'
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

// Utilitaires pour l'affichage des libellés
function getModuleLabel(key: keyof PermissionsSettings): string {
  const labels: Record<keyof PermissionsSettings, string> = {
    expeditions: "Expéditions",
    conteneurs: "Conteneurs",
    tarification: "Tarification",
    documents: "Documents",
    clientPortal: "Portail client",
    parametres: "Paramètres"
  };
  return labels[key];
}

function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    admin: "Administrateur",
    manager: "Responsable",
    user: "Utilisateur",
    viewer: "Observateur"
  };
  return labels[role] || role;
}

export default FreightPermissionsSettings;
