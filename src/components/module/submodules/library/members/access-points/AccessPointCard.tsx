
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Edit, Trash2 } from "lucide-react";
import { AccessPoint } from './types';

interface AccessPointCardProps {
  accessPoint: AccessPoint;
}

const AccessPointCard: React.FC<AccessPointCardProps> = ({ accessPoint }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{accessPoint.name}</CardTitle>
          {accessPoint.isActive ? (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Actif</Badge>
          ) : (
            <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Inactif</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <span>{accessPoint.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{accessPoint.employeesCount} employés</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-end gap-2">
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-1" /> Modifier
        </Button>
        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
          <Trash2 className="h-4 w-4 mr-1" /> Supprimer
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AccessPointCard;
