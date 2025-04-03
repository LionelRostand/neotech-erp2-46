import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Reservation {
  id: string;
  client: string;
  clientName: string;
  date: string;
  startDate: string;
  endDate: string;
  pickupLocation: { address: string };
  dropoffLocation: { address: string };
  totalAmount: number;
  status: string;
  paymentStatus: string;
  notes: string | any[] | { content: string }[];
  vehicle: string;
  driver: string;
}

const ReservationsCalendar: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [reservationDetails, setReservationDetails] = useState<Reservation | null>(null);

  const handleDateSelect = (selectedDate: Date) => {
    setDate(selectedDate);
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    const reservation = mockReservations.find(res => res.date === formattedDate) as Reservation;
    setReservationDetails(reservation || null);
  };

  // Fix the notes handling in mock data
  const mockReservations = [
    {
      id: "res001",
      client: "Marie Dupont",
      clientName: "Marie Dupont",
      date: "2023-11-10", // Added explicitly
      startDate: "2023-11-10", 
      endDate: "2023-11-12",
      pickupLocation: { address: "15 Rue de la Paix, Paris" },
      dropoffLocation: { address: "Charles de Gaulle Airport, Terminal 2E" },
      totalAmount: 320,
      status: "confirmed" as any, // Force type assertion
      paymentStatus: "paid",
      notes: "Client VIP, préférence siège avant",
      vehicle: "Mercedes S-Class",
      driver: "Jean Dupuis"
    },
    {
      id: "res002",
      client: "Pierre Dubois",
      clientName: "Pierre Dubois",
      date: "2023-11-15", // Added explicitly
      startDate: "2023-11-15",
      endDate: "2023-11-15",
      pickupLocation: { address: "Aéroport CDG Terminal 2E, Paris" },
      dropoffLocation: { address: "25 rue du Faubourg Saint-Honoré, 75008 Paris" },
      totalAmount: 120,
      status: "pending" as any, // Force type assertion
      paymentStatus: "unpaid",
      notes: "Location sans chauffeur",
      vehicle: "Renault Trafic",
      driver: "Luc Martin"
    },
    {
      id: "res003",
      client: "Sophie Laurent",
      clientName: "Sophie Laurent",
      date: "2023-11-08", // Added explicitly
      startDate: "2023-11-08",
      endDate: "2023-11-10",
      pickupLocation: { address: "Gare de Lyon, Paris" },
      dropoffLocation: { address: "Gare de Lyon, Paris" },
      totalAmount: 320,
      status: "completed" as any, // Force type assertion
      paymentStatus: "paid",
      notes: "Client régulier",
      vehicle: "Peugeot 508",
      driver: "Jean Martin"
    },
    {
      id: "res004",
      client: "Jean Moreau",
      clientName: "Jean Moreau",
      date: "2023-11-20", // Added explicitly
      startDate: "2023-11-20",
      endDate: "2023-11-20",
      pickupLocation: { address: "Hôtel Ritz, Place Vendôme, Paris" },
      dropoffLocation: { address: "Opéra Garnier, Paris" },
      totalAmount: 180,
      status: "confirmed" as any, // Force type assertion
      paymentStatus: "partial",
      notes: "Demande de siège bébé",
      vehicle: "Mercedes Classe E",
      driver: "Pierre Dubois"
    },
    {
      id: "res005",
      client: "Isabelle Bernard",
      clientName: "Isabelle Bernard",
      date: "2023-11-25", // Added explicitly
      startDate: "2023-11-25",
      endDate: "2023-11-27",
      pickupLocation: { address: "Gare Montparnasse, Paris" },
      dropoffLocation: { address: "Gare Montparnasse, Paris" },
      totalAmount: 420,
      status: "pending" as any, // Force type assertion
      paymentStatus: "unpaid",
      notes: "Besoin d'un grand coffre",
      vehicle: "Renault Espace",
      driver: "Sophie Laurent"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Réservations
          </CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: enUS }) : <span>Choisir une date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                disabled={(date) =>
                  date < new Date("2023-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>
      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Calendrier</TabsTrigger>
          <TabsTrigger value="list">Liste</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar">
          {/* Calendar content */}
        </TabsContent>
        
        <TabsContent value="list">
          {/* List content */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Réservations à venir</CardTitle>
              <CardDescription>
                Gérez vos réservations et consultez les détails
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reservationDetails ? (
                <div className="grid gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">Client</h4>
                    <p className="text-sm">{reservationDetails.clientName}</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">Véhicule</h4>
                    <p className="text-sm">{reservationDetails.vehicle}</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">Chauffeur</h4>
                    <p className="text-sm">{reservationDetails.driver}</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">Statut</h4>
                    <Badge variant="secondary">{reservationDetails.status}</Badge>
                  </div>
                  {reservationDetails.notes && (
                    <div className="col-span-2">
                      <h4 className="font-medium">Notes</h4>
                      <p>{typeof reservationDetails.notes === 'string' ? 
                           reservationDetails.notes : 
                           Array.isArray(reservationDetails.notes) ? 
                           String(reservationDetails.notes) : 
                           'Aucune note'}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p>Aucune réservation pour cette date.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReservationsCalendar;
