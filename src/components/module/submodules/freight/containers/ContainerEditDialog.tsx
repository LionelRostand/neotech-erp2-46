
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Container } from "@/types/freight";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  container: Container | null;
  onSubmit: (updated: Partial<Container>) => void;
  submitting: boolean;
}

const ContainerEditDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  container,
  onSubmit,
  submitting,
}) => {
  const [form, setForm] = React.useState<Partial<Container>>({});

  React.useEffect(() => {
    if (container) setForm(container);
  }, [container, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!container) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le conteneur</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 mb-2">
          <Input name="number" required placeholder="Numéro" value={form.number || ""} onChange={handleChange} />
          <Input name="type" required placeholder="Type" value={form.type || ""} onChange={handleChange} />
          <Input name="size" required placeholder="Taille" value={form.size || ""} onChange={handleChange} />
          <Input name="status" required placeholder="Statut" value={form.status || ""} onChange={handleChange} />
          <Input name="carrierName" required placeholder="Transporteur" value={form.carrierName || ""} onChange={handleChange} />
          <Input name="origin" required placeholder="Origine" value={form.origin || ""} onChange={handleChange} />
          <Input name="destination" required placeholder="Destination" value={form.destination || ""} onChange={handleChange} />
          <Input name="departureDate" required placeholder="Date départ" value={form.departureDate || ""} onChange={handleChange} />
          <Input name="arrivalDate" required placeholder="Date arrivée" value={form.arrivalDate || ""} onChange={handleChange} />
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Annuler</Button>
            <Button type="submit" className="bg-emerald-600 text-white" disabled={submitting}>
              {submitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContainerEditDialog;
