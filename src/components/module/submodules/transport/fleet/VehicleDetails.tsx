
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, CarFront, FileCheck, Wrench, Users, Info, Edit, AlertTriangle } from "lucide-react";
import { TransportVehicle } from '../types/transport-types';

interface VehicleDetailsProps {
  vehicle: TransportVehicle;
}

const VehicleDetails: React.FC<VehicleDetailsProps> = ({ vehicle }) => {
  // Format date from YYYY-MM-DD to local date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Non spécifié';
    return new Date(dateStr).toLocaleDateString('fr-FR', { dateStyle: 'long' });
  };
  
  // Get badge for vehicle status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Actif</Badge>;
      case 'maintenance':
        return <Badge className="bg-orange-500">Maintenance</Badge>;
      case 'out-of-service':
        return <Badge className="bg-red-500">Hors service</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };
  
  // Format vehicle type for display
  const formatVehicleType = (type: string) => {
    switch (type) {
      case 'sedan': return 'Berline';
      case 'suv': return 'SUV';
      case 'van': return 'Van';
      case 'luxury': return 'Luxe';
      case 'bus': return 'Bus';
      case 'minibus': return 'Minibus';
      default: return type;
    }
  };
  
  // Get days until insurance expiry
  const getDaysUntilInsuranceExpiry = () => {
    if (!vehicle.insuranceInfo?.expiryDate) return null;
    
    const expiryDate = new Date(vehicle.insuranceInfo.expiryDate);
    const today = new Date();
    
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  const insuranceDaysLeft = getDaysUntilInsuranceExpiry();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold">{vehicle.name}</h3>
          <p className="text-muted-foreground">{vehicle.licensePlate}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Edit size={16} />
            <span>Modifier</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1 text-red-600">
            <AlertTriangle size={16} />
            <span>Signaler un problème</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Info size={16} />
              <span>Informations générales</span>
            </h4>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium">{formatVehicleType(vehicle.type)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Capacité:</span>
                <span className="font-medium">{vehicle.capacity} places</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Statut:</span>
                {getStatusBadge(vehicle.status)}
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Kilométrage:</span>
                <span className="font-medium">{vehicle.mileage ? `${vehicle.mileage} km` : 'Non spécifié'}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date d'achat:</span>
                <span className="font-medium">{formatDate(vehicle.purchaseDate)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Wrench size={16} />
              <span>Maintenance</span>
            </h4>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dernier entretien:</span>
                <span className="font-medium">{formatDate(vehicle.lastServiceDate)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Prochain entretien:</span>
                <span className="font-medium">{formatDate(vehicle.nextServiceDate)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Assurance:</span>
                <div className="text-right">
                  <div className="font-medium">{vehicle.insuranceInfo?.provider || 'Non spécifié'}</div>
                  <div className="text-sm">{vehicle.insuranceInfo?.policyNumber || 'Non spécifié'}</div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expiration assurance:</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{formatDate(vehicle.insuranceInfo?.expiryDate)}</span>
                  {insuranceDaysLeft !== null && (
                    insuranceDaysLeft <= 30 ? (
                      <Badge className={insuranceDaysLeft <= 15 ? "bg-red-500" : "bg-yellow-500"}>
                        {insuranceDaysLeft} jours
                      </Badge>
                    ) : null
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Calendar size={16} />
            <span>Disponibilité</span>
          </h4>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Statut actuel:</span>
              <span className="font-medium">
                {vehicle.available ? 'Disponible' : 'Indisponible'}
              </span>
            </div>
            
            {!vehicle.available && (
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-600">
                  Ce véhicule est actuellement indisponible car il est 
                  {vehicle.status === 'maintenance' ? ' en maintenance.' : vehicle.status === 'out-of-service' ? ' hors service.' : ' réservé.'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleDetails;
