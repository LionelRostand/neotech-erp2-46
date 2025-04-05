
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Users, Building, Database, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from 'sonner';
import { useNavigate, useLocation } from "react-router-dom";
import { usePermissions } from '@/hooks/usePermissions';
import GeneralTab from './settings/GeneralTab';
import PermissionsTab from './settings/PermissionsTab';
import CompaniesTab from './settings/CompaniesTab';
import DataTab from './settings/DataTab';
import UserManagementDialog from './settings/users/UserManagementDialog';
import { User } from '@/types/user';

const CrmSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = usePermissions();

  const handleBackToList = () => {
    navigate('/modules/crm');
  };
  
  const handleAddUser = async (userData: any) => {
    try {
      // Simulation d'appel API pour ajouter un utilisateur
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Nouvel utilisateur:', userData);
      toast.success('Utilisateur ajouté avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
      throw error;
    }
  };
  
  const handleUpdateUser = async (userData: any) => {
    try {
      // Simulation d'appel API pour mettre à jour un utilisateur
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Mise à jour utilisateur:', userData);
      toast.success('Utilisateur mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      throw error;
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for settings */}
        <aside className="w-64 border-r border-gray-100 shadow-sm bg-white">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center h-16 px-4 border-b">
              <button 
                onClick={handleBackToList}
                className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                ← Retour au CRM
              </button>
            </div>
            
            {/* Navigation */}
            <div className="flex-1 overflow-auto py-4">
              <nav className="space-y-1 px-2">
                <a 
                  href="#general" 
                  className={cn(
                    "flex items-center px-3 py-2 text-sm rounded-md",
                    activeTab === "general" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("general");
                  }}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Général</span>
                </a>
                
                <a 
                  href="#permissions" 
                  className={cn(
                    "flex items-center px-3 py-2 text-sm rounded-md",
                    activeTab === "permissions" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("permissions");
                  }}
                >
                  <Users className="mr-2 h-4 w-4" />
                  <span>Permissions</span>
                </a>
                
                <a 
                  href="#companies" 
                  className={cn(
                    "flex items-center px-3 py-2 text-sm rounded-md",
                    activeTab === "companies" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("companies");
                  }}
                >
                  <Building className="mr-2 h-4 w-4" />
                  <span>Entreprises</span>
                </a>
                
                <a 
                  href="#data" 
                  className={cn(
                    "flex items-center px-3 py-2 text-sm rounded-md",
                    activeTab === "data" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("data");
                  }}
                >
                  <Database className="mr-2 h-4 w-4" />
                  <span>Données</span>
                </a>
              </nav>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t">
              {isAdmin && (
                <div className="text-xs text-gray-500">
                  Connecté en tant qu'administrateur
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Paramètres CRM</h1>
              {activeTab === "permissions" && (
                <Button onClick={() => setIsAddUserDialogOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Ajouter un utilisateur
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {activeTab === "general" && <GeneralTab />}
              {activeTab === "permissions" && <PermissionsTab />}
              {activeTab === "companies" && <CompaniesTab />}
              {activeTab === "data" && <DataTab />}
            </div>
          </div>
        </main>
      </div>
      
      {/* Dialogs de gestion des utilisateurs */}
      <UserManagementDialog 
        isOpen={isAddUserDialogOpen}
        onClose={() => setIsAddUserDialogOpen(false)}
        onSave={handleAddUser}
        title="Ajouter un utilisateur"
        description="Ajoutez un nouvel utilisateur au CRM et définissez ses droits d'accès."
      />
      
      <UserManagementDialog 
        isOpen={isEditUserDialogOpen}
        onClose={() => setIsEditUserDialogOpen(false)}
        user={selectedUser}
        onSave={handleUpdateUser}
        title="Modifier un utilisateur"
        description="Modifiez les informations et les droits d'accès de l'utilisateur."
      />
    </div>
  );
};

export default CrmSettings;
