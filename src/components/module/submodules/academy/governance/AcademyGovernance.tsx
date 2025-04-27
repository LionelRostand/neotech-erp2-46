
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BadgeCheck, 
  Users, 
  GraduationCap, 
  CalendarCheck,
  BookOpen
} from 'lucide-react';
import DirectionComponent from './DirectionComponent';
import AdminCouncilComponent from './AdminCouncilComponent';
import PedagogicalCommittee from './PedagogicalCommittee';

const AcademyGovernance = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">Gouvernance de l'Établissement</h1>
        </div>
        
        <Tabs defaultValue="direction" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="direction" className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4" />
              <span>Direction</span>
            </TabsTrigger>
            <TabsTrigger value="admin-council" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Conseil d'Administration</span>
            </TabsTrigger>
            <TabsTrigger value="pedagogical" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span>Comité Pédagogique</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="direction" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Direction de l'Établissement</CardTitle>
                <CardDescription>
                  Responsables de la gestion administrative, pédagogique, financière et matérielle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DirectionComponent />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="admin-council" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Conseil d'Administration</CardTitle>
                <CardDescription>
                  Définition des orientations stratégiques et supervision de la conformité réglementaire
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminCouncilComponent />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pedagogical" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Comité Pédagogique</CardTitle>
                <CardDescription>
                  Organisation et supervision des programmes et évaluations pédagogiques
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PedagogicalCommittee />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AcademyGovernance;
