
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, FileText, Edit, Plus } from "lucide-react";
import { IncidentRecord } from '../types/transport-types';

interface IncidentsListProps {
  incidents: IncidentRecord[];
  vehicleName: string;
}

const IncidentsList: React.FC<IncidentsListProps> = ({
  incidents,
  vehicleName
}) => {
  // Format date from YYYY-MM-DD to local date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', { dateStyle: 'long' });
  };
  
  // Get badge based on severity
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'minor':
        return <Badge className="bg-yellow-500">Mineur</Badge>;
      case 'moderate':
        return <Badge className="bg-orange-500">Modéré</Badge>;
      case 'major':
        return <Badge className="bg-red-500">Majeur</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Incidents</h3>
        <Button size="sm" className="flex items-center gap-2">
          <Plus size={16} />
          <span>Signaler un incident</span>
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Sévérité</TableHead>
              <TableHead>Chauffeur</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Coût (€)</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incidents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  Aucun incident signalé pour {vehicleName}
                </TableCell>
              </TableRow>
            ) : (
              incidents.map((incident) => (
                <TableRow key={incident.id}>
                  <TableCell>{formatDate(incident.date)}</TableCell>
                  <TableCell>{incident.description}</TableCell>
                  <TableCell>{getSeverityBadge(incident.severity)}</TableCell>
                  <TableCell>{incident.driverName || '-'}</TableCell>
                  <TableCell>{incident.clientName || '-'}</TableCell>
                  <TableCell>{incident.repairCost ? `${incident.repairCost} €` : '-'}</TableCell>
                  <TableCell>
                    {incident.resolved ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                        Résolu
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                        En cours
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <FileText className="h-4 w-4" />
                        <span className="sr-only">Voir les détails</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Modifier</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default IncidentsList;
