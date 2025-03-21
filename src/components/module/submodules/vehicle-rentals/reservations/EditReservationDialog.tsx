
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Reservation, ReservationStatus } from '../types/rental-types';

// Mock data for vehicles, clients, and locations
const mockVehicles = [
  { id: "veh-001", name: "Renault Clio", type: "sedan", dailyRate: 60 },
  { id: "veh-002", name: "Peugeot 308", type: "hatchback", dailyRate: 70 },
  { id: "veh-003", name: "Toyota Corolla", type: "sedan", dailyRate: 80 },
  { id: "veh-004", name: "Audi A3", type: "luxury", dailyRate: 110 },
  { id: "veh-005", name: "Mercedes Classe C", type: "luxury", dailyRate: 140 }
];

const mockClients = [
  { id: "cli-001", name: "Jean Dupont" },
  { id: "cli-002", name: "Marie Martin" },
  { id: "cli-003", name: "Paul Bernard" },
  { id: "cli-004", name: "Sophie Dubois" }
];

const mockLocations = [
  { id: "loc-001", name: "Agence Paris Centre" },
  { id: "loc-002", name: "Agence Lyon" },
  { id: "loc-003", name: "Agence Marseille" }
];

// Form schema
const reservationFormSchema = z.object({
  vehicleId: z.string({
    required_error: "Veuillez sélectionner un véhicule",
  }),
  clientId: z.string({
    required_error: "Veuillez sélectionner un client",
  }),
  startDate: z.date({
    required_error: "Veuillez sélectionner une date de début",
  }),
  endDate: z.date({
    required_error: "Veuillez sélectionner une date de fin",
  }),
  pickupLocationId: z.string({
    required_error: "Veuillez sélectionner un lieu de prise en charge",
  }),
  returnLocationId: z.string({
    required_error: "Veuillez sélectionner un lieu de retour",
  }),
  depositAmount: z.coerce.number().min(0, {
    message: "Le montant de la caution doit être positif",
  }),
  depositPaid: z.boolean().default(false),
  status: z.enum(["confirmed", "in-progress", "completed", "cancelled", "pending"] as const, {
    required_error: "Veuillez sélectionner un statut",
  }),
  notes: z.string().optional(),
});

type ReservationFormValues = z.infer<typeof reservationFormSchema>;

// Helper to calculate the number of days between two dates
const calculateDays = (start: Date, end: Date) => {
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Helper to convert string to date
const stringToDate = (dateStr: string) => {
  if (!dateStr) return undefined;
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

interface EditReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: Reservation;
}

const EditReservationDialog: React.FC<EditReservationDialogProps> = ({
  open,
  onOpenChange,
  reservation,
}) => {
  const [totalPrice, setTotalPrice] = useState(reservation.totalPrice);
  const [selectedVehicle, setSelectedVehicle] = useState<typeof mockVehicles[0] | null>(null);

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      vehicleId: reservation.vehicleId,
      clientId: reservation.clientId,
      startDate: stringToDate(reservation.startDate),
      endDate: stringToDate(reservation.endDate),
      pickupLocationId: reservation.pickupLocationId,
      returnLocationId: reservation.returnLocationId,
      depositAmount: reservation.depositAmount,
      depositPaid: reservation.depositPaid,
      status: reservation.status,
      notes: reservation.notes || "",
    },
  });

  // When vehicle or dates change, recalculate the price
  useEffect(() => {
    const vehicle = form.watch("vehicleId");
    const startDate = form.watch("startDate");
    const endDate = form.watch("endDate");
    
    if (vehicle && startDate && endDate) {
      const selectedVeh = mockVehicles.find(v => v.id === vehicle);
      if (selectedVeh) {
        setSelectedVehicle(selectedVeh);
        const days = calculateDays(startDate, endDate);
        const price = selectedVeh.dailyRate * days;
        setTotalPrice(price);
      }
    }
  }, [form.watch("vehicleId"), form.watch("startDate"), form.watch("endDate"), form]);

  // Apply seasonal pricing (example: 10% higher in summer)
  const applySeasonalPricing = (basePrice: number, date: Date): number => {
    const month = date.getMonth();
    // Summer months (June, July, August)
    if (month >= 5 && month <= 7) {
      return basePrice * 1.1; // 10% higher
    }
    // Winter holidays (December)
    if (month === 11) {
      return basePrice * 1.15; // 15% higher
    }
    return basePrice;
  };

  const onSubmit = (data: ReservationFormValues) => {
    console.log("Updated reservation data:", data);
    console.log("New total price:", totalPrice);
    
    // Here you would typically update the reservation in your backend
    toast.success("Réservation mise à jour avec succès");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier la réservation</DialogTitle>
          <DialogDescription>
            Modifiez les détails de la réservation {reservation.id}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                            {vehicle.name} - {vehicle.dailyRate}€/jour
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
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockClients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
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
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de début</FormLabel>
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
                              format(field.value, "dd/MM/yyyy")
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
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de fin</FormLabel>
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
                              format(field.value, "dd/MM/yyyy")
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
                          disabled={(date) => {
                            const startDate = form.watch("startDate");
                            return !startDate || date < startDate;
                          }}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pickupLocationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lieu de prise en charge</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un lieu" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockLocations.map((location) => (
                          <SelectItem key={location.id} value={location.id}>
                            {location.name}
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
                name="returnLocationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lieu de retour</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un lieu" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockLocations.map((location) => (
                          <SelectItem key={location.id} value={location.id}>
                            {location.name}
                          </SelectItem>
                        ))}
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
                name="depositAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant de la caution (€)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="depositPaid"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Caution payée</FormLabel>
                      <FormDescription>
                        La caution a-t-elle été payée ?
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

            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between">
                <span className="font-medium">Prix total estimé:</span>
                <span className="font-bold">{totalPrice.toFixed(2)} €</span>
              </div>
              {selectedVehicle && form.watch("startDate") && (
                <div className="text-sm text-muted-foreground mt-2">
                  <p>
                    Tarif journalier: {selectedVehicle.dailyRate} € × 
                    {form.watch("endDate") && form.watch("startDate") 
                      ? calculateDays(form.watch("startDate"), form.watch("endDate")) 
                      : 0} jours
                  </p>
                  {form.watch("startDate") && (
                    <p>
                      Tarification saisonnière appliquée: 
                      {applySeasonalPricing(1, form.watch("startDate")) > 1 
                        ? `+${((applySeasonalPricing(1, form.watch("startDate")) - 1) * 100).toFixed(0)}%` 
                        : "Aucune"}
                    </p>
                  )}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button type="submit">Enregistrer les modifications</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditReservationDialog;
