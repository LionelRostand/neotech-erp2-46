
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GeneralTab from './settings/GeneralTab';
import PermissionsTab from './settings/PermissionsTab';
import IntegrationsTab from './settings/IntegrationsTab';
import NotificationsTab from './settings/NotificationsTab';
import useCompanyPermissions from './settings/useCompanyPermissions'; // Fixed import
import { companiesModule } from '@/data/modules/companies';

const CompaniesSettings: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('general');
  const [searchTerm, setSearchTerm] = useState('');
  const { 
    permissions: userPermissions, 
    isLoading, 
    saveUserPermissions, 
    addUserPermissions, 
    removeUserPermissions 
  } = useCompanyPermissions();

  // Mock users data
  const users = [
    { id: '1', displayName: 'John Doe', email: 'john.doe@example.com', role: 'Admin' },
    { id: '2', displayName: 'Jane Smith', email: 'jane.smith@example.com', role: 'Manager' },
    { id: '3', displayName: 'Bob Johnson', email: 'bob.johnson@example.com', role: 'User' },
  ];

  // Extract company submodules
  const companySubmodules = companiesModule.submodules.map(submodule => ({
    id: submodule.id,
    name: submodule.name
  }));

  // Handle permission update
  const handleUpdatePermission = (userId: string, moduleId: string, permissionType: 'canView' | 'canCreate' | 'canEdit' | 'canDelete', value: boolean) => {
    const userPerm = userPermissions.find(p => p.userId === userId);
    if (!userPerm) return;

    const updatedPermissions = userPermissions.map(up => {
      if (up.userId === userId) {
        return {
          ...up,
          permissions: up.permissions.map(p => {
            if (p.moduleId === moduleId) {
              return { ...p, [permissionType]: value };
            }
            return p;
          })
        };
      }
      return up;
    });

    // Update permissions in state
    console.log('Updated permissions:', updatedPermissions);
  };

  // Handle updating all permissions of a type for a user
  const handleSetAllPermissionsOfType = (userId: string, permissionType: 'canView' | 'canCreate' | 'canEdit' | 'canDelete', value: boolean) => {
    const userPerm = userPermissions.find(p => p.userId === userId);
    if (!userPerm) return;

    const updatedPermissions = userPermissions.map(up => {
      if (up.userId === userId) {
        return {
          ...up,
          permissions: up.permissions.map(p => {
            return { ...p, [permissionType]: value };
          })
        };
      }
      return up;
    });

    // Update permissions in state
    console.log('Updated all permissions of type:', updatedPermissions);
  };

  // Save permissions
  const handleSavePermissions = async () => {
    console.log('Saving permissions:', userPermissions);
    // Implement save logic
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Paramètres des entreprises</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" onValueChange={setCurrentTab} value={currentTab}>
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="general">Général</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="integrations">Intégrations</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <GeneralTab />
            </TabsContent>
            
            <TabsContent value="permissions">
              <PermissionsTab 
                users={users}
                userPermissions={userPermissions}
                companySubmodules={companySubmodules}
                loading={isLoading}
                saving={false}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                updatePermission={handleUpdatePermission}
                setAllPermissionsOfType={handleSetAllPermissionsOfType}
                savePermissions={handleSavePermissions}
              />
            </TabsContent>
            
            <TabsContent value="integrations">
              <IntegrationsTab />
            </TabsContent>
            
            <TabsContent value="notifications">
              <NotificationsTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompaniesSettings;
