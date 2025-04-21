
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Container } from "@/types/freight";
import { updateDocument } from "@/hooks/firestore/update-operations";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  container: Container | null;
  onEdited?: () => void;
}

const ContainerEditDialog: React.FC<Props> = ({ open, onOpenChange, container, onEdited }) => {
  const [form, setForm] = React.useState<Partial<Container>>({});
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (open && container) {
      setForm(container);
    }
  }, [open, container]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!container?.id) return;
    
    setSubmitting(true);
    try {
      await updateDocument("freight-containers", container.id, form);
      toast.success("Conteneur mis à jour !");
      onEdited?.();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour.");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!container) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le conteneur</DialogTitle>
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
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" className="bg-blue-600 text-white" disabled={submitting}>
              {submitting ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContainerEditDialog;
