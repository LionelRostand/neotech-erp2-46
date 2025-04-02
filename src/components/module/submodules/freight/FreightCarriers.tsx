
import React, { useState, useEffect } from 'react';
import { Truck, Search, Plus, Star, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import StatCard from '@/components/StatCard';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useFreightData } from '@/hooks/modules/useFreightData';

const FreightCarriers: React.FC = () => {
  const { toast } = useToast();
  const [showNewCarrierDialog, setShowNewCarrierDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Use our new hook to fetch carriers from Firebase
  const { carriers: firebaseCarriers, isLoading } = useFreightData();
  
  // Local state to store carriers (allows for adding new ones via the UI)
  const [carriers, setCarriers] = useState<any[]>([]);

  // When firebaseCarriers data changes, update our local state
  useEffect(() => {
    if (firebaseCarriers && firebaseCarriers.length > 0) {
      setCarriers(firebaseCarriers);
    } else if (!isLoading) {
      // If there's no data from Firebase, use dummy data as fallback
      setCarriers([
        { id: '1', name: 'TransportExpress', contact: 'Jean Dupont', email: 'jean@transportexpress.com', phone: '+33 1 23 45 67 89', rating: 4.8, status: 'Actif' },
        { id: '2', name: 'RapidFret', contact: 'Marie Martin', email: 'marie@rapidfret.com', phone: '+33 1 98 76 54 32', rating: 4.5, status: 'Actif' },
        { id: '3', name: 'LogisTruck', contact: 'Pierre Durand', email: 'pierre@logistruck.com', phone: '+33 6 12 34 56 78', rating: 4.2, status: 'Inactif' },
        { id: '4', name: 'SpeedCargo', contact: 'Sophie Bernard', email: 'sophie@speedcargo.com', phone: '+33 7 65 43 21 09', rating: 4.9, status: 'Actif' },
        { id: '5', name: 'FreightMasters', contact: 'Lucas Petit', email: 'lucas@freightmasters.com', phone: '+33 6 98 76 54 32', rating: 3.9, status: 'Actif' },
      ]);
    }
  }, [firebaseCarriers, isLoading]);

  // Stats for the dashboard - could be calculated from real data
  const statsData = [
    {
      title: "Total transporteurs",
      value: carriers?.length.toString() || "0",
      icon: <Truck className="h-8 w-8 text-blue-500" />,
      description: "Transporteurs partenaires"
    },
    {
      title: "Actifs",
      value: carriers?.filter(c => c.status === 'Actif').length.toString() || "0",
      icon: <Truck className="h-8 w-8 text-green-500" />,
      description: "Transporteurs en service"
    },
    {
      title: "Note moyenne",
      value: calculateAverageRating().toFixed(1),
      icon: <Star className="h-8 w-8 text-amber-500" />,
      description: "Évaluation moyenne"
    },
    {
      title: "Contacts",
      value: carriers?.length.toString() || "0",
      icon: <Phone className="h-8 w-8 text-purple-500" />,
      description: "Personnes de contact"
    }
  ];

  // Calculate average rating
  function calculateAverageRating(): number {
    if (!carriers || carriers.length === 0) return 0;
    
    const total = carriers.reduce((sum, carrier) => sum + (carrier.rating || 0), 0);
    return total / carriers.length;
  }

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
  
  const handleShowDetails = (carrier: any) => {
    setSelectedCarrier(carrier);
    setShowDetailsDialog(true);
  };
  
  const handleAddCarrier = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get form data from the form elements
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    // Create new carrier object
    const newCarrier = {
      id: `new-${Date.now()}`,
      name: formData.get('name') as string,
      contact: formData.get('contact') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      rating: 5.0, // Default rating for new carriers
      status: 'Actif'
    };
    
    // Add the new carrier
    setCarriers([...carriers, newCarrier]);
    
    // Close dialog and show toast
    setShowNewCarrierDialog(false);
    toast({
      title: "Transporteur ajouté",
      description: `Le transporteur ${newCarrier.name} a été ajouté avec succès.`,
    });
  };
  
  // Filter carriers based on search term
  const filteredCarriers = carriers?.filter(carrier => 
    carrier.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    carrier.contact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    carrier.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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
          <Button onClick={() => setShowNewCarrierDialog(true)}>
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-2">Chargement des transporteurs...</p>
          </div>
        ) : (
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
              {filteredCarriers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Aucun transporteur trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredCarriers.map((carrier) => (
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
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleShowDetails(carrier)}
                      >
                        Détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
      
      {/* Dialog pour ajouter un nouveau transporteur */}
      <Dialog open={showNewCarrierDialog} onOpenChange={setShowNewCarrierDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nouveau transporteur</DialogTitle>
            <DialogDescription>
              Ajoutez un nouveau transporteur à votre liste de partenaires.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddCarrier}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nom
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Nom du transporteur"
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact" className="text-right">
                  Contact
                </Label>
                <Input
                  id="contact"
                  name="contact"
                  placeholder="Nom du contact principal"
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email du contact"
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Téléphone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Numéro de téléphone"
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="submit">Ajouter le transporteur</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Dialog pour afficher les détails d'un transporteur */}
      {selectedCarrier && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Truck className="mr-2 h-5 w-5" />
                {selectedCarrier.name}
              </DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <div className="mb-4">
                <Badge className={getStatusColor(selectedCarrier.status)}>
                  {selectedCarrier.status}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Contact</h3>
                  <p className="mt-1">{selectedCarrier.contact}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <a href={`mailto:${selectedCarrier.email}`} className="mt-1 text-blue-600 hover:underline">
                    {selectedCarrier.email}
                  </a>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Téléphone</h3>
                  <a href={`tel:${selectedCarrier.phone}`} className="mt-1 text-blue-600 hover:underline">
                    {selectedCarrier.phone}
                  </a>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Évaluation</h3>
                  <div className="mt-1 flex items-center">
                    {renderRating(selectedCarrier.rating)}
                    <span className="ml-2">{selectedCarrier.rating.toFixed(1)}/5</span>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex justify-between items-center">
              <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                Fermer
              </Button>
              <Button>Modifier</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default FreightCarriers;
