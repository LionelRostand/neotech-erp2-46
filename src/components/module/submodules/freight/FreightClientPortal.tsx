
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Settings, Package, FileText, Ship, Truck } from 'lucide-react';

const FreightClientPortal: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Portail Client
          </CardTitle>
          <CardDescription>
            Interface d'accès client aux expéditions et services de fret
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-12 text-center">
            <div className="max-w-md">
              <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Portail en développement</h3>
              <p className="text-muted-foreground">
                Le portail client pour la gestion des expéditions est en cours de développement. 
                Cette fonctionnalité permettra à vos clients de suivre leurs expéditions, 
                consulter leurs factures et gérer leurs préférences.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Suivi d'expédition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Permettez à vos clients de suivre leurs expéditions en temps réel avec des mises à jour automatiques.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documents et factures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Accès aux factures, connaissements et documents douaniers pour chaque expédition.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ship className="h-5 w-5" />
              Demandes de devis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Interface simple pour demander des devis pour de nouvelles expéditions internationales.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FreightClientPortal;
