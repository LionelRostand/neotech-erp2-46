
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserPermissions } from '@/components/module/submodules/employees/services/permissionService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useEmployeesPermissions, EmployeeUser } from '@/hooks/useEmployeesPermissions';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/patched-select';
import { FreightAlert } from '../components/FreightAlert';

// Define types for permissions structure
interface ModulePermission {
  admin: string;
  manager: string;
  user: string;
  viewer: string;
}

interface FreightPermissions {
  expeditions: ModulePermission;
  conteneurs: ModulePermission;
  tarification: ModulePermission;
  documents: ModulePermission;
  clientPortal: ModulePermission;
  parametres: ModulePermission;
}

interface FreightPermissionsSettingsProps {
  isAdmin: boolean;
}

const DEFAULT_PERMISSIONS: FreightPermissions = {
  expeditions: {
    admin: "Tous droits",
    manager: "Modification, création",
    user: "Modification",
    viewer: "Consultation"
  },
  conteneurs: {
    admin: "Tous droits",
    manager: "Modification, création",
    user: "Modification",
    viewer: "Consultation"
  },
  tarification: {
    admin: "Tous droits",
    manager: "Modification, création",
    user: "Modification",
    viewer: "Consultation"
  },
  documents: {
    admin: "Tous droits",
    manager: "Modification, création",
    user: "Modification",
    viewer: "Consultation"
  },
  clientPortal: {
    admin: "Tous droits",
    manager: "Modification, création",
    user: "Modification",
    viewer: "Consultation"
  },
  parametres: {
    admin: "Tous droits",
    manager: "Modification, création",
    user: "Modification",
    viewer: "Consultation"
  }
};

// Role types that match the keys in ModulePermission
type RoleType = keyof ModulePermission;

