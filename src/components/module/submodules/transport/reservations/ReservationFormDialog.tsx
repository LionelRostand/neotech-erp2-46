
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Car, User, UserCheck } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TransportReservation, TransportService, TransportReservationStatus } from '../types/transport-types';

// Mock data for clients, vehicles, and drivers
const mockClients = [
  { id: "cli-001", firstName: "Jean", lastName: "Dupont", email: "jean.dupont@example.com", phone: "+33612345678" },
  { id: "cli-002", firstName: "Marie", lastName: "Martin", email: "marie.martin@example.com", phone: "+33623456789" },
  { id: "cli-003", firstName: "Thomas", lastName: "Petit", email: "thomas.petit@example.com", phone: "+33634567890" },
  { id: "cli-004", firstName: "Sophie", lastName: "Bernard", email: "sophie.bernard@example.com", phone: "+33645678901" },
  { id: "cli-005", firstName: "Laurent", lastName: "Dubois", email: "laurent.dubois@example.com", phone: "+33656789012" }
];

const mockVehicles = [
  { id: "veh-001", name: "Mercedes Classe E", type: "sedan", capacity: 4, licensePlate: "AB-123-CD" },
  { id: "veh-002", name: "BMW Série 5", type: "sedan", capacity: 4, licensePlate: "EF-456-GH" },
  { id: "veh-003", name: "Audi A6", type: "sedan", capacity: 4, licensePlate: "IJ-789-KL" },
  { id: "veh-004", name: "Mercedes Classe V", type: "van", capacity: 7, licensePlate: "MN-012-OP" },
  { id: "veh-005", name: "Tesla Model S", type: "luxury", capacity: 4, licensePlate: "QR-345-ST" }
];

const mockDrivers = [
  { id: "drv-001", firstName: "Marc", lastName: "Leblanc", rating: 4.8 },
  { id: "drv-002", firstName: "Sophie", lastName: "Martin", rating: 4.9 },
  { id: "drv-003", firstName: "Nicolas", lastName: "Durand", rating: 4.7 },
  { id: "drv-004", firstName: "Pierre", lastName: "Moreau", rating: 4.5 },
  { id: "drv-005", firstName: "Julie", lastName: "Leroy", rating: 4.9 }
];

// Form schema
const reservationFormSchema = z.object({
  clientId: z.string({
    required_error: "Veuillez sélectionner un client",
  }),
  vehicleId: z.string({
    required_error: "Veuillez sélectionner un véhicule",
  }),
  service: z.string({
    required_error: "Veuillez sélectionner un service",
  }) as z.ZodType<TransportService>,
  date: z.date({
    required_error: "Veuillez sélectionner une date",
  }),
  time: z.string({
    required_error: "Veuillez spécifier une heure",
  }).regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Format d'heure invalide (HH:MM)",
  }),
  pickupAddress: z.string({
    required_error: "Veuillez spécifier l'adresse de prise en charge",
  }).min(5, {
    message: "L'adresse doit comporter au moins 5 caractères",
  }),
  dropoffAddress: z.string({
    required_error: "Veuillez spécifier l'adresse de destination",
  }).min(5, {
    message: "L'adresse doit comporter au moins 5 caractères",
  }),
  price: z.coerce.number().min(0, {
    message: "Le prix doit être positif",
  }),
  isPaid: z.boolean().default(false),
  needsDriver: z.boolean().default(true),
  driverId: z.string().optional(),
  notes: z.string().optional(),
  status: z.string().default("pending") as z.ZodType<TransportReservationStatus>,
});

type ReservationFormValues = z.infer<typeof reservationFormSchema>;

interface ReservationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation?: TransportReservation;
  onSave: (data: ReservationFormValues) => void;
  isEditing?: boolean;
}

