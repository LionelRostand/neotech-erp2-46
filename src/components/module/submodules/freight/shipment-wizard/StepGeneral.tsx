
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFreightClients } from "../hooks/useFreightClients";
import { useCarriers } from "../hooks/useCarriers";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function generateReference() {
  return "EXP" + Math.floor(100000 + Math.random() * 900000);
}

const StepGeneral = ({
  form,
  updateForm,
  next,
  close,
  submitting,
}: {
  form: any;
  updateForm: (fields: any) => void;
  next: () => void;
  close: () => void;
  submitting: boolean;
}) => {
  const { clients, isLoading: clientsLoading } = useFreightClients();
  const { carriers, isLoading: carriersLoading } = useCarriers();

  // Auto-générer une référence si le champ est vide au chargement
  useEffect(() => {
    if (!form.reference) {
      updateForm({ reference: generateReference() });
    }
  }, []);

  return (
    <form
      className="space-y-4"
      onSubmit={e => {
        e.preventDefault();
        next();
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Champ Référence avec bouton de génération */}
        <div>
          <label className="block font-medium mb-1">Référence</label>
          <div className="flex gap-2">
            <Input
              required
              name="reference"
              placeholder="Référence"
              value={form.reference}
              onChange={e => updateForm({ reference: e.target.value })}
            />
            <Button
              type="button"
              size="sm"
              className="shrink-0"
              title="Générer une nouvelle référence"
              onClick={() => updateForm({ reference: generateReference() })}
            >
              Générer
            </Button>
          </div>
        </div>

        {/* Client expéditeur */}
        <div>
          <label className="block font-medium mb-1">Client</label>
          <select
            required
            name="customer"
            value={form.customer}
            onChange={e => updateForm({ customer: e.target.value })}
            className="w-full rounded-md border px-3 py-2 text-sm bg-white"
            disabled={clientsLoading}
          >
            <option value="">Sélectionner un client</option>
            {clientsLoading ? (
              <option disabled>Chargement...</option>
            ) : clients && clients.length > 0 ? (
              clients.map((client: any) => (
                <option key={client.id} value={client.name}>
                  {client.name} {client.email ? `(${client.email})` : ""}
                </option>
              ))
            ) : (
              <option disabled>Aucun client trouvé</option>
            )}
          </select>
        </div>

        {/* Transporteur */}
        <div className="col-span-2">
          <label className="block font-medium mb-1">Transporteur</label>
          <select
            required
            name="carrier"
            value={form.carrier}
            onChange={e => updateForm({
              carrier: e.target.value,
              carrierName: carriers.find((c: any) => c.id === e.target.value)?.name || ''
            })}
            className="w-full rounded-md border px-3 py-2 text-sm bg-white"
            disabled={carriersLoading}
          >
            <option value="">Sélectionner un transporteur</option>
            {carriersLoading ? (
              <option disabled>Chargement...</option>
            ) : carriers && carriers.length > 0 ? (
              carriers.map((carrier: any) => (
                <option key={carrier.id} value={carrier.id}>
                  {carrier.name} - {carrier.type}
                </option>
              ))
            ) : (
              <option disabled>Aucun transporteur trouvé</option>
            )}
          </select>
        </div>

        {/* Date d'envoi */}
        <div>
          <label className="block font-medium mb-1">Date d'envoi</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !form.scheduledDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.scheduledDate ? (
                  format(new Date(form.scheduledDate), "dd MMMM yyyy", { locale: fr })
                ) : (
                  <span>Sélectionner une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={form.scheduledDate ? new Date(form.scheduledDate) : undefined}
                onSelect={(date) => updateForm({ scheduledDate: date?.toISOString() })}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Date de livraison estimée */}
        <div>
          <label className="block font-medium mb-1">Date de livraison estimée</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !form.estimatedDeliveryDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.estimatedDeliveryDate ? (
                  format(new Date(form.estimatedDeliveryDate), "dd MMMM yyyy", { locale: fr })
                ) : (
                  <span>Sélectionner une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={form.estimatedDeliveryDate ? new Date(form.estimatedDeliveryDate) : undefined}
                onSelect={(date) => updateForm({ estimatedDeliveryDate: date?.toISOString() })}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" type="button" onClick={close}>
          Annuler
        </Button>
        <Button type="submit" disabled={submitting}>
          Suivant
        </Button>
      </div>
    </form>
  );
};

export default StepGeneral;
