
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Check, X } from "lucide-react";
import { employeesModule } from "@/data/modules/employees";
import { useToast } from "@/hooks/use-toast";
import { useEmployeesPermissions } from "@/hooks/useEmployeesPermissions";

interface ManagePermissionsDialogProps {
  employeeId: string;
  employeeName: string;
}

const ManagePermissionsDialog: React.FC<ManagePermissionsDialogProps> = ({ employeeId, employeeName }) => {
  const { toast } = useToast();
  const { employees, updateEmployeePermissions } = useEmployeesPermissions();
  const [permissions, setPermissions] = useState<{
    [key: string]: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
  }>({});

  useEffect(() => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee?.permissions) {
      setPermissions(employee.permissions);
    }
  }, [employeeId, employees]);

  const handlePermissionChange = (moduleId: string, permissionType: 'view' | 'create' | 'edit' | 'delete', checked: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [permissionType]: checked
      }
    }));
  };

  const handleSetAllPermissions = (moduleId: string, value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [moduleId]: {
        view: value,
        create: value,
        edit: value,
        delete: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      const modulePermissions = permissions['employees'] || {
        view: false,
        create: false,
        edit: false,
        delete: false
      };
      
      await updateEmployeePermissions(employeeId, 'employees', modulePermissions);
      toast({
        title: "Permissions mises à jour",
        description: "Les permissions ont été sauvegardées avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour des permissions.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto">
          <Shield className="w-4 h-4 mr-2" />
          Gérer les permissions
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Gestion des permissions - {employeeName}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[500px] pr-4">
          <div className="space-y-6">
            {employeesModule.submodules.map((submodule) => (
              <div key={submodule.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">{submodule.name}</h3>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetAllPermissions(submodule.id, true)}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Tout
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetAllPermissions(submodule.id, false)}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Aucun
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`${submodule.id}-view`}
                      checked={permissions[submodule.id]?.view}
                      onCheckedChange={(checked) => 
                        handlePermissionChange(submodule.id, 'view', checked as boolean)
                      }
                    />
                    <label htmlFor={`${submodule.id}-view`} className="text-sm">
                      Visualiser
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`${submodule.id}-create`}
                      checked={permissions[submodule.id]?.create}
                      onCheckedChange={(checked) => 
                        handlePermissionChange(submodule.id, 'create', checked as boolean)
                      }
                    />
                    <label htmlFor={`${submodule.id}-create`} className="text-sm">
                      Créer
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`${submodule.id}-edit`}
                      checked={permissions[submodule.id]?.edit}
                      onCheckedChange={(checked) => 
                        handlePermissionChange(submodule.id, 'edit', checked as boolean)
                      }
                    />
                    <label htmlFor={`${submodule.id}-edit`} className="text-sm">
                      Modifier
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`${submodule.id}-delete`}
                      checked={permissions[submodule.id]?.delete}
                      onCheckedChange={(checked) => 
                        handlePermissionChange(submodule.id, 'delete', checked as boolean)
                      }
                    />
                    <label htmlFor={`${submodule.id}-delete`} className="text-sm">
                      Supprimer
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSave}>
              Sauvegarder les modifications
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ManagePermissionsDialog;
