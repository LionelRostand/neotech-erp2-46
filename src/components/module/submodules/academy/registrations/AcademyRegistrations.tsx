
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, FileText, ClipboardCheck } from 'lucide-react';
import RegistrationForm from './RegistrationForm';
import DocumentUpload from './DocumentUpload';
import RegistrationsList from './RegistrationsList';

const AcademyRegistrations = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Gestion des Inscriptions</h1>
        </div>
        
        <Tabs defaultValue="nouvelle" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="nouvelle" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span>Nouvelle inscription</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Documents requis</span>
            </TabsTrigger>
            <TabsTrigger value="liste" className="flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4" />
              <span>Liste des inscriptions</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="nouvelle" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Nouvelle inscription administrative</CardTitle>
                <CardDescription>
                  Utilisez ce formulaire pour inscrire un nouvel élève dans l'établissement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RegistrationForm />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Documents requis pour l'inscription</CardTitle>
                <CardDescription>
                  Téléchargez les documents administratifs nécessaires pour compléter l'inscription
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DocumentUpload />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="liste" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Liste des inscriptions</CardTitle>
                <CardDescription>
                  Consultez et gérez les inscriptions existantes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RegistrationsList />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AcademyRegistrations;
