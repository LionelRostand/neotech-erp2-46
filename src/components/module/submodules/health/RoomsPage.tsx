
import React, { useState } from 'react';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  BedDouble, 
  PlusCircle, 
  Search, 
  Filter,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  Users
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Types pour les chambres
interface Room {
  id: string;
  number: string;
  type: 'private' | 'shared' | 'intensive';
  beds: number;
  occupiedBeds: number;
  floor: string;
  wing: string;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  equipment?: string[];
  notes?: string;
  price?: number;
}

// Données de démonstration
const mockRooms: Room[] = [
  {
    id: 'RM-001',
    number: '101',
    type: 'private',
    beds: 1,
    occupiedBeds: 0,
    floor: '1',
    wing: 'A',
    status: 'available',
    equipment: ['Télévision', 'Salle de bain privée', 'Wifi'],
    price: 150
  },
  {
    id: 'RM-002',
    number: '102',
    type: 'private',
    beds: 1,
    occupiedBeds: 1,
    floor: '1',
    wing: 'A',
    status: 'occupied',
    equipment: ['Télévision', 'Salle de bain privée', 'Wifi'],
    price: 150
  },
  {
    id: 'RM-003',
    number: '201',
    type: 'shared',
    beds: 2,
    occupiedBeds: 1,
    floor: '2',
    wing: 'B',
    status: 'occupied',
    equipment: ['Télévision commune', 'Salle de bain partagée'],
    price: 90
  },
  {
    id: 'RM-004',
    number: '202',
    type: 'shared',
    beds: 2,
    occupiedBeds: 2,
    floor: '2',
    wing: 'B',
    status: 'occupied',
    equipment: ['Télévision commune', 'Salle de bain partagée'],
    price: 90
  },
  {
    id: 'RM-005',
    number: '301',
    type: 'intensive',
    beds: 1,
    occupiedBeds: 1,
    floor: '3',
    wing: 'C',
    status: 'occupied',
    equipment: ['Moniteur cardiaque', 'Assistance respiratoire', 'Système d\'appel d\'urgence'],
    price: 250
  },
  {
    id: 'RM-006',
    number: '103',
    type: 'private',
    beds: 1,
    occupiedBeds: 0,
    floor: '1',
    wing: 'A',
    status: 'maintenance',
    equipment: ['Télévision', 'Salle de bain privée', 'Wifi'],
    notes: 'Réparation du système électrique',
    price: 150
  },
  {
    id: 'RM-007',
    number: '302',
    type: 'intensive',
    beds: 1,
    occupiedBeds: 0,
    floor: '3',
    wing: 'C',
    status: 'cleaning',
    equipment: ['Moniteur cardiaque', 'Assistance respiratoire', 'Système d\'appel d\'urgence'],
    price: 250
  }
];

const RoomsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [newRoom, setNewRoom] = useState<Partial<Room>>({
    number: '',
    type: 'private',
    beds: 1,
    occupiedBeds: 0,
    floor: '',
    wing: '',
    status: 'available',
    equipment: [],
    notes: '',
    price: 0
  });
  
  const { toast } = useToast();

  const filteredRooms = rooms.filter(room => {
    // Filtrer par terme de recherche
    const matchesSearchTerm = 
      room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.floor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.wing.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrer par type de chambre si un filtre est sélectionné
    const matchesType = filterType ? room.type === filterType : true;
    
    return matchesSearchTerm && matchesType;
  });

  // Statistiques des chambres
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter(r => r.status === 'available').length;
  const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
  const unavailableRooms = rooms.filter(r => r.status === 'maintenance' || r.status === 'cleaning').length;
  
  // Calcul du taux d'occupation
  const totalBeds = rooms.reduce((sum, room) => sum + room.beds, 0);
  const occupiedBeds = rooms.reduce((sum, room) => sum + room.occupiedBeds, 0);
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  const handleCreateRoom = () => {
    if (!newRoom.number || !newRoom.floor || !newRoom.wing) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    // Vérifier si le numéro de chambre existe déjà
    if (rooms.some(room => room.number === newRoom.number)) {
      toast({
        title: "Erreur de validation",
        description: "Ce numéro de chambre existe déjà.",
        variant: "destructive"
      });
      return;
    }

    const newId = `RM-${String(rooms.length + 1).padStart(3, '0')}`;
    
    const roomRecord: Room = {
      id: newId,
      number: newRoom.number!,
      type: newRoom.type as 'private' | 'shared' | 'intensive',
      beds: newRoom.beds || 1,
      occupiedBeds: 0,
      floor: newRoom.floor!,
      wing: newRoom.wing!,
      status: 'available',
      equipment: newRoom.equipment || [],
      notes: newRoom.notes,
      price: newRoom.price || 0
    };
    
    setRooms([...rooms, roomRecord]);
    setIsCreatingRoom(false);
    setNewRoom({
      number: '',
      type: 'private',
      beds: 1,
      occupiedBeds: 0,
      floor: '',
      wing: '',
      status: 'available',
      equipment: [],
      notes: '',
      price: 0
    });

    toast({
      title: "Chambre créée",
      description: `La chambre ${newRoom.number} a été ajoutée avec succès.`
    });
  };

  const handleStatusChange = (id: string, newStatus: Room['status']) => {
    setRooms(rooms.map(room => 
      room.id === id ? { ...room, status: newStatus } : room
    ));

    toast({
      title: "Statut mis à jour",
      description: `Le statut de la chambre a été modifié avec succès.`
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'private': return 'bg-blue-100 text-blue-800';
      case 'shared': return 'bg-green-100 text-green-800';
      case 'intensive': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'private': return 'Privée';
      case 'shared': return 'Commune';
      case 'intensive': return 'Soins intensifs';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'occupied': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      case 'cleaning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'occupied': return 'Occupée';
      case 'maintenance': return 'Maintenance';
      case 'cleaning': return 'Nettoyage';
      default: return status;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Chambres</h2>
        <Button 
          onClick={() => setIsCreatingRoom(!isCreatingRoom)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Nouvelle chambre
        </Button>
      </div>

      {/* Statistiques des chambres */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total chambres</p>
                <p className="text-2xl font-bold">{totalRooms}</p>
              </div>
              <BedDouble className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Disponibles</p>
                <p className="text-2xl font-bold">{availableRooms}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Occupées</p>
                <p className="text-2xl font-bold">{occupiedRooms}</p>
              </div>
              <Users className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Indisponibles</p>
                <p className="text-2xl font-bold">{unavailableRooms}</p>
              </div>
              <XCircle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taux d'occupation</p>
                <p className="text-2xl font-bold">{occupancyRate}%</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                background: `conic-gradient(#4f46e5 ${occupancyRate}%, #e5e7eb ${occupancyRate}%)`
              }}>
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-xs font-medium">
                  {occupancyRate}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {isCreatingRoom && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Ajouter une nouvelle chambre</CardTitle>
            <CardDescription>Renseignez les informations de la nouvelle chambre</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="number">Numéro de chambre</Label>
                <Input 
                  id="number"
                  value={newRoom.number}
                  onChange={(e) => setNewRoom({...newRoom, number: e.target.value})}
                  placeholder="ex: 101"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="floor">Étage</Label>
                <Input 
                  id="floor"
                  value={newRoom.floor}
                  onChange={(e) => setNewRoom({...newRoom, floor: e.target.value})}
                  placeholder="ex: 1"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="wing">Aile</Label>
                <Input 
                  id="wing"
                  value={newRoom.wing}
                  onChange={(e) => setNewRoom({...newRoom, wing: e.target.value})}
                  placeholder="ex: A"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Type de chambre</Label>
                <Select
                  value={newRoom.type}
                  onValueChange={(value: 'private' | 'shared' | 'intensive') => 
                    setNewRoom({...newRoom, type: value})
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Privée</SelectItem>
                    <SelectItem value="shared">Commune</SelectItem>
                    <SelectItem value="intensive">Soins intensifs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="beds">Nombre de lits</Label>
                <Input 
                  id="beds"
                  type="number"
                  value={newRoom.beds || ''}
                  onChange={(e) => setNewRoom({...newRoom, beds: parseInt(e.target.value)})}
                  min="1"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Prix journalier (€)</Label>
                <Input 
                  id="price"
                  type="number"
                  value={newRoom.price || ''}
                  onChange={(e) => setNewRoom({...newRoom, price: parseFloat(e.target.value)})}
                  placeholder="0.00"
                />
              </div>
              
              <div className="space-y-2 md:col-span-3">
                <Label htmlFor="equipment">Équipements (séparés par des virgules)</Label>
                <Input 
                  id="equipment"
                  value={newRoom.equipment?.join(', ') || ''}
                  onChange={(e) => setNewRoom({...newRoom, equipment: e.target.value.split(',').map(item => item.trim()).filter(Boolean)})}
                  placeholder="ex: Télévision, Wifi, Salle de bain privée"
                />
              </div>
              
              <div className="space-y-2 md:col-span-3">
                <Label htmlFor="notes">Notes</Label>
                <Input 
                  id="notes"
                  value={newRoom.notes || ''}
                  onChange={(e) => setNewRoom({...newRoom, notes: e.target.value})}
                  placeholder="Notes supplémentaires..."
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsCreatingRoom(false)}>Annuler</Button>
            <Button onClick={handleCreateRoom}>Ajouter la chambre</Button>
          </CardFooter>
        </Card>
      )}

      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button 
            variant={filterType === null ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType(null)}
          >
            Toutes
          </Button>
          <Button 
            variant={filterType === 'private' ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType('private')}
          >
            Privées
          </Button>
          <Button 
            variant={filterType === 'shared' ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType('shared')}
          >
            Communes
          </Button>
          <Button 
            variant={filterType === 'intensive' ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType('intensive')}
          >
            Soins intensifs
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une chambre..."
            className="pl-8 w-[250px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">N°</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Emplacement</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Lits</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Prix/jour</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Statut</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Équipements</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRooms.map((room) => (
                  <tr key={room.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{room.number}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(room.type)}`}>
                        {getTypeText(room.type)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div>Étage {room.floor}</div>
                        <div className="text-sm text-gray-500">Aile {room.wing}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div>{room.occupiedBeds} / {room.beds}</div>
                        <div className="text-sm text-gray-500">
                          {room.occupiedBeds === room.beds ? 'Complet' : 
                           room.occupiedBeds === 0 ? 'Vide' : 'Partiellement occupé'}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{room.price} €</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(room.status)}`}>
                        {getStatusText(room.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-700">
                        {room.equipment?.join(', ') || 'Aucun équipement spécifié'}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {room.status !== 'occupied' && (
                        <div className="inline-flex gap-2">
                          {room.status !== 'available' && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleStatusChange(room.id, 'available')}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Disponible
                            </Button>
                          )}
                          {room.status !== 'maintenance' && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleStatusChange(room.id, 'maintenance')}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Maintenance
                            </Button>
                          )}
                          {room.status !== 'cleaning' && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleStatusChange(room.id, 'cleaning')}
                            >
                              <Filter className="h-4 w-4 mr-1" />
                              Nettoyage
                            </Button>
                          )}
                        </div>
                      )}
                      <Button variant="ghost" size="sm" className="ml-2">
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoomsPage;
