
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
    if (!form.reference || !form.customer || !form.origin || !form.destination) {
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

  // Parse dates from ISO strings
  const scheduledDate = form.scheduledDate ? new Date(form.scheduledDate) : new Date();
  const estimatedDeliveryDate = form.estimatedDeliveryDate ? new Date(form.estimatedDeliveryDate) : new Date();

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-medium mb-1 block">Référence</label>
          <Input
            value={form.reference}
            onChange={(e) => updateForm({ reference: e.target.value })}
            placeholder="Référence de l'expédition"
            required
          />
        </div>
        <div>
          <label className="font-medium mb-1 block">Client</label>
          <Input
            value={form.customer}
            onChange={(e) => updateForm({ customer: e.target.value })}
            placeholder="Nom du client"
            required
          />
        </div>

        <div>
          <label className="font-medium mb-1 block">Origine</label>
          <Input
            value={form.origin}
            onChange={(e) => updateForm({ origin: e.target.value })}
            placeholder="Adresse d'origine"
            required
          />
        </div>
        <div>
          <label className="font-medium mb-1 block">Destination</label>
          <Input
            value={form.destination}
            onChange={(e) => updateForm({ destination: e.target.value })}
            placeholder="Adresse de destination"
            required
          />
        </div>

        <div>
          <label className="font-medium mb-1 block">Date d'envoi</label>
          <DatePicker
            date={scheduledDate}
            onSelect={handleScheduledDateChange}
            placeholder="Sélectionner une date"
          />
        </div>
        <div>
          <label className="font-medium mb-1 block">Date de livraison estimée</label>
          <DatePicker
            date={estimatedDeliveryDate}
            onSelect={handleEstimatedDeliveryDateChange}
            placeholder="Sélectionner une date"
          />
        </div>

        <div>
          <label className="font-medium mb-1 block">Type d'expédition</label>
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
      </div>

      <div className="flex gap-2 pt-4 justify-end">
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
