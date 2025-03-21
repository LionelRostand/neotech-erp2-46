
import React from 'react';
import { Package, Search, Plus, Filter, SortDesc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import StatCard from '@/components/StatCard';

const FreightContainers: React.FC = () => {
  // Sample data for containers
  const containers = [
    { id: 'CONT-1001', type: '40HC', location: 'Port de Marseille', status: 'Disponible', lastUsed: '2023-10-01' },
    { id: 'CONT-1002', type: '20GP', location: 'Terminal Le Havre', status: 'En transit', lastUsed: '2023-10-05' },
    { id: 'CONT-1003', type: '45HC', location: 'Entrepôt Paris', status: 'En maintenance', lastUsed: '2023-09-20' },
    { id: 'CONT-1004', type: '40GP', location: 'Port de Marseille', status: 'Réservé', lastUsed: '2023-10-08' },
    { id: 'CONT-1005', type: '20GP', location: 'Terminal Le Havre', status: 'Disponible', lastUsed: '2023-09-28' },
  ];

  // Stats for the dashboard
  const statsData = [
    {
      title: "Total conteneurs",
      value: "125",
      icon: <Package className="h-8 w-8 text-blue-500" />,
      description: "Flotte totale de conteneurs"
    },
    {
      title: "Disponibles",
      value: "68",
      icon: <Package className="h-8 w-8 text-green-500" />,
      description: "Conteneurs disponibles"
    },
    {
      title: "En transit",
      value: "42",
      icon: <Package className="h-8 w-8 text-amber-500" />,
      description: "Conteneurs en mouvement"
    },
    {
      title: "Maintenance",
      value: "15",
      icon: <Package className="h-8 w-8 text-red-500" />,
      description: "Conteneurs en réparation"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponible':
        return 'bg-green-100 text-green-800';
      case 'En transit':
        return 'bg-amber-100 text-amber-800';
      case 'En maintenance':
        return 'bg-red-100 text-red-800';
      case 'Réservé':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.description}
          />
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Gestion des Conteneurs</h2>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Conteneur
          </Button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filtrer
            </Button>
            <Button variant="outline" size="sm">
              <SortDesc className="mr-2 h-4 w-4" />
              Trier
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Rechercher un conteneur..."
              className="pl-8 w-[250px]"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Emplacement</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Dernière utilisation</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {containers.map((container) => (
              <TableRow key={container.id}>
                <TableCell className="font-medium">{container.id}</TableCell>
                <TableCell>{container.type}</TableCell>
                <TableCell>{container.location}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(container.status)}>
                    {container.status}
                  </Badge>
                </TableCell>
                <TableCell>{container.lastUsed}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">Détails</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FreightContainers;