const FreightPermissionsSettings: React.FC<FreightPermissionsSettingsProps> = ({ isAdmin }) => {
  const [permissions, setPermissions] = useState<FreightPermissions>(DEFAULT_PERMISSIONS);
  const [activeTab, setActiveTab] = useState("roles");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { currentUser } = useAuth();
  const { employees, isLoading: employeesLoading } = useEmployeesPermissions();
  const [userPermissions, setUserPermissions] = useState<Record<string, Record<string, RoleType>>>({});

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setIsLoading(true);
        // Attempt to get permissions from Firestore
        const docRef = doc(db, COLLECTIONS.FREIGHT.PERMISSIONS, 'roles');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          // Type check and ensure data matches our expected structure
          if (data && typeof data === 'object') {
            // Create a merged permissions object with defaults for any missing keys
            const mergedPermissions = { ...DEFAULT_PERMISSIONS };
            
            // For each expected permission category, check if it exists in the data
            Object.keys(DEFAULT_PERMISSIONS).forEach(key => {
              const category = key as keyof FreightPermissions;
              if (data[category] && typeof data[category] === 'object') {
                mergedPermissions[category] = {
                  ...DEFAULT_PERMISSIONS[category],
                  ...data[category]
                };
              }
            });
            
            setPermissions(mergedPermissions);
          }
        }

        // Load user-specific permissions
        const usersPermRef = doc(db, COLLECTIONS.FREIGHT.PERMISSIONS, 'users');
        const usersPermSnap = await getDoc(usersPermRef);
        
        if (usersPermSnap.exists()) {
          const data = usersPermSnap.data();
          if (data && typeof data === 'object') {
            setUserPermissions(data as Record<string, Record<string, RoleType>>);
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des permissions de fret:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les paramètres de permissions",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  const savePermissions = async () => {
    if (!currentUser) {
      toast({
        title: "Erreur d'authentification",
        description: "Vous devez être connecté pour effectuer cette action",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSaving(true);
      
      // Save role definitions
      await setDoc(doc(db, COLLECTIONS.FREIGHT.PERMISSIONS, 'roles'), permissions);
      
      // Save user-specific permissions
      await setDoc(doc(db, COLLECTIONS.FREIGHT.PERMISSIONS, 'users'), userPermissions);
      
      toast({
        title: "Paramètres enregistrés",
        description: "Les permissions ont été mises à jour avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des permissions:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les paramètres de permissions",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePermissionChange = (module: keyof FreightPermissions, role: RoleType, value: string) => {
    setPermissions(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [role]: value
      }
    }));
  };

  const handleUserPermissionChange = (userId: string, module: keyof FreightPermissions, role: RoleType) => {
    setUserPermissions(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [module]: role
      }
    }));
  };

  const renderRolesTab = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <FreightAlert variant="warning">
            Chargement des paramètres de permissions...
          </FreightAlert>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-4 h-32"></div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <FreightAlert variant="default">
          <p>
            Définissez les permissions associées à chaque rôle pour le module Fret. Ces rôles
            pourront ensuite être attribués aux utilisateurs dans l'onglet "Utilisateurs".
          </p>
        </FreightAlert>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(permissions).map(([moduleName, modulePerms]) => (
            <div key={moduleName} className="border rounded-lg p-4 space-y-3 bg-white shadow-sm">
              <h3 className="font-medium text-lg capitalize">{translateModuleName(moduleName)}</h3>
              
              <div className="space-y-2">
                {Object.entries(modulePerms).map(([role, description]) => (
                  <div key={role} className="flex items-center space-x-2">
                    <div className="w-24 text-sm font-medium capitalize">{translateRoleName(role)}:</div>
                    <input 
                      type="text" 
                      value={description} 
                      onChange={(e) => handlePermissionChange(
                        moduleName as keyof FreightPermissions,
                        role as RoleType,
                        e.target.value
                      )}
                      className="flex-1 text-sm p-1 border rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderUsersTab = () => {
    if (isLoading || employeesLoading) {
      return (
        <FreightAlert variant="default">
          Chargement des données utilisateur...
        </FreightAlert>
      );
    }

    if (!employees || employees.length === 0) {
      return (
        <FreightAlert variant="default">
          Aucun employé trouvé dans le système. Veuillez d'abord ajouter des employés pour pouvoir gérer leurs permissions.
        </FreightAlert>
      );
    }

    return (
      <div className="space-y-6">
        <FreightAlert variant="default">
          <p>
            Attribuez des rôles spécifiques à chaque utilisateur pour chaque section du module Fret.
            Les permissions associées à ces rôles sont définies dans l'onglet "Rôles".
          </p>
        </FreightAlert>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-3 border-b">Utilisateur</th>
                {Object.keys(permissions).map(module => (
                  <th key={module} className="text-left p-3 border-b">
                    {translateModuleName(module)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map(employee => (
                <tr key={employee.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="font-medium">{employee.firstName} {employee.lastName}</div>
                    <div className="text-sm text-gray-500">{employee.email}</div>
                  </td>
                  
                  {Object.keys(permissions).map(module => {
                    const moduleKey = module as keyof FreightPermissions;
                    const currentRole = userPermissions[employee.id]?.[module] as RoleType || 'viewer';
                    
                    return (
                      <td key={`${employee.id}-${module}`} className="p-3">
                        <Select 
                          value={currentRole} 
                          onValueChange={(value) => handleUserPermissionChange(
                            employee.id, 
                            moduleKey, 
                            value as RoleType
                          )}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sélectionner un rôle" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="user">Utilisateur</SelectItem>
                            <SelectItem value="viewer">Visiteur</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const translateModuleName = (moduleName: string): string => {
    const translations: Record<string, string> = {
      'expeditions': 'Expéditions',
      'conteneurs': 'Conteneurs',
      'tarification': 'Tarification',
      'documents': 'Documents',
      'clientPortal': 'Portail Client',
      'parametres': 'Paramètres'
    };
    
    return translations[moduleName] || moduleName;
  };
  
  const translateRoleName = (roleName: string): string => {
    const translations: Record<string, string> = {
      'admin': 'Admin',
      'manager': 'Manager',
      'user': 'Utilisateur',
      'viewer': 'Visiteur'
    };
    
    return translations[roleName] || roleName;
  };

  if (!isAdmin) {
    return (
      <FreightAlert variant="default">
        Vous n'avez pas les droits d'administration nécessaires pour gérer les permissions du module Fret.
      </FreightAlert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Gestion des droits d'accès</h3>
        <Button 
          onClick={savePermissions} 
          disabled={isSaving}
        >
          {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="roles">Rôles et permissions</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="roles" className="pt-4">
          {renderRolesTab()}
        </TabsContent>
        
        <TabsContent value="users" className="pt-4">
          {renderUsersTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FreightPermissionsSettings;
