
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarCheck, List, Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const TransportReservations = () => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data for reservations
  const reservations = [
    {
      id: "TR-2023-001",
      client: "Jean Dupont",
      date: "2023-07-15",
      time: "09:30",
      service: "Transfert Aéroport",
      driver: "Marc Leblanc",
      vehicle: "Mercedes Classe E",
      status: "confirmed"
    },
    {
      id: "TR-2023-002",
      client: "Marie Legrand",
      date: "2023-07-15",
      time: "14:00",
      service: "Location avec chauffeur",
      driver: "Sophie Martin",
      vehicle: "BMW Série 5",
      status: "pending"
    },
    {
      id: "TR-2023-003",
      client: "Thomas Petit",
      date: "2023-07-16",
      time: "10:15",
      service: "Transfert Gare",
      driver: "Nicolas Durand",
      vehicle: "Audi A6",
      status: "confirmed"
    },
    {
      id: "TR-2023-004",
      client: "Sophie Bernard",
      date: "2023-07-17",
      time: "08:45",
      service: "Visite touristique",
      driver: "Pierre Moreau",
      vehicle: "Mercedes Classe V",
      status: "cancelled"
    },
    {
      id: "TR-2023-005",
      client: "Laurent Dubois",
      date: "2023-07-18",
      time: "16:30",
      service: "Transfert Hôtel",
      driver: "Julie Leroy",
      vehicle: "Tesla Model S",
      status: "confirmed"
    }
  ];

  // Filter reservations based on search term
  const filteredReservations = reservations.filter(
    (reservation) =>
      reservation.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to get badge style based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">Confirmée</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">En attente</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-500">En cours</Badge>;
      case "completed":
        return <Badge className="bg-gray-500">Terminée</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Annulée</Badge>;
      default:
        return <Badge>Inconnue</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Réservations de Transport</h2>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          <span>Nouvelle réservation</span>
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher par client, service ou ID..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" className="shrink-0">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Liste des réservations</CardTitle>
            <Tabs 
              value={viewMode} 
              onValueChange={(value) => setViewMode(value as 'list' | 'calendar')}
              className="w-[400px]"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <List size={16} />
                  <span>Liste</span>
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex items-center gap-2">
                  <CalendarCheck size={16} />
                  <span>Calendrier</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'list' ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Heure</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Chauffeur</TableHead>
                    <TableHead>Véhicule</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReservations.map((reservation) => (
                    <TableRow key={reservation.id} className="cursor-pointer hover:bg-gray-50">
                      <TableCell className="font-medium">{reservation.id}</TableCell>
                      <TableCell>{reservation.client}</TableCell>
                      <TableCell>{reservation.date}</TableCell>
                      <TableCell>{reservation.time}</TableCell>
                      <TableCell>{reservation.service}</TableCell>
                      <TableCell>{reservation.driver}</TableCell>
                      <TableCell>{reservation.vehicle}</TableCell>
                      <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex justify-center items-center h-[400px]">
              <div className="text-center">
                <CalendarCheck className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Vue Calendrier</h3>
                <p className="text-sm text-gray-500 max-w-xs mx-auto">
                  L'affichage du calendrier des réservations sera implémenté prochainement.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransportReservations;
