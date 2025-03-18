
import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import PasswordSettings from "@/components/profile/PasswordSettings";
import PersonalInfo from "@/components/profile/PersonalInfo";
import LanguageSettings from "@/components/profile/LanguageSettings";
import TwoFactorAuth from "@/components/profile/TwoFactorAuth";
import { User, Key, Languages, Shield } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const UserProfile = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');

  // Map URL parameter to tab value
  const getTabValue = () => {
    switch(tabParam) {
      case 'password':
        return 'password';
      case 'language':
        return 'language';
      case '2fa':
        return '2fa';
      default:
        return 'personal-info';
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Paramètres du profil</h1>
        
        <Tabs defaultValue={getTabValue()} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <TabsTrigger value="personal-info" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Informations</span>
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              <span>Mot de passe</span>
            </TabsTrigger>
            <TabsTrigger value="language" className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              <span>Langue</span>
            </TabsTrigger>
            <TabsTrigger value="2fa" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Authentification</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal-info">
            <PersonalInfo />
          </TabsContent>
          
          <TabsContent value="password">
            <PasswordSettings />
          </TabsContent>
          
          <TabsContent value="language">
            <LanguageSettings />
          </TabsContent>
          
          <TabsContent value="2fa">
            <TwoFactorAuth />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;
