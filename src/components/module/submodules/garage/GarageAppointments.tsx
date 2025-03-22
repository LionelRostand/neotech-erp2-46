
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, Plus, Calendar, User, Car, Clock, MoreHorizontal, 
  CalendarDays, CheckCircle, XCircle 
} from 'lucide-react';
import { Appointment } from './types/garage-types';

// Sample data for appointments
const sampleAppointments: Appointment[] = [
  {
    id: "APT001",
    clientId: "CL001",
    vehicleId: "VH001",
    date: "2023-10-22",
    time: "09:00",
    duration: 60,
    reason: "Vidange et contrôle général",
    mechanicId: "MECH001",
    status: "scheduled",
    notes: "Client habituel, préfère les rendez-vous matinaux."
  },
  {
    id: "APT002",
    clientId: "CL003",
    vehicleId: "VH004",
    date: "2023-10-22",
    time: "10:30",
    duration: 120,
    reason: "Révision complète + courroie de distribution",
    mechanicId: "MECH002",
    status: "scheduled",
    notes: "Véhicule professionnel, urgent."
  },
  {
    id: "APT003",
    clientId: "CL002",
    vehicleId: "VH003",
    date: "2023-10-22",
    time: "13:45",
    duration: 90,
    reason: "Diagnostic système électrique",
    mechanicId: "MECH003",
    status: "scheduled",
    notes: "Problème démarrage intermittent."
  },
  {
    id: "APT004",
    clientId: "CL005",
    vehicleId: "VH008",
    date: "2023-10-21",
    time: "14:30",
    duration: 60,
    reason: "Contrôle pré-technique",
    mechanicId: "MECH001",
    status: "completed",
    notes: "Contrôle technique prévu le 25/10."
  },
  {
    id: "APT005",
    clientId: "CL004",
    vehicleId: "VH007",
    date: "2023-10-21",
    time: "11:00",
    duration: 45,
    reason: "Changement pneus avant",
    mechanicId: "MECH002",
    status: "completed",
    notes: "Pneus Michelin en stock."
  },
  {
    id: "APT006",
    clientId: "CL001",
    vehicleId: "VH002",
    date: "2023-10-20",
    time: "16:00",
    duration: 30,
    reason: "Vérification fuite huile",
    mechanicId: "MECH001",
    status: "cancelled",
    notes: "Client a reporté au 27/10."
  }
];

const clientsMap = {
  CL001: "Jean Dupont",
  CL002: "Marie Lambert",
  CL003: "Pierre Martin",
  CL004: "Sophie Bernard",
  CL005: "Thomas Leclerc"
};

const vehiclesMap = {
  VH001: "Renault Clio",
  VH002: "Peugeot 308",
  VH003: "Citroen C3",
  VH004: "Ford Transit",
  VH007: "Volkswagen Golf",
  VH008: "Toyota Yaris"
};

const mechanicsMap = {
  MECH001: "Jean Martin",
  MECH002: "Thomas Dubois",
  MECH003: "Sophie Moreau"
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'scheduled':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Planifié</Badge>;
    case 'in_progress':
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">En cours</Badge>;
    case 'completed':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Terminé</Badge>;
    case 'cancelled':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Annulé</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
  }
};

const GarageAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(sampleAppointments);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter appointments based on search term and active tab
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      (clientsMap[appointment.clientId as keyof typeof clientsMap] || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vehiclesMap[appointment.vehicleId as keyof typeof vehiclesMap] || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.id.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && appointment.status === activeTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Rendez-vous</h2>
        <Button className="flex items-center gap-2">
          <Plus size={18} />
          <span>Nouveau RDV</span>
        </Button>
      </div>

      {/* Appointment search and filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Recherche et filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher par client, véhicule, raison..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Tabs 
              defaultValue="all" 
              className="w-full md:w-auto"
              onValueChange={setActiveTab}
            >
              <TabsList>
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="scheduled">Planifiés</TabsTrigger>
                <TabsTrigger value="completed">Terminés</TabsTrigger>
                <TabsTrigger value="cancelled">Annulés</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Calendar view button */}
      <div className="flex justify-end">
        <Button variant="outline" className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          <span>Vue Calendrier</span>
        </Button>
      </div>

      {/* Appointments list */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Liste des rendez-vous</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun rendez-vous trouvé. Créez un nouveau rendez-vous avec le bouton "Nouveau RDV".
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date & Heure</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Véhicule</TableHead>
                    <TableHead>Raison</TableHead>
                    <TableHead>Mécanicien</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map(appointment => (
                    <TableRow key={appointment.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{appointment.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div>{new Date(appointment.date).toLocaleDateString('fr-FR')}</div>
                            <div className="text-xs text-muted-foreground">{appointment.time} ({appointment.duration} min)</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{clientsMap[appointment.clientId as keyof typeof clientsMap]}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Car className="h-4 w-4 text-muted-foreground" />
                          <span>{vehiclesMap[appointment.vehicleId as keyof typeof vehiclesMap]}</span>
                        </div>
                      </TableCell>
                      <TableCell>{appointment.reason}</TableCell>
                      <TableCell>{mechanicsMap[appointment.mechanicId as keyof typeof mechanicsMap]}</TableCell>
                      <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {appointment.status === 'scheduled' && (
                            <>
                              <Button variant="outline" size="icon" title="Marquer comme terminé">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon" title="Annuler">
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button variant="outline" size="icon" title="Plus d'options">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Today's schedule */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Planning du jour</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-4">
                <Clock className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">Jean Martin</h3>
              </div>
              <div className="space-y-2">
                <div className="text-sm border-l-2 border-blue-500 pl-2">
                  <div className="font-medium">09:00 - 10:00</div>
                  <div className="text-muted-foreground">Vidange - Renault Clio</div>
                </div>
                <div className="text-sm border-l-2 border-green-500 pl-2">
                  <div className="font-medium">11:00 - 11:45</div>
                  <div className="text-muted-foreground">Pneus - Volkswagen Golf</div>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-4">
                <Clock className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">Thomas Dubois</h3>
              </div>
              <div className="space-y-2">
                <div className="text-sm border-l-2 border-blue-500 pl-2">
                  <div className="font-medium">10:30 - 12:30</div>
                  <div className="text-muted-foreground">Révision - Ford Transit</div>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-4">
                <Clock className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">Sophie Moreau</h3>
              </div>
              <div className="space-y-2">
                <div className="text-sm border-l-2 border-blue-500 pl-2">
                  <div className="font-medium">13:45 - 15:15</div>
                  <div className="text-muted-foreground">Diagnostic - Citroen C3</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GarageAppointments;
