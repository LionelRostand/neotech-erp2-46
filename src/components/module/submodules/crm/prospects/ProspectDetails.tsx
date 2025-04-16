
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/formatters";
import { Phone, Mail, UserCircle, Building, Calendar, FileText } from "lucide-react";
import { Prospect } from '../types/crm-types';

interface ProspectDetailsProps {
  prospect: Prospect;
  onClose: () => void;
}

const ProspectDetails: React.FC<ProspectDetailsProps> = ({ prospect, onClose }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-1 md:col-span-2">
          <CardContent className="pt-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <UserCircle className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Contact:</span>
                <span>{prospect.contactName}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Téléphone:</span>
                <span>{prospect.contactPhone}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Email:</span>
                <span>{prospect.contactEmail}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Building className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Société:</span>
                <span>{prospect.company}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Dernier contact:</span>
                <span>{formatDate(prospect.lastContact)}</span>
              </div>
              
              <div className="flex items-start space-x-2">
                <FileText className="h-5 w-5 text-gray-500 mt-1" />
                <span className="font-medium">Notes:</span>
                <div className="flex-1">
                  <p className="whitespace-pre-wrap">{prospect.notes || "Aucune note"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="activities">Activités</TabsTrigger>
          <TabsTrigger value="tasks">Tâches</TabsTrigger>
          <TabsTrigger value="files">Fichiers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <p>Informations générales sur le prospect.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <p>Notes liées à ce prospect.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activities" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <p>Activités liées à ce prospect.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tasks" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <p>Tâches liées à ce prospect.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="files" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <p>Fichiers liés à ce prospect.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProspectDetails;
