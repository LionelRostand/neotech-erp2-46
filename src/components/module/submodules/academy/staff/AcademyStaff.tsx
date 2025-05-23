import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, GraduationCap, FileText, ClipboardCheck, File } from 'lucide-react';
import RecruitmentTab from './RecruitmentTab';
import DegreeManagementTab from './DegreeManagementTab';

const AcademyStaff = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion du Personnel</CardTitle>
          <CardDescription>
            Gestion du personnel enseignant et administratif de l'établissement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="recrutements" className="w-full">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="recrutements" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                <span>Recrutements</span>
              </TabsTrigger>
              <TabsTrigger value="diplomes" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                <span>Diplômes</span>
              </TabsTrigger>
              <TabsTrigger value="contrats" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Contrats</span>
              </TabsTrigger>
              <TabsTrigger value="evaluations" className="flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4" />
                <span>Évaluations</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <File className="h-4 w-4" />
                <span>Documents</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recrutements" className="mt-6">
              <RecruitmentTab />
            </TabsContent>

            <TabsContent value="diplomes" className="mt-6">
              <DegreeManagementTab />
            </TabsContent>

            <TabsContent value="contrats" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contrats</CardTitle>
                  <CardDescription>Gestion des contrats du personnel</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Module de gestion des contrats en cours de développement...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="evaluations" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Évaluations</CardTitle>
                  <CardDescription>Suivi des évaluations du personnel</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Module d'évaluation en cours de développement...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>Gestion documentaire du personnel</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Module de gestion documentaire en cours de développement...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcademyStaff;
