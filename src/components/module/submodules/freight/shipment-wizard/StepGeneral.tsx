
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useFreightClients } from "@/hooks/freight/useFreightClients";
import { cn } from "@/lib/utils";
import { useFreightData } from "@/hooks/modules/useFreightData";

interface StepGeneralProps {
  form: {
    reference?: string;
    customer?: string;
    customerName?: string;
    carrier?: string;
    carrierName?: string;
    shipmentType?: string;
    scheduledDate?: string;
    estimatedDeliveryDate?: string;
  };
  updateForm: (data: any) => void;
  prev: () => void;
  next: () => void;
  close: () => void;
}

const StepGeneral: React.FC<StepGeneralProps> = ({
  form = {}, // Provide default empty object
  updateForm,
  prev,
  next,
  close,
}) => {
  // Destructure with default values to prevent undefined errors
  const {
    reference = '',
    customer = '',
    customerName = '',
    carrier = '',
    carrierName = '',
    shipmentType = 'export',
    scheduledDate = '',
    estimatedDeliveryDate = ''
  } = form;

  // Load clients for select
  const { clients, isLoading: clientsLoading } = useFreightClients();
  
  // Load carriers
  const { carriers, loading: carriersLoading } = useFreightData();

  // Local state for dates
  const [scheduledDateOpen, setScheduledDateOpen] = useState(false);
  const [estimatedDateOpen, setEstimatedDateOpen] = useState(false);

  // Handle date selection
  const handleScheduledDateSelect = (date: Date) => {
    updateForm({ ...form, scheduledDate: date.toISOString() });
    setScheduledDateOpen(false);
  };

  const handleEstimatedDateSelect = (date: Date) => {
    updateForm({ ...form, estimatedDeliveryDate: date.toISOString() });
    setEstimatedDateOpen(false);
  };

  // Handle customer selection
  const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClientId = e.target.value;
    const selectedClient = clients.find((c) => c.id === selectedClientId);
    
    updateForm({
      ...form,
      customer: selectedClientId,
      customerName: selectedClient ? selectedClient.name : ''
    });
  };

  // Handle carrier selection
  const handleCarrierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCarrierId = e.target.value;
    const selectedCarrier = carriers.find((c) => c.id === selectedCarrierId);
    
    updateForm({
      ...form,
      carrier: selectedCarrierId,
      carrierName: selectedCarrier ? selectedCarrier.name : ''
    });
  };

  const canContinue = !!reference && !!customer && !!carrier && 
    !!shipmentType && !!scheduledDate && !!estimatedDeliveryDate;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reference */}
        <div className="space-y-2">
          <label htmlFor="reference" className="block text-sm font-medium">
            Référence
          </label>
          <Input
            id="reference"
            value={reference}
            onChange={(e) => updateForm({ ...form, reference: e.target.value })}
            placeholder="Référence de l'expédition"
          />
        </div>

        {/* Client */}
        <div className="space-y-2">
          <label htmlFor="customer" className="block text-sm font-medium">
            Client
          </label>
          <select
            id="customer"
            value={customer}
            onChange={handleCustomerChange}
            className="w-full rounded-md border border-input px-3 py-2"
          >
            <option value="">Sélectionner un client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        {/* Carrier */}
        <div className="space-y-2">
          <label htmlFor="carrier" className="block text-sm font-medium">
            Transporteur
          </label>
          <select
            id="carrier"
            value={carrier}
            onChange={handleCarrierChange}
            className="w-full rounded-md border border-input px-3 py-2"
          >
            <option value="">Sélectionner un transporteur</option>
            {carriers && carriers.map((carrier) => (
              <option key={carrier.id} value={carrier.id}>
                {carrier.name}
              </option>
            ))}
          </select>
        </div>

        {/* Shipment Type */}
        <div className="space-y-2">
          <label htmlFor="shipmentType" className="block text-sm font-medium">
            Type d'expédition
          </label>
          <select
            id="shipmentType"
            value={shipmentType}
            onChange={(e) => updateForm({ ...form, shipmentType: e.target.value })}
            className="w-full rounded-md border border-input px-3 py-2"
          >
            <option value="export">Export</option>
            <option value="import">Import</option>
            <option value="local">Local</option>
            <option value="international">International</option>
          </select>
        </div>

        {/* Scheduled Date */}
        <div className="space-y-2">
          <label htmlFor="scheduledDate" className="block text-sm font-medium">
            Date d'envoi
          </label>
          <Popover open={scheduledDateOpen} onOpenChange={setScheduledDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !scheduledDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {scheduledDate ? format(new Date(scheduledDate), "PPP") : "Sélectionner une date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={scheduledDate ? new Date(scheduledDate) : undefined}
                onSelect={handleScheduledDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Estimated Delivery Date */}
        <div className="space-y-2">
          <label htmlFor="estimatedDeliveryDate" className="block text-sm font-medium">
            Date de livraison estimée
          </label>
          <Popover open={estimatedDateOpen} onOpenChange={setEstimatedDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !estimatedDeliveryDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {estimatedDeliveryDate
                  ? format(new Date(estimatedDeliveryDate), "PPP")
                  : "Sélectionner une date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={estimatedDeliveryDate ? new Date(estimatedDeliveryDate) : undefined}
                onSelect={handleEstimatedDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-6">
        <Button type="button" variant="outline" onClick={prev} disabled>
          Précédent
        </Button>
        <Button
          type="button"
          onClick={next}
          disabled={!canContinue}
        >
          Suivant
        </Button>
        <Button type="button" variant="ghost" onClick={close}>
          Annuler
        </Button>
      </div>
    </div>
  );
};

export default StepGeneral;
