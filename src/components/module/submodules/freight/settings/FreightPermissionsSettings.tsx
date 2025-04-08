
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { CheckCircle, ShieldCheck, AlertCircle, Loader2, Save, Wifi, WifiOff } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useEmployeesPermissions } from '@/hooks/useEmployeesPermissions';

interface FreightPermissionsSettingsProps {
  isAdmin: boolean;
}

const FreightPermissionsSettings: React.FC<FreightPermissionsSettingsProps> = ({ isAdmin }) => {
  const { employees, isLoading: loadingEmployees } = useEmployeesPermissions();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // État pour les permissions
  const [permissions, setPermissions] = useState({
    expeditions: {
      admin: 'write',
      manager: 'write',
      user: 'read',
      viewer: 'read'
    },
    conteneurs: {
      admin: 'write',
      manager: 'write',
      user: 'read',
      viewer: 'none'
    },
    tarification: {
      admin: 'write',
      manager: 'write',
      user: 'read',
      viewer: 'none'
    },
    documents: {
      admin: 'write',
      manager: 'write',
      user: 'read',
      viewer: 'read'
    },
    clientPortal: {
      admin: 'write',
      manager: 'write',
      user: 'none',
      viewer: 'none'
    },
    parametres: {
      admin: 'write',
      manager: 'read',
      user: 'none',
      viewer: 'none'
    }
  });
  
  // Surveiller l'état de connexion
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Charger les permissions depuis Firestore
  useEffect(() => {
    const loadPermissions = async () => {
      setLoading(true);
      
      try {
        // Essayer de récupérer les permissions depuis Firestore
        const permissionsRef = doc(db, COLLECTIONS.FREIGHT.PERMISSIONS, 'roles');
        const permissionsDoc = await getDoc(permissionsRef);
        
        if (permissionsDoc.exists()) {
          const permissionsData = permissionsDoc.data();
          setPermissions(permissionsData);
        } else {
          // Si le document n'existe pas encore, on garde les valeurs par défaut
          console.log("Aucune permission trouvée, utilisation des valeurs par défaut");
        }
      } catch (error) {
        console.error("Erreur lors du chargement des permissions:", error);
        
        if (isOffline) {
          toast({
            title: "Mode hors ligne",
            description: "Vous êtes en mode hors ligne. Les modifications ne seront pas enregistrées.",
            variant: "warning"
          });
        } else {
          toast({
            title: "Erreur",
            description: "Impossible de charger les permissions. Veuillez réessayer.",
            variant: "destructive"
          });
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadPermissions();
  }, [isOffline]);
  
  const handlePermissionChange = (module: string, role: string, value: string) => {
    setPermissions(prev => ({
      ...prev,
      [module]: {
        ...prev[module as keyof typeof prev],
        [role]: value
      }
    }));
    setHasUnsavedChanges(true);
  };
  
  const handleSavePermissions = async () => {
    if (isOffline) {
      toast({
        title: "Mode hors ligne",
        description: "Vous êtes en mode hors ligne. Les modifications ne seront pas enregistrées.",
        variant: "warning"
      });
      return;
    }
    
    if (!isAdmin) {
      toast({
        title: "Accès refusé",
        description: "Seuls les administrateurs peuvent modifier les permissions.",
        variant: "destructive"
      });
      return;
    }
    
    setSaving(true);
    
    try {
      // Enregistrer les permissions dans Firestore
      const permissionsRef = doc(db, COLLECTIONS.FREIGHT.PERMISSIONS, 'roles');
      await setDoc(permissionsRef, permissions);
      
      toast({
        title: "Permissions enregistrées",
        description: "Les droits d'accès ont été modifiés avec succès.",
        variant: "success"
      });
      
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des permissions:", error);
      
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les permissions. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  
  const modules = [
    { id: 'expeditions', name: 'Expéditions' },
    { id: 'conteneurs', name: 'Conteneurs' },
    { id: 'tarification', name: 'Tarification' },
    { id: 'documents', name: 'Documents' },
    { id: 'clientPortal', name: 'Portail Client' },
    { id: 'parametres', name: 'Paramètres' }
  ];
  
  const roles = [
    { id: 'admin', name: 'Administrateur' },
    { id: 'manager', name: 'Gestionnaire' },
    { id: 'user', name: 'Utilisateur' },
    { id: 'viewer', name: 'Lecteur' }
  ];

  return (
    <div className="space-y-6">
      {isOffline && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-3">
          <WifiOff className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800">Mode hors ligne</h3>
            <p className="text-sm text-amber-700">
              Vous êtes actuellement hors ligne. Les modifications ne seront pas enregistrées.
            </p>
          </div>
        </div>
      )}
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-green-600" />
            <CardTitle>Paramètres de sécurité</CardTitle>
          </div>
          <CardDescription>
            Configurez les droits d'accès des utilisateurs aux différentes fonctionnalités
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
              <span className="ml-2 text-gray-600">Chargement des permissions...</span>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left p-2 bg-slate-100 border">Module</th>
                      {roles.map(role => (
                        <th key={role.id} className="text-left p-2 bg-slate-100 border">
                          {role.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {modules.map(module => (
                      <tr key={module.id}>
                        <td className="p-2 border font-medium">{module.name}</td>
                        {roles.map(role => (
                          <td key={`${module.id}-${role.id}`} className="p-2 border">
                            <Select
                              value={permissions[module.id as keyof typeof permissions][role.id as keyof typeof permissions.expeditions]}
                              onValueChange={(value) => handlePermissionChange(module.id, role.id, value)}
                              disabled={!isAdmin || saving}
                            >
                              <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Sélectionner..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="write">Lecture/Écriture</SelectItem>
                                <SelectItem value="read">Lecture seule</SelectItem>
                                <SelectItem value="none">Aucun accès</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-900">Important</h4>
                  <p className="text-sm text-amber-700">
                    Les modifications des droits d'accès seront appliquées immédiatement pour tous les utilisateurs.
                    Assurez-vous que ces changements n'impacteront pas les opérations en cours.
                  </p>
                </div>
              </div>
              
              {loadingEmployees ? (
                <div className="flex justify-center items-center py-4">
                  <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                  <span className="ml-2 text-gray-600">Chargement des employés...</span>
                </div>
              ) : isAdmin && (
                <div className="rounded-md border">
                  <div className="p-4 bg-slate-50 font-medium">
                    Employés ({employees.length})
                  </div>
                  <div className="p-2 max-h-[300px] overflow-y-auto">
                    {employees.length > 0 ? (
                      <table className="w-full text-sm">
                        <thead className="text-xs text-gray-500">
                          <tr>
                            <th className="text-left p-2">Nom</th>
                            <th className="text-left p-2">Email</th>
                            <th className="text-left p-2">Rôle</th>
                          </tr>
                        </thead>
                        <tbody>
                          {employees.map(employee => (
                            <tr key={employee.id} className="border-t hover:bg-gray-50">
                              <td className="p-2">{employee.firstName} {employee.lastName}</td>
                              <td className="p-2">{employee.email}</td>
                              <td className="p-2">{employee.role || 'Non défini'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-center p-4 text-gray-500">
                        Aucun employé trouvé
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  className="mr-2"
                  disabled={!isAdmin || saving}
                  onClick={() => {
                    // Réinitialiser les permissions aux valeurs par défaut
                    setPermissions({
                      expeditions: {
                        admin: 'write',
                        manager: 'write',
                        user: 'read',
                        viewer: 'read'
                      },
                      conteneurs: {
                        admin: 'write',
                        manager: 'write',
                        user: 'read',
                        viewer: 'none'
                      },
                      tarification: {
                        admin: 'write',
                        manager: 'write',
                        user: 'read',
                        viewer: 'none'
                      },
                      documents: {
                        admin: 'write',
                        manager: 'write',
                        user: 'read',
                        viewer: 'read'
                      },
                      clientPortal: {
                        admin: 'write',
                        manager: 'write',
                        user: 'none',
                        viewer: 'none'
                      },
                      parametres: {
                        admin: 'write',
                        manager: 'read',
                        user: 'none',
                        viewer: 'none'
                      }
                    });
                    setHasUnsavedChanges(true);
                  }}
                >
                  Réinitialiser
                </Button>
                <Button
                  onClick={handleSavePermissions}
                  disabled={!isAdmin || saving || isOffline || !hasUnsavedChanges}
                  className="flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FreightPermissionsSettings;
