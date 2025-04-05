
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Settings, Users, Building, Database } from "lucide-react";
import PermissionsTab from './settings/PermissionsTab';
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { usePermissions } from '@/hooks/usePermissions';

const CrmSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = usePermissions();

  const handleBackToList = () => {
    navigate('/modules/crm');
  };

  return (
    <div className="flex min-h-screen w-full bg-neotech-background">
      {/* Sidebar for settings */}
      <aside className="fixed top-0 left-0 z-10 h-screen w-64 bg-white border-r border-gray-100 shadow-sm">
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
      <main className="ml-64 flex-1 p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Paramètres CRM</h1>
          </div>

          <div className="space-y-4">
            {activeTab === "general" && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-medium mb-4">Paramètres généraux</h2>
                  <p className="text-muted-foreground">
                    Configurez les paramètres généraux du module CRM.
                  </p>
                </CardContent>
              </Card>
            )}

            {activeTab === "permissions" && (
              <PermissionsTab />
            )}

            {activeTab === "companies" && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-medium mb-4">Configuration des entreprises</h2>
                  <p className="text-muted-foreground">
                    Gérez les paramètres des entreprises dans le CRM.
                  </p>
                </CardContent>
              </Card>
            )}

            {activeTab === "data" && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-medium mb-4">Gestion des données</h2>
                  <p className="text-muted-foreground">
                    Importez, exportez et gérez les données du CRM.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CrmSettings;
