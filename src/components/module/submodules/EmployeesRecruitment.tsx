
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Filter, BarChart2 } from 'lucide-react';
import { toast } from 'sonner';
import RecruitmentStats from './employees/RecruitmentStats';

const EmployeesRecruitment: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('jobs');

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Recrutement</h2>
          <p className="text-gray-500">Gérez vos offres d'emploi et suivez les candidatures</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle offre d'emploi
        </Button>
      </div>

      <RecruitmentStats 
        openPositions={12}
        applicationsThisMonth={48}
        interviewsScheduled={15}
        applicationsChange={12}
        isLoading={isLoading}
      />

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4 w-full max-w-md">
          <TabsTrigger value="jobs">Offres d'emploi</TabsTrigger>
          <TabsTrigger value="candidates">Candidats</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
        </TabsList>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input placeholder="Rechercher..." className="pl-8" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  Filtres
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <BarChart2 className="h-3.5 w-3.5" />
                  Rapports
                </Button>
              </div>
            </div>
            
            <TabsContent value="jobs" className="m-0">
              <div className="text-center p-10 text-gray-500">
                Module en cours de développement...
              </div>
            </TabsContent>
            
            <TabsContent value="candidates" className="m-0">
              <div className="text-center p-10 text-gray-500">
                Liste des candidats en cours de développement...
              </div>
            </TabsContent>
            
            <TabsContent value="pipeline" className="m-0">
              <div className="text-center p-10 text-gray-500">
                Pipeline de recrutement en cours de développement...
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default EmployeesRecruitment;
