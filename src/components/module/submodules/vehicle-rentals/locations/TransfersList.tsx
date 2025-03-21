
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight, Calendar, Car, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Location } from '../types/rental-types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface TransfersListProps {
  locations: Location[];
}

interface Transfer {
  id: string;
  vehicleId: string;
  vehicleName: string;
  sourceName: string;
  sourceId: string;
  destinationName: string;
  destinationId: string;
  departureDate: string;
  arrivalDate: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  driverName: string;
}

const mockTransfers: Transfer[] = [
  {
    id: "tr1",
    vehicleId: "v1",
    vehicleName: "Renault Clio (AA-123-BC)",
    sourceId: "loc1",
    sourceName: "Agence Centrale Paris",
    destinationId: "loc2",
    destinationName: "Agence Lyon Part-Dieu",
    departureDate: "2023-08-10T08:00:00",
    arrivalDate: "2023-08-10T14:00:00",
    status: "completed",
    driverName: "Pierre Dumont"
  },
  {
    id: "tr2",
    vehicleId: "v3",
    vehicleName: "Citroen C3 (AC-789-DE)",
    sourceId: "loc2",
    sourceName: "Agence Lyon Part-Dieu",
    destinationId: "loc3",
    destinationName: "Point Relais Marseille",
    departureDate: "2023-08-15T10:00:00",
    arrivalDate: "2023-08-15T16:00:00",
    status: "scheduled",
    driverName: "Sophie Martin"
  },
  {
    id: "tr3",
    vehicleId: "v5",
    vehicleName: "Dacia Duster (AE-345-FG)",
    sourceId: "loc3",
    sourceName: "Point Relais Marseille",
    destinationId: "loc1",
    destinationName: "Agence Centrale Paris",
    departureDate: "2023-08-12T09:00:00",
    arrivalDate: "2023-08-12T18:00:00",
    status: "in-progress",
    driverName: "Jean Dupont"
  }
];

const TransfersList: React.FC<TransfersListProps> = ({ locations }) => {
  const [transfers, setTransfers] = useState<Transfer[]>(mockTransfers);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [sourceId, setSourceId] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [driverName, setDriverName] = useState("");

  const handleCreateTransfer = () => {
    if (!sourceId || !destinationId || !vehicleId || !driverName) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const sourceLoc = locations.find(loc => loc.id === sourceId);
    const destLoc = locations.find(loc => loc.id === destinationId);

    if (sourceId === destinationId) {
      toast.error("L'emplacement source et destination ne peuvent pas être identiques");
      return;
    }

    // Dans une application réelle, vous récupéreriez les véhicules de la base de données
    const mockVehicles = [
      { id: "v1", name: "Renault Clio (AA-123-BC)" },
      { id: "v2", name: "Peugeot 308 (AB-456-CD)" },
      { id: "v4", name: "Volkswagen Golf (AD-012-EF)" },
      { id: "v6", name: "Toyota Yaris (AF-678-GH)" }
    ];
    
    const vehicle = mockVehicles.find(v => v.id === vehicleId);

    const newTransfer: Transfer = {
      id: `tr${transfers.length + 1}`,
      vehicleId,
      vehicleName: vehicle?.name || "Véhicule inconnu",
      sourceId,
      sourceName: sourceLoc?.name || "Emplacement inconnu",
      destinationId,
      destinationName: destLoc?.name || "Emplacement inconnu",
      departureDate: new Date().toISOString(),
      arrivalDate: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 heures plus tard
      status: "scheduled",
      driverName
    };

    setTransfers([...transfers, newTransfer]);
    setIsCreateDialogOpen(false);
    toast.success("Transfert programmé avec succès");
    
    // Réinitialiser les champs du formulaire
    setSourceId("");
    setDestinationId("");
    setVehicleId("");
    setDriverName("");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Transferts de véhicules</h3>
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Nouveau transfert</span>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Véhicule</TableHead>
                <TableHead>Départ</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Chauffeur</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transfers.map((transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell className="font-medium">{transfer.vehicleName}</TableCell>
                  <TableCell>{transfer.sourceName}</TableCell>
                  <TableCell>{transfer.destinationName}</TableCell>
                  <TableCell>
                    {new Date(transfer.departureDate).toLocaleDateString('fr-FR')}
                    <div className="text-gray-500 text-xs">
                      {new Date(transfer.departureDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </TableCell>
                  <TableCell>{transfer.driverName}</TableCell>
                  <TableCell>
                    {transfer.status === 'scheduled' && (
                      <Badge className="bg-blue-100 text-blue-800">Programmé</Badge>
                    )}
                    {transfer.status === 'in-progress' && (
                      <Badge className="bg-yellow-100 text-yellow-800">En cours</Badge>
                    )}
                    {transfer.status === 'completed' && (
                      <Badge className="bg-green-100 text-green-800">Terminé</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              
              {transfers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Aucun transfert programmé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Programmer un transfert de véhicule</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="source">Emplacement de départ</Label>
              <Select value={sourceId} onValueChange={setSourceId}>
                <SelectTrigger id="source">
                  <SelectValue placeholder="Sélectionner un emplacement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Emplacements</SelectLabel>
                    {locations.map(location => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-center">
              <ArrowRight className="text-gray-400" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="destination">Emplacement d'arrivée</Label>
              <Select value={destinationId} onValueChange={setDestinationId}>
                <SelectTrigger id="destination">
                  <SelectValue placeholder="Sélectionner un emplacement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Emplacements</SelectLabel>
                    {locations.map(location => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vehicle">Véhicule</Label>
              <Select value={vehicleId} onValueChange={setVehicleId}>
                <SelectTrigger id="vehicle">
                  <SelectValue placeholder="Sélectionner un véhicule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Véhicules disponibles</SelectLabel>
                    <SelectItem value="v1">Renault Clio (AA-123-BC)</SelectItem>
                    <SelectItem value="v2">Peugeot 308 (AB-456-CD)</SelectItem>
                    <SelectItem value="v4">Volkswagen Golf (AD-012-EF)</SelectItem>
                    <SelectItem value="v6">Toyota Yaris (AF-678-GH)</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="driver">Chauffeur</Label>
              <Select value={driverName} onValueChange={setDriverName}>
                <SelectTrigger id="driver">
                  <SelectValue placeholder="Sélectionner un chauffeur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Chauffeurs disponibles</SelectLabel>
                    <SelectItem value="Pierre Dumont">Pierre Dumont</SelectItem>
                    <SelectItem value="Sophie Martin">Sophie Martin</SelectItem>
                    <SelectItem value="Jean Dupont">Jean Dupont</SelectItem>
                    <SelectItem value="Marie Lambert">Marie Lambert</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={handleCreateTransfer}>Programmer le transfert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransfersList;
