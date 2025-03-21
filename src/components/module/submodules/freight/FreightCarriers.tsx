
import React from 'react';
import { Truck, Search, Plus, Star, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import StatCard from '@/components/StatCard';

const FreightCarriers: React.FC = () => {
  // Sample data for carriers
  const carriers = [
    { id: 1, name: 'TransportExpress', contact: 'Jean Dupont', email: 'jean@transportexpress.com', phone: '+33 1 23 45 67 89', rating: 4.8, status: 'Actif' },
    { id: 2, name: 'RapidFret', contact: 'Marie Martin', email: 'marie@rapidfret.com', phone: '+33 1 98 76 54 32', rating: 4.5, status: 'Actif' },
    { id: 3, name: 'LogisTruck', contact: 'Pierre Durand', email: 'pierre@logistruck.com', phone: '+33 6 12 34 56 78', rating: 4.2, status: 'Inactif' },
    { id: 4, name: 'SpeedCargo', contact: 'Sophie Bernard', email: 'sophie@speedcargo.com', phone: '+33 7 65 43 21 09', rating: 4.9, status: 'Actif' },
    { id: 5, name: 'FreightMasters', contact: 'Lucas Petit', email: 'lucas@freightmasters.com', phone: '+33 6 98 76 54 32', rating: 3.9, status: 'Actif' },
  ];

  // Stats for the dashboard
  const statsData = [
    {
      title: "Total transporteurs",
      value: "42",
      icon: <Truck className="h-8 w-8 text-blue-500" />,
      description: "Transporteurs partenaires"
    },
    {
      title: "Actifs",
      value: "35",
      icon: <Truck className="h-8 w-8 text-green-500" />,
      description: "Transporteurs en service"
    },
    {
      title: "Note moyenne",
      value: "4.6",
      icon: <Star className="h-8 w-8 text-amber-500" />,
      description: "Évaluation moyenne"
    },
    {
      title: "Contacts",
      value: "58",
      icon: <Phone className="h-8 w-8 text-purple-500" />,
      description: "Personnes de contact"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actif':
        return 'bg-green-100 text-green-800';
      case 'Inactif':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-amber-400 text-amber-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-amber-400 text-amber-400" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }

    return <div className="flex">{stars}</div>;
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
          <h2 className="text-xl font-bold">Transporteurs Partenaires</h2>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Transporteur
          </Button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Rechercher un transporteur..."
            className="pl-8"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Évaluation</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {carriers.map((carrier) => (
              <TableRow key={carrier.id}>
                <TableCell className="font-medium">{carrier.name}</TableCell>
                <TableCell>{carrier.contact}</TableCell>
                <TableCell>
                  <a href={`mailto:${carrier.email}`} className="flex items-center text-blue-600 hover:underline">
                    <Mail className="h-4 w-4 mr-1" />
                    {carrier.email}
                  </a>
                </TableCell>
                <TableCell>
                  <a href={`tel:${carrier.phone}`} className="flex items-center text-blue-600 hover:underline">
                    <Phone className="h-4 w-4 mr-1" />
                    {carrier.phone}
                  </a>
                </TableCell>
                <TableCell>{renderRating(carrier.rating)}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(carrier.status)}>
                    {carrier.status}
                  </Badge>
                </TableCell>
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

export default FreightCarriers;