const ReservationFormDialog: React.FC<ReservationFormDialogProps> = ({
  open,
  onOpenChange,
  reservation,
  onSave,
  isEditing = false,
}) => {
  // Get client name
  const getClientName = (id: string) => {
    const client = mockClients.find(c => c.id === id);
    return client ? `${client.firstName} ${client.lastName}` : "Client inconnu";
  };

  // Default values for the form
  const defaultValues: Partial<ReservationFormValues> = isEditing && reservation
    ? {
        clientId: reservation.clientId,
        vehicleId: reservation.vehicleId,
        service: reservation.service,
        date: new Date(reservation.date),
        time: reservation.time,
        pickupAddress: reservation.pickup.address,
        dropoffAddress: reservation.dropoff.address,
        price: reservation.price,
        isPaid: reservation.isPaid,
        needsDriver: reservation.needsDriver,
        driverId: reservation.driverId,
        notes: reservation.notes || "",
        status: reservation.status,
      }
    : {
        needsDriver: true,
        isPaid: false,
        status: "pending",
        date: new Date(),
        time: "10:00"
      };

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues,
  });

  // Reset form when dialog opens/closes or when editing a different reservation
  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
    }
  }, [open, reservation?.id]);

  // Handle needsDriver changes
  const needsDriver = form.watch("needsDriver");
  
  // Calculate price based on service type and distance (simplified example)
  const calculatePrice = (service: string, needsDriver: boolean) => {
    let basePrice = 0;
    
    switch(service) {
      case "airport-transfer":
        basePrice = 80;
        break;
      case "city-tour":
        basePrice = 120;
        break;
      case "business-travel":
        basePrice = 150;
        break;
      case "wedding":
        basePrice = 300;
        break;
      case "event":
        basePrice = 200;
        break;
      case "hourly-hire":
        basePrice = 75;
        break;
      case "long-distance":
        basePrice = 250;
        break;
      case "custom":
        basePrice = 100;
        break;
      default:
        basePrice = 100;
    }
    
    if (needsDriver) {
      basePrice += 50; // Add driver fee
    }
    
    return basePrice;
  };

  // Update price when service or needsDriver changes
  const service = form.watch("service");
  useEffect(() => {
    if (service) {
      const calculatedPrice = calculatePrice(service, needsDriver);
      form.setValue("price", calculatedPrice);
    }
  }, [service, needsDriver]);

  const onSubmit = (data: ReservationFormValues) => {
    console.log("Form data:", data);
    onSave(data);
    toast.success(isEditing ? "Réservation mise à jour avec succès" : "Réservation créée avec succès");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Modifier la réservation" : "Nouvelle réservation"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Modifiez les détails de la réservation de transport" 
              : "Créez une nouvelle réservation de transport pour un client"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionner un client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockClients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.firstName} {client.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="service"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un service" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="airport-transfer">Transfert Aéroport</SelectItem>
                        <SelectItem value="city-tour">Visite de ville</SelectItem>
                        <SelectItem value="business-travel">Voyage d'affaires</SelectItem>
                        <SelectItem value="wedding">Mariage</SelectItem>
                        <SelectItem value="event">Événement</SelectItem>
                        <SelectItem value="hourly-hire">Location à l'heure</SelectItem>
                        <SelectItem value="long-distance">Longue distance</SelectItem>
                        <SelectItem value="custom">Personnalisé</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd MMMM yyyy", { locale: fr })
                            ) : (
                              <span>Sélectionner une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="pickupAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse de prise en charge</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dropoffAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse de destination</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="vehicleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Véhicule</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un véhicule" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockVehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.name} ({vehicle.licensePlate})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="needsDriver"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Besoin d'un chauffeur</FormLabel>
                      <FormDescription>
                        Le client a-t-il besoin d'un chauffeur?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {needsDriver && (
              <FormField
                control={form.control}
                name="driverId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chauffeur</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un chauffeur" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockDrivers.map((driver) => (
                          <SelectItem key={driver.id} value={driver.id}>
                            {driver.firstName} {driver.lastName} - {driver.rating}★
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix (€)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPaid"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Paiement reçu</FormLabel>
                      <FormDescription>
                        Le paiement a-t-il été effectué?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {isEditing && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="confirmed">Confirmée</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="in-progress">En cours</SelectItem>
                        <SelectItem value="completed">Terminée</SelectItem>
                        <SelectItem value="cancelled">Annulée</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Informations complémentaires..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button type="submit">{isEditing ? "Enregistrer les modifications" : "Créer la réservation"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationFormDialog;
