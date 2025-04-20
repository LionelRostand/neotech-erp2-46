
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import ApplicationPermissionsTab from './ApplicationPermissionsTab';
import DashboardLayout from '@/components/DashboardLayout';

const UserPermissions = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Droits utilisateurs</CardTitle>
            </div>
            <CardDescription>
              Gérez les droits d'accès des utilisateurs aux différentes fonctionnalités
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="applications" className="w-full">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="applications" className="flex-1">
                  Gestion des applications
                </TabsTrigger>
                <TabsTrigger value="modules" className="flex-1">
                  Modules
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="applications">
                <ApplicationPermissionsTab />
              </TabsContent>
              
              <TabsContent value="modules">
                <div className="p-4 text-center text-muted-foreground">
                  Configuration des droits d'accès aux modules à venir
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UserPermissions;
