
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, ShieldCheck, AlertCircle } from 'lucide-react';

const FreightSecuritySettings: React.FC = () => {
  const { toast } = useToast();
  
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
  
  const handlePermissionChange = (module: string, role: string, value: string) => {
    setPermissions(prev => ({
      ...prev,
      [module]: {
        ...prev[module as keyof typeof prev],
        [role]: value
      }
    }));
  };
  
  const handleSavePermissions = () => {
    toast({
      title: "Paramètres de sécurité mis à jour",
      description: "Les droits d'accès ont été modifiés avec succès.",
      action: (
        <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
          <CheckCircle className="h-5 w-5 text-white" />
        </div>
      )
    });
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
          
          <div className="flex justify-end">
            <Button variant="outline" className="mr-2">
              Réinitialiser
            </Button>
            <Button onClick={handleSavePermissions}>
              Enregistrer les modifications
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FreightSecuritySettings;
