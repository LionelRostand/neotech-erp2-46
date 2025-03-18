
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ConsultationsList from './ConsultationsList';
import NewConsultationForm from './NewConsultationForm';
import ConsultationSearch from './ConsultationSearch';

const ConsultationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('list');
  const [searchVisible, setSearchVisible] = useState<boolean>(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestion des Consultations</h2>
        <div className="flex gap-2">
          {activeTab === 'list' && (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSearchVisible(!searchVisible)}
              >
                <Search className="h-4 w-4 mr-2" />
                Rechercher
              </Button>
              <Button 
                variant="outline" 
                size="sm"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtrer
              </Button>
              <Button 
                onClick={() => setActiveTab('new')}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Consultation
              </Button>
            </>
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

      {searchVisible && activeTab === 'list' && (
        <ConsultationSearch />
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="hidden">
          <TabsTrigger value="list">Liste des Consultations</TabsTrigger>
          <TabsTrigger value="new">Nouvelle Consultation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <Card>
            <CardContent className="pt-6">
              <ConsultationsList />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="new">
          <Card>
            <CardContent className="pt-6">
              <NewConsultationForm onSuccess={() => setActiveTab('list')} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConsultationsPage;
