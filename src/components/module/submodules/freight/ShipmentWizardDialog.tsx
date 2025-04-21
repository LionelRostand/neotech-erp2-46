
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFreightClients } from "../hooks/useFreightClients";
import { toast } from "sonner";
import FirebaseShipmentForm from "./FirebaseShipmentForm";

const DEFAULT_FORM = {
  reference: "",
  customer: "",
  shipmentType: "import",
  origin: "",
  destination: "",
  carrier: "",
  carrierName: "",
  scheduledDate: "",
  estimatedDeliveryDate: "",
  status: "draft",
  totalWeight: 0,
  trackingNumber: "",
  notes: "",
  lines: [],
};

interface ShipmentWizardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ShipmentWizardDialog: React.FC<ShipmentWizardDialogProps> = ({ open, onOpenChange }) => {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);

  // Récupérer la liste réelle des clients Freight depuis Firestore
  const { clients, isLoading, error } = useFreightClients();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleClose = () => {
    setForm(DEFAULT_FORM);
    onOpenChange(false);
  };

  const handleSuccess = () => {
    toast.success("Expédition créée avec succès !");
    handleClose();
  };

  // Champs principaux du wizard (exemple simplifié pour la démo)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvelle Expédition</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={e => { e.preventDefault(); }}
          className="space-y-4 mt-2"
        >
          <Input
            required
            placeholder="Référence"
            name="reference"
            value={form.reference}
            onChange={handleChange}
          />
          {/* Liste déroulante dynamique des clients */}
          <select
            required
            name="customer"
            value={form.customer}
            onChange={handleChange}
            className="w-full rounded-md border px-3 py-2 text-sm bg-white z-50"
            disabled={isLoading}
          >
            <option value="">Sélectionner un client</option>
            {isLoading && <option disabled>Chargement…</option>}
            {!isLoading && clients.length > 0 &&
              clients.map((client) => (
                <option key={client.id} value={client.name}>
                  {client.name}
                  {client.email ? ` (${client.email})` : ""}
                </option>
              ))
            }
            {!isLoading && clients.length === 0 && (
              <option disabled>Aucun client trouvé</option>
            )}
          </select>
          {/* Champs simplifiés pour la démo */}
          <Input required placeholder="Origine" name="origin" value={form.origin} onChange={handleChange} />
          <Input required placeholder="Destination" name="destination" value={form.destination} onChange={handleChange} />
          <Input type="number" required placeholder="Poids total" name="totalWeight" value={form.totalWeight} onChange={handleChange} />
          {/* etc. autres champs... */}

          {/* Validation et enregistrement sur Firebase */}
          <div className="flex justify-between gap-4 pt-3">
            <Button type="button" variant="secondary" onClick={handleClose}>
              Annuler
            </Button>
            <FirebaseShipmentForm
              shipmentData={form}
              onSuccess={handleSuccess}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ShipmentWizardDialog;
