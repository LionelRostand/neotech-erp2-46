
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { fr } from 'date-fns/locale';
import { useGarageClients } from '@/hooks/garage/useGarageClients';
import { useGarageVehicles } from '@/hooks/garage/useGarageVehicles';
import { useGarageMechanics } from '@/hooks/garage/useGarageMechanics';
import { useGarageServicesList } from '@/hooks/garage/useGarageServicesList';
import { toast } from 'sonner';
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';

interface MaintenanceFormProps {
  onCancel: () => void;
}

const MaintenanceForm = ({ onCancel }: MaintenanceFormProps) => {
  const { clients, isLoading: isLoadingClients } = useGarageClients();
  const { vehicles, loading: isLoadingVehicles } = useGarageVehicles();
  const { mechanics, isLoading: isLoadingMechanics } = useGarageMechanics();
  const { services, servicesOptions, isLoading: isLoadingServices } = useGarageServicesList();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>(new Date());
  const [clientId, setClientId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [mechanicId, setMechanicId] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [notes, setNotes] = useState("");

  // Filtrer les véhicules par client
  const filteredVehicles = vehicles.filter(vehicle => vehicle.clientId === clientId);
  
  const { add } = useFirestore(COLLECTIONS.GARAGE.MAINTENANCE);

  // Calculer le coût total en fonction des services sélectionnés
  useEffect(() => {
    if (services.length > 0 && selectedServices.length > 0) {
      const totalCost = selectedServices.reduce((sum, serviceId) => {
        const service = services.find(s => s.id === serviceId);
        return service ? sum + service.cost : sum;
      }, 0);
      setEstimatedCost(totalCost);
    } else {
      setEstimatedCost(0);
    }
  }, [selectedServices, services]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientId || !vehicleId || !mechanicId || selectedServices.length === 0 || !selectedDate) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      const maintenanceData = {
        clientId,
        vehicleId,
        mechanicId,
        services: selectedServices,
        date: selectedDate.toISOString(),
        endDate: selectedEndDate ? selectedEndDate.toISOString() : undefined,
        description,
        cost: estimatedCost,
        notes,
        status: 'scheduled',
        createdAt: new Date().toISOString()
      };

      await add(maintenanceData);
      toast.success("Maintenance programmée avec succès");
      onCancel(); // Fermer le dialogue
    } catch (error) {
      console.error("Erreur lors de l'ajout de la maintenance:", error);
      toast.error("Erreur lors de l'ajout de la maintenance");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="client">Client</Label>
          <Select value={clientId} onValueChange={setClientId}>
            <SelectTrigger id="client">
              <SelectValue placeholder="Sélectionner un client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map(client => (
                <SelectItem key={client.id} value={client.id}>
                  {client.firstName} {client.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="vehicle">Véhicule</Label>
          <Select value={vehicleId} onValueChange={setVehicleId} disabled={!clientId}>
            <SelectTrigger id="vehicle">
              <SelectValue placeholder={clientId ? "Sélectionner un véhicule" : "Sélectionnez d'abord un client"} />
            </SelectTrigger>
            <SelectContent>
              {filteredVehicles.map(vehicle => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.brand || vehicle.make} {vehicle.model} - {vehicle.registrationNumber || vehicle.licensePlate}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date de début</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP", { locale: fr }) : <span>Sélectionner une date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">Date de fin estimée</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedEndDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedEndDate ? format(selectedEndDate, "PPP", { locale: fr }) : <span>Sélectionner une date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedEndDate}
                onSelect={setSelectedEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
        
      <div className="space-y-2">
        <Label htmlFor="mechanic">Mécanicien</Label>
        <Select value={mechanicId} onValueChange={setMechanicId}>
          <SelectTrigger id="mechanic">
            <SelectValue placeholder="Sélectionner un mécanicien" />
          </SelectTrigger>
          <SelectContent>
            {mechanics.map(mechanic => (
              <SelectItem key={mechanic.id} value={mechanic.id}>
                {mechanic.firstName} {mechanic.lastName} - {Array.isArray(mechanic.specialization) ? mechanic.specialization.join(', ') : mechanic.specialization}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
        
      <div className="space-y-2">
        <Label htmlFor="services">Services</Label>
        <div className="flex flex-wrap gap-2 border p-2 rounded-md max-h-40 overflow-y-auto">
          {services.map(service => (
            <label key={service.id} className="flex items-center space-x-2 p-1 border rounded cursor-pointer hover:bg-gray-100 w-full">
              <input
                type="checkbox"
                checked={selectedServices.includes(service.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedServices([...selectedServices, service.id]);
                  } else {
                    setSelectedServices(selectedServices.filter(id => id !== service.id));
                  }
                }}
                className="h-4 w-4"
              />
              <span className="flex-1">{service.name}</span>
              <span className="text-gray-600">{service.cost}€</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description des travaux à effectuer"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes supplémentaires</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes supplémentaires (facultatif)"
        />
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold">Coût total estimé:</span>
          <span className="text-xl font-bold">{estimatedCost}€</span>
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Annuler
          </Button>
          <Button
            type="submit"
          >
            Créer la maintenance
          </Button>
        </div>
      </div>
    </form>
  );
};

export default MaintenanceForm;
