
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const GaragePermissionsTab = () => {
  // Add state to track permissions
  const [enhancedSecurity, setEnhancedSecurity] = useState(false);
  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>({});

  const handleSave = () => {
    toast.success("Paramètres des droits d'accès sauvegardés");
  };

  const handlePermissionChange = (roleId: string, permissionId: string, checked: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [roleId]: {
        ...(prev[roleId] || {}),
        [permissionId]: checked
      }
    }));
  };

  // Mock data pour les rôles et permissions
  const roles = ["Administrateur", "Manager", "Mécanicien", "Réceptionniste"];
  const permissionsList = [
    { name: "Voir les clients", id: "view_clients" },
    { name: "Modifier les clients", id: "edit_clients" },
    { name: "Voir les véhicules", id: "view_vehicles" },
    { name: "Modifier les véhicules", id: "edit_vehicles" },
    { name: "Gérer les rendez-vous", id: "manage_appointments" },
    { name: "Gérer les factures", id: "manage_invoices" },
    { name: "Gérer les programmes de fidélité", id: "manage_loyalty" },
    { name: "Accéder aux paramètres", id: "access_settings" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuration des droits d'accès</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="font-medium">Sécurité renforcée</h4>
                <p className="text-sm text-muted-foreground">
                  Activer la validation en deux étapes pour les modifications sensibles
                </p>
              </div>
              <Switch 
                checked={enhancedSecurity} 
                onCheckedChange={setEnhancedSecurity}
              />
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Permission</TableHead>
                  {roles.map(role => (
                    <TableHead key={role}>{role}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissionsList.map(permission => (
                  <TableRow key={permission.id}>
                    <TableCell>{permission.name}</TableCell>
                    {roles.map(role => (
                      <TableCell key={`${role}-${permission.id}`}>
                        <Checkbox 
                          checked={permissions[role]?.[permission.id] ?? 
                            (role === "Administrateur" || 
                            (role === "Manager" && !permission.id.includes("access_settings")))}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(role, permission.id, !!checked)
                          }
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          Enregistrer les modifications
        </Button>
      </div>
    </div>
  );
};

export default GaragePermissionsTab;
