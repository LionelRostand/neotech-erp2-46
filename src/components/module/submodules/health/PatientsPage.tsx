
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import PatientsTable from './components/PatientsTable';
import PatientForm from './components/PatientForm';

const PatientsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('list');
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestion des Patients</h2>
        <div className="flex gap-2">
          {activeTab === 'list' && (
            <Button 
              onClick={() => setActiveTab('new')}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Patient
            </Button>
          )}
          {activeTab === 'new' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setActiveTab('list')}
            >
              Retour à la liste
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:inline-flex">
          <TabsTrigger value="list">Liste des Patients</TabsTrigger>
          <TabsTrigger value="new">Nouveau Patient</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          <div className="flex items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un patient..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <PatientsTable searchQuery={searchQuery} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="new">
          <Card>
            <CardContent className="pt-6">
              <PatientForm onSuccess={() => setActiveTab('list')} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientsPage;
