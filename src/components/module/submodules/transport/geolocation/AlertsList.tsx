
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Mock alert data - in a real application this would come from an API
const mockAlerts = [
  {
    id: 'alert1',
    vehicleId: 'v1',
    vehicleName: 'Mercedes S-Class',
    licensePlate: 'FR-785-AB',
    type: 'speed',
    message: 'Excès de vitesse',
    details: 'Vitesse détectée: 85 km/h dans une zone de 50 km/h',
    timestamp: new Date().toISOString(),
    location: { latitude: 48.8566, longitude: 2.3522 },
    severity: 'high',
    status: 'new'
  },
  {
    id: 'alert2',
    vehicleId: 'v2',
    vehicleName: 'Renault Trafic',
    licensePlate: 'FR-456-CD',
    type: 'zone',
    message: 'Entrée en zone non autorisée',
    details: 'Zone industrielle Nord',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
    location: { latitude: 48.8756, longitude: 2.3522 },
    severity: 'medium',
    status: 'acknowledged'
  },
  {
    id: 'alert3',
    vehicleId: 'v3',
    vehicleName: 'Volkswagen Transporter',
    licensePlate: 'FR-123-EF',
    type: 'idle',
    message: 'Véhicule à l\'arrêt prolongé',
    details: 'Inactivité de plus de 45 minutes',
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(), // 1 hour ago
    location: { latitude: 48.8566, longitude: 2.3722 },
    severity: 'low',
    status: 'resolved'
  }
];

const AlertsList: React.FC = () => {
  const formatTime = (timestamp: string) => {
    return format(new Date(timestamp), 'HH:mm', { locale: fr });
  };

  const formatDate = (timestamp: string) => {
    return format(new Date(timestamp), 'PP', { locale: fr });
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge className="bg-red-500">Haute</Badge>;
      case 'medium':
        return <Badge className="bg-orange-500">Moyenne</Badge>;
      case 'low':
        return <Badge className="bg-yellow-500">Basse</Badge>;
      default:
        return <Badge>Inconnue</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="destructive">Nouvelle</Badge>;
      case 'acknowledged':
        return <Badge variant="secondary">Reconnue</Badge>;
      case 'resolved':
        return <Badge variant="outline">Résolue</Badge>;
      default:
        return <Badge>Inconnue</Badge>;
    }
  };

  return (
    <div className="space-y-4 h-[400px] overflow-y-auto pr-2">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Alertes récentes</h3>
        <Badge variant="outline">{mockAlerts.length}</Badge>
      </div>

      {mockAlerts.length === 0 ? (
        <Card>
          <CardContent className="py-4 text-center text-muted-foreground">
            Aucune alerte récente.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {mockAlerts.map(alert => (
            <Card key={alert.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h4 className="font-medium truncate">{alert.message}</h4>
                      <div className="flex items-center gap-1">
                        {getSeverityBadge(alert.severity)}
                        {getStatusBadge(alert.status)}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-1">{alert.details}</p>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatTime(alert.timestamp)} - {formatDate(alert.timestamp)}</span>
                      </div>
                      
                      <div className="hidden sm:block">•</div>
                      
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>
                          {alert.location.latitude.toFixed(4)}, {alert.location.longitude.toFixed(4)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-sm">
                      <span className="font-medium">{alert.vehicleName}</span> 
                      <span className="text-muted-foreground"> ({alert.licensePlate})</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertsList;
