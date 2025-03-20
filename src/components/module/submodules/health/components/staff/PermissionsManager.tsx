
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const PermissionsManager: React.FC = () => {
  const [saving, setSaving] = useState(false);
  const [selectedRole, setSelectedRole] = useState("medecin");

  // Sample permission settings
  const modules = [
    { id: "patients", name: "Patients" },
    { id: "consultations", name: "Consultations" },
    { id: "appointments", name: "Rendez-vous" },
    { id: "medical-records", name: "Dossiers médicaux" },
    { id: "lab", name: "Laboratoire" },
    { id: "prescriptions", name: "Ordonnances" },
    { id: "pharmacy", name: "Pharmacie" },
    { id: "billing", name: "Facturation" }
  ];

  const roles = [
    { id: "medecin", name: "Médecin" },
    { id: "infirmier", name: "Infirmier" },
    { id: "secretaire", name: "Secrétaire médicale" },
    { id: "technicien", name: "Technicien" },
    { id: "administrateur", name: "Administrateur" }
  ];

  const defaultPermissions = {
    medecin: {
      patients: { view: true, create: true, edit: true, delete: false },
      consultations: { view: true, create: true, edit: true, delete: true },
      appointments: { view: true, create: true, edit: true, delete: true },
      "medical-records": { view: true, create: true, edit: true, delete: false },
      lab: { view: true, create: true, edit: false, delete: false },
      prescriptions: { view: true, create: true, edit: true, delete: true },
      pharmacy: { view: true, create: false, edit: false, delete: false },
      billing: { view: true, create: false, edit: false, delete: false }
    },
    infirmier: {
      patients: { view: true, create: true, edit: true, delete: false },
      consultations: { view: true, create: false, edit: false, delete: false },
      appointments: { view: true, create: true, edit: true, delete: false },
      "medical-records": { view: true, create: false, edit: false, delete: false },
      lab: { view: true, create: true, edit: false, delete: false },
      prescriptions: { view: true, create: false, edit: false, delete: false },
      pharmacy: { view: true, create: false, edit: false, delete: false },
      billing: { view: false, create: false, edit: false, delete: false }
    },
    secretaire: {
      patients: { view: true, create: true, edit: true, delete: false },
      consultations: { view: true, create: false, edit: false, delete: false },
      appointments: { view: true, create: true, edit: true, delete: true },
      "medical-records": { view: true, create: false, edit: false, delete: false },
      lab: { view: true, create: false, edit: false, delete: false },
      prescriptions: { view: false, create: false, edit: false, delete: false },
      pharmacy: { view: false, create: false, edit: false, delete: false },
      billing: { view: true, create: true, edit: true, delete: false }
    },
    technicien: {
      patients: { view: true, create: false, edit: false, delete: false },
      consultations: { view: false, create: false, edit: false, delete: false },
      appointments: { view: true, create: false, edit: false, delete: false },
      "medical-records": { view: false, create: false, edit: false, delete: false },
      lab: { view: true, create: true, edit: true, delete: false },
      prescriptions: { view: false, create: false, edit: false, delete: false },
      pharmacy: { view: false, create: false, edit: false, delete: false },
      billing: { view: false, create: false, edit: false, delete: false }
    },
    administrateur: {
      patients: { view: true, create: true, edit: true, delete: true },
      consultations: { view: true, create: true, edit: true, delete: true },
      appointments: { view: true, create: true, edit: true, delete: true },
      "medical-records": { view: true, create: true, edit: true, delete: true },
      lab: { view: true, create: true, edit: true, delete: true },
      prescriptions: { view: true, create: true, edit: true, delete: true },
      pharmacy: { view: true, create: true, edit: true, delete: true },
      billing: { view: true, create: true, edit: true, delete: true }
    }
  };

  const [permissions, setPermissions] = useState(defaultPermissions);

  const handlePermissionChange = (moduleId: string, action: "view" | "create" | "edit" | "delete") => {
    setPermissions(prev => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole as keyof typeof prev],
        [moduleId]: {
          ...prev[selectedRole as keyof typeof prev][moduleId as keyof typeof prev[keyof typeof prev]],
          [action]: !prev[selectedRole as keyof typeof prev][moduleId as keyof typeof prev[keyof typeof prev]][action]
        }
      }
    }));
  };

  const handleSavePermissions = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    toast.success("Permissions enregistrées avec succès");
  };

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Sélectionner un rôle</label>
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-full md:w-[240px]">
            <SelectValue placeholder="Sélectionner un rôle" />
          </SelectTrigger>
          <SelectContent>
            {roles.map(role => (
              <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Module</TableHead>
              <TableHead>Voir</TableHead>
              <TableHead>Créer</TableHead>
              <TableHead>Modifier</TableHead>
              <TableHead>Supprimer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modules.map(module => (
              <TableRow key={module.id}>
                <TableCell className="font-medium">{module.name}</TableCell>
                <TableCell>
                  <Checkbox 
                    checked={permissions[selectedRole as keyof typeof permissions][module.id as keyof typeof permissions[keyof typeof permissions]].view}
                    onCheckedChange={() => handlePermissionChange(module.id, "view")}
                  />
                </TableCell>
                <TableCell>
                  <Checkbox 
                    checked={permissions[selectedRole as keyof typeof permissions][module.id as keyof typeof permissions[keyof typeof permissions]].create}
                    onCheckedChange={() => handlePermissionChange(module.id, "create")}
                  />
                </TableCell>
                <TableCell>
                  <Checkbox 
                    checked={permissions[selectedRole as keyof typeof permissions][module.id as keyof typeof permissions[keyof typeof permissions]].edit}
                    onCheckedChange={() => handlePermissionChange(module.id, "edit")}
                  />
                </TableCell>
                <TableCell>
                  <Checkbox 
                    checked={permissions[selectedRole as keyof typeof permissions][module.id as keyof typeof permissions[keyof typeof permissions]].delete}
                    onCheckedChange={() => handlePermissionChange(module.id, "delete")}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end mt-4">
        <Button onClick={handleSavePermissions} disabled={saving}>
          {saving ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Enregistrer les modifications
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PermissionsManager;
