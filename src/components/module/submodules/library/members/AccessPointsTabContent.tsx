
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PlusCircle, Edit, Trash2, Users, MapPin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface AccessPoint {
  id: string;
  name: string;
  address: string;
  employeesCount: number;
  isActive: boolean;
}

const mockAccessPoints: AccessPoint[] = [
  { id: "ap1", name: "Bibliothèque Centrale", address: "15 Rue de la République, 75001 Paris", employeesCount: 8, isActive: true },
  { id: "ap2", name: "Annexe Nord", address: "42 Avenue des Fleurs, 75018 Paris", employeesCount: 3, isActive: true },
  { id: "ap3", name: "Point Numérique", address: "7 Place de l'Innovation, 75004 Paris", employeesCount: 2, isActive: false },
];

const AccessPointsTabContent: React.FC = () => {
  const [accessPoints, setAccessPoints] = useState<AccessPoint[]>(mockAccessPoints);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAccessPoints = accessPoints.filter(ap => 
    ap.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    ap.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Input
            placeholder="Rechercher un point d'accès..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <MapPin size={16} />
          </div>
        </div>
        <Button className="w-full md:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter un point d'accès
        </Button>
      </div>

      {filteredAccessPoints.length === 0 ? (
        <div className="bg-slate-50 border rounded-md p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">Aucun point d'accès trouvé</h3>
          <p className="text-slate-600 mb-4">
            Essayez de modifier votre recherche ou ajoutez un nouveau point d'accès.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAccessPoints.map((point) => (
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
          ))}
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-md text-amber-800">
        <p className="text-sm">
          ⚠️ Cette fonctionnalité est en cours de développement. Les modifications ne sont pas enregistrées.
        </p>
        <p className="text-sm mt-1">
          Prochaines étapes : ajout des formulaires de création/modification et gestion des employés associés.
        </p>
      </div>
    </div>
  );
};

export default AccessPointsTabContent;
