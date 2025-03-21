import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Clock, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSalonServices } from '../hooks/useSalonServices';
import { SalonService } from '../../types/salon-types';

interface ServicesListProps {
  searchQuery: string;
}

const ServicesList: React.FC<ServicesListProps> = ({ searchQuery }) => {
  const { services, loading } = useSalonServices();
  const { toast } = useToast();

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
    }
    return `${mins}min`;
  };

  const handleEdit = (service: SalonService) => {
    toast({
      title: "Modification à venir",
      description: `La modification de ${service.name} sera disponible prochainement`
    });
  };

  const handleDelete = (service: SalonService) => {
    toast({
      title: "Suppression à venir",
      description: `La suppression de ${service.name} sera disponible prochainement`
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center p-8">
            <p className="text-muted-foreground">Chargement des services...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (filteredServices.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center p-8">
            <p className="text-muted-foreground">
              {searchQuery ? "Aucun service ne correspond à votre recherche" : "Aucun service disponible"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Durée</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Coiffeurs spécialisés</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">
                  <div>
                    <div>{service.name}</div>
                    <div className="text-sm text-muted-foreground">{service.description}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{service.category}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    {formatDuration(service.duration)}
                  </div>
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(service.price)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {service.specialists && service.specialists.map((specialist, idx) => (
                      <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                        <UserCheck className="h-3 w-3" />
                        {specialist}
                      </Badge>
                    ))}
                    {(!service.specialists || service.specialists.length === 0) && (
                      <span className="text-sm text-muted-foreground">Tous les coiffeurs</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(service)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(service)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ServicesList;
