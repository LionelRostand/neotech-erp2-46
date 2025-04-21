
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Container } from "@/types/freight";
import { addDocument } from "@/hooks/firestore/create-operations";
import { toast } from "sonner";

/**
 * Props:
 * - open: boolean d'ouverture du dialog
 * - onOpenChange: callback pour fermer ou ouvrir le dialog
 * - onCreated: callback appelé après création (peut rafraîchir la liste)
 */
interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (container: Container) => void;
}

const initialForm: Partial<Container> = {
  number: "",
  type: "",
  size: "",
  status: "",
  carrierName: "",
  origin: "",
  destination: "",
  departureDate: "",
  arrivalDate: "",
  location: "",
  client: "",
  departure: "",
  arrival: "",
};

const ContainerCreateDialog: React.FC<Props> = ({ open, onOpenChange, onCreated }) => {
  const [form, setForm] = React.useState<Partial<Container>>(initialForm);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (open) setForm(initialForm);
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const created = await addDocument("freight-containers", form);
      toast.success("Conteneur enregistré !");
      onCreated?.(created as Container);
      onOpenChange(false);
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un conteneur</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 mb-2">
          <Input name="number" required placeholder="Numéro" value={form.number || ""} onChange={handleChange} label="Numéro" />
          <Input name="type" required placeholder="Type" value={form.type || ""} onChange={handleChange} label="Type" />
          <Input name="size" required placeholder="Taille" value={form.size || ""} onChange={handleChange} label="Taille" />
          <Input name="status" required placeholder="Statut" value={form.status || ""} onChange={handleChange} label="Statut" />
          <Input name="carrierName" required placeholder="Transporteur" value={form.carrierName || ""} onChange={handleChange} label="Transporteur" />
          <Input name="origin" required placeholder="Origine" value={form.origin || ""} onChange={handleChange} label="Origine" />
          <Input name="destination" required placeholder="Destination" value={form.destination || ""} onChange={handleChange} label="Destination" />
          <Input name="departureDate" required placeholder="Date départ" value={form.departureDate || ""} onChange={handleChange} label="Date départ" />
          <Input name="arrivalDate" required placeholder="Date arrivée" value={form.arrivalDate || ""} onChange={handleChange} label="Date arrivée" />
          {/* Champs additionnels pour cohérence typing mais optionnels/masqués */}
          {/* <Input name="location" placeholder="Emplacement" value={form.location || ""} onChange={handleChange} /> */}
          {/* <Input name="client" placeholder="Client" value={form.client || ""} onChange={handleChange} /> */}
          {/* <Input name="departure" placeholder="Départ" value={form.departure || ""} onChange={handleChange} /> */}
          {/* <Input name="arrival" placeholder="Arrivée" value={form.arrival || ""} onChange={handleChange} /> */}
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" className="bg-emerald-600 text-white" disabled={submitting}>
              {submitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContainerCreateDialog;
