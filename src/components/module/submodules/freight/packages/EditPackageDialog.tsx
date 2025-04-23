
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shipment } from "@/hooks/freight/useFreightShipments";
import { updateShipment } from "../services/shipmentService";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageData: Shipment | null;
  onSuccess?: () => void;
}

const shipmentStatusOptions = [
  { value: "draft", label: "Brouillon" },
  { value: "confirmed", label: "Confirmé" },
  { value: "in_transit", label: "En transit" },
  { value: "delivered", label: "Livré" },
  { value: "cancelled", label: "Annulé" },
  { value: "delayed", label: "Retardé" },
];

const EditPackageDialog: React.FC<Props> = ({ open, onOpenChange, packageData, onSuccess }) => {
  const [form, setForm] = useState<Shipment | null>(packageData);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    setForm(packageData);
  }, [packageData]);

  if (!form) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => prev ? { ...prev, [name]: value } : prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!form.id) throw new Error("Aucun ID de colis");
      await updateShipment(form.id, {
        ...form,
      });
      toast.success("Colis mis à jour avec succès");
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Modifier le colis</DialogTitle>
            <DialogDescription>
              Mise à jour du colis <span className="font-semibold">{form.reference}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Input
              name="customerName"
              value={form.customerName || ""}
              onChange={handleChange}
              placeholder="Client"
              required
            />
            <Input
              name="trackingNumber"
              value={form.trackingNumber || ""}
              onChange={handleChange}
              placeholder="Numéro de suivi"
            />
            <div>
              <label className="block text-xs font-medium mb-1">Statut</label>
              <select
                name="status"
                className="w-full border rounded px-2 py-1"
                value={form.status}
                onChange={handleChange}
              >
                {shipmentStatusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <Input
              name="origin"
              value={form.origin || ""}
              onChange={handleChange}
              placeholder="Origine"
              required
            />
            <Input
              name="destination"
              value={form.destination || ""}
              onChange={handleChange}
              placeholder="Destination"
              required
            />
            <Input
              name="totalWeight"
              value={form.totalWeight || ""}
              onChange={handleChange}
              type="number"
              placeholder="Poids total"
            />
            <Input
              name="totalPrice"
              value={form.totalPrice || ""}
              onChange={handleChange}
              type="number"
              placeholder="Prix total (€)"
            />
            <Input
              name="notes"
              value={form.notes || ""}
              onChange={handleChange}
              placeholder="Notes"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPackageDialog;
