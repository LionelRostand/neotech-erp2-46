
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

// Define the form type
type GeneralForm = {
  reference: string;
  customer: string;
  carrier: string;
  carrierName: string;
  origin: string;
  destination: string;
  shipmentType: string;
  status: string;
  scheduledDate: string;
};

type StepGeneralProps = {
  form: any;
  updateForm: (fields: Partial<GeneralForm>) => void;
  next: () => void;
  close: () => void;
  submitting: boolean;
};

// Types for shipment and status
const shipmentTypes = [
  { value: "import", label: "Import" },
  { value: "export", label: "Export" },
  { value: "local", label: "National" },
  { value: "international", label: "International" },
];

const statusOptions = [
  { value: "draft", label: "Brouillon" },
  { value: "confirmed", label: "Confirmé" },
  { value: "in_transit", label: "En transit" },
  { value: "delivered", label: "Livré" },
  { value: "cancelled", label: "Annulé" },
  { value: "delayed", label: "Retardé" },
];

const StepGeneral: React.FC<StepGeneralProps> = ({
  form,
  updateForm,
  next,
  close,
  submitting,
}) => {
  // Validation to enable/disable the next button
  const isValid = form.reference && form.customer && form.origin && form.destination;

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      next();
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Référence & Client */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-medium mb-1 block">
            Référence <span className="text-red-500">*</span>
          </label>
          <Input
            value={form.reference}
            onChange={(e) => updateForm({ reference: e.target.value })}
            placeholder="EXP-2023-001"
            required
          />
        </div>
        <div>
          <label className="font-medium mb-1 block">
            Client <span className="text-red-500">*</span>
          </label>
          <Input
            value={form.customer}
            onChange={(e) => updateForm({ customer: e.target.value })}
            placeholder="Nom du client"
            required
          />
        </div>
      </div>

      {/* Origin & Destination */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-medium mb-1 block">
            Origine <span className="text-red-500">*</span>
          </label>
          <Input
            value={form.origin}
            onChange={(e) => updateForm({ origin: e.target.value })}
            placeholder="Ville d'origine"
            required
          />
        </div>
        <div>
          <label className="font-medium mb-1 block">
            Destination <span className="text-red-500">*</span>
          </label>
          <Input
            value={form.destination}
            onChange={(e) => updateForm({ destination: e.target.value })}
            placeholder="Ville de destination"
            required
          />
        </div>
      </div>

      {/* Transporteur */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-medium mb-1 block">Transporteur</label>
          <Input
            value={form.carrier}
            onChange={(e) => updateForm({ carrier: e.target.value })}
            placeholder="Code du transporteur"
          />
        </div>
        <div>
          <label className="font-medium mb-1 block">Nom du transporteur</label>
          <Input
            value={form.carrierName}
            onChange={(e) => updateForm({ carrierName: e.target.value })}
            placeholder="Nom complet"
          />
        </div>
      </div>

      {/* Type & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-medium mb-1 block">Type d'expédition</label>
          <select
            value={form.shipmentType}
            onChange={(e) => updateForm({ shipmentType: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            {shipmentTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-medium mb-1 block">Statut initial</label>
          <select
            value={form.status}
            onChange={(e) => updateForm({ status: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Date d'expédition */}
      <div>
        <label className="font-medium mb-1 block">Date d'expédition</label>
        <Input
          type="date"
          value={form.scheduledDate ? form.scheduledDate.substring(0, 10) : ""}
          onChange={(e) => 
            updateForm({ 
              scheduledDate: e.target.value ? new Date(e.target.value).toISOString() : new Date().toISOString() 
            })
          }
        />
      </div>

      {/* Validation warning */}
      {!isValid && (
        <div className="text-amber-600 text-sm">
          Veuillez remplir tous les champs obligatoires (*)
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="ghost" onClick={close}>
          Annuler
        </Button>
        <Button type="submit" disabled={!isValid || submitting}>
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Suivant
        </Button>
      </div>
    </form>
  );
};

export default StepGeneral;
