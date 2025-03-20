
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Edit, Trash2, Users, MapPin } from 'lucide-react';
import { AccessPoint } from './types';

interface AccessPointCardProps {
  point: AccessPoint;
}

const AccessPointCard: React.FC<AccessPointCardProps> = ({ point }) => {
  return (
    <Card key={point.id} className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{point.name}</CardTitle>
          <Badge variant={point.isActive ? "default" : "secondary"}>
            {point.isActive ? "Actif" : "Inactif"}
          </Badge>
        </div>
        <CardDescription className="flex items-center mt-1">
          <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          {point.address}
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {point.employeesCount} employé{point.employeesCount > 1 ? 's' : ''}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 bg-slate-50 pt-2">
        <Button size="sm" variant="ghost">
          <Edit className="h-4 w-4 mr-1" />
          Modifier
        </Button>
        <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
          <Trash2 className="h-4 w-4 mr-1" />
          Supprimer
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AccessPointCard;
