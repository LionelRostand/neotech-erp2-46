
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";

const shipmentTypeOptions = [
  { value: "import", label: "Import" },
  { value: "export", label: "Export" },
  { value: "local", label: "Local" },
  { value: "international", label: "International" },
];

interface StepGeneralProps {
  form: any;
  updateForm: (updates: any) => void;
  next: () => void;
  close: () => void;
  submitting: boolean;
}

const StepGeneral: React.FC<StepGeneralProps> = ({
  form,
  updateForm,
  next,
  close,
  submitting,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.reference || !form.customer || !form.transporteur) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }
    next();
  };

  const handleScheduledDateChange = (date: Date | undefined) => {
    if (date) {
      updateForm({ scheduledDate: date.toISOString() });
    }
  };

  const handleEstimatedDeliveryDateChange = (date: Date | undefined) => {
    if (date) {
      updateForm({ estimatedDeliveryDate: date.toISOString() });
    }
  };

  const scheduledDate = form.scheduledDate ? new Date(form.scheduledDate) : new Date();
  const estimatedDeliveryDate = form.estimatedDeliveryDate ? new Date(form.estimatedDeliveryDate) : new Date();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Référence</label>
          <div className="flex gap-2">
            <Input
              value={form.reference}
              onChange={(e) => updateForm({ reference: e.target.value })}
              placeholder="Référence de l'expédition"
              className="flex-1"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => {/* TODO: Implémenter la génération de référence */}}
            >
              Générer
            </Button>
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Client</label>
          <Select
            value={form.customer}
            onValueChange={(value) => updateForm({ customer: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="client1">Client 1</SelectItem>
              <SelectItem value="client2">Client 2</SelectItem>
              <SelectItem value="client3">Client 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Transporteur</label>
          <Select
            value={form.transporteur}
            onValueChange={(value) => updateForm({ transporteur: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un transporteur" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="transport1">Transporteur 1</SelectItem>
              <SelectItem value="transport2">Transporteur 2</SelectItem>
              <SelectItem value="transport3">Transporteur 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Type d'expédition</label>
          <Select
            value={form.shipmentType}
            onValueChange={(value) => updateForm({ shipmentType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le type" />
            </SelectTrigger>
            <SelectContent>
              {shipmentTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Date d'envoi</label>
          <DatePicker
            date={scheduledDate}
            onSelect={handleScheduledDateChange}
            placeholder="Sélectionner une date"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Date de livraison estimée</label>
          <DatePicker
            date={estimatedDeliveryDate}
            onSelect={handleEstimatedDeliveryDateChange}
            placeholder="Sélectionner une date"
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <Button type="button" variant="ghost" onClick={close} disabled={submitting}>
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
