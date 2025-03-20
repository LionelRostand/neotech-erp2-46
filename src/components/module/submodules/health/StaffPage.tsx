
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Filter, Calendar, Shield, Clock } from "lucide-react";
import StaffList from './components/staff/StaffList';
import PermissionsManager from './components/staff/PermissionsManager';
import StaffSchedules from './components/staff/StaffSchedules';
import StaffLeaves from './components/staff/StaffLeaves';

const StaffPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('list');

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion du Personnel</h2>
          <p className="text-gray-500">Gérez le personnel médical et administratif</p>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Ajouter un membre
          </Button>
        </div>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Rechercher un membre du personnel..."
          className="pl-8 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="list">Personnel</TabsTrigger>
          <TabsTrigger value="permissions">Rôles</TabsTrigger>
          <TabsTrigger value="schedules">Plannings</TabsTrigger>
          <TabsTrigger value="leaves">Absences</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardContent className="p-6">
              <StaffList searchQuery={searchQuery} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-500" />
                Gestion des rôles et permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PermissionsManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedules">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                Plannings du personnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StaffSchedules />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaves">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-500" />
                Gestion des absences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StaffLeaves />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffPage;
