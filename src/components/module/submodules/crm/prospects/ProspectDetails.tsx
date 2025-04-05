
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Mail, Phone, Calendar, FileText, Tag, Globe } from "lucide-react";
import { Prospect } from '../types/crm-types';

interface ProspectDetailsProps {
  prospect: Prospect;
}

const ProspectDetails: React.FC<ProspectDetailsProps> = ({ prospect }) => {
  // Helper function to get status badge color
  const getStatusBadgeColor = (status: string): string => {
    switch (status) {
      case 'new':
        return 'bg-blue-200 text-blue-800';
      case 'contacted':
        return 'bg-purple-200 text-purple-800';
      case 'qualified':
        return 'bg-green-200 text-green-800';
      case 'unqualified':
        return 'bg-red-200 text-red-800';
      case 'hot':
        return 'bg-orange-200 text-orange-800';
      case 'warm':
        return 'bg-amber-200 text-amber-800';
      case 'cold':
        return 'bg-slate-200 text-slate-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  // Helper function to get status label
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'new':
        return 'Nouveau';
      case 'contacted':
        return 'Contacté';
      case 'qualified':
        return 'Qualifié';
      case 'unqualified':
        return 'Non qualifié';
      case 'hot':
        return 'Chaud';
      case 'warm':
        return 'Tiède';
      case 'cold':
        return 'Froid';
      default:
        return status;
    }
  };

  // Format date for display
  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return "Non défini";
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{prospect.company}</CardTitle>
            <CardDescription>{prospect.contactName || prospect.name}</CardDescription>
          </div>
          <Badge className={getStatusBadgeColor(prospect.status)}>
            {getStatusLabel(prospect.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="details">
          <TabsList className="mb-4">
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Entreprise:</span>
                <span className="text-sm">{prospect.company}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Email:</span>
                <a href={`mailto:${prospect.contactEmail || prospect.email}`} className="text-sm text-blue-600 hover:underline">
                  {prospect.contactEmail || prospect.email}
                </a>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Téléphone:</span>
                <a href={`tel:${prospect.contactPhone || prospect.phone}`} className="text-sm text-blue-600 hover:underline">
                  {prospect.contactPhone || prospect.phone || 'Non défini'}
                </a>
              </div>
              
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Source:</span>
                <span className="text-sm">{prospect.source}</span>
              </div>
              
              {prospect.industry && (
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Secteur:</span>
                  <span className="text-sm">{prospect.industry}</span>
                </div>
              )}
              
              {prospect.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Site web:</span>
                  <a href={prospect.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                    {prospect.website}
                  </a>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Dernier contact:</span>
                <span className="text-sm">{formatDate(prospect.lastContact)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Date de création:</span>
                <span className="text-sm">{formatDate(prospect.createdAt)}</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notes">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-gray-500 mt-1" />
                <div>
                  <span className="text-sm font-medium">Notes:</span>
                  <p className="text-sm mt-1 whitespace-pre-line">
                    {prospect.notes || 'Aucune note disponible pour ce prospect.'}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProspectDetails;
