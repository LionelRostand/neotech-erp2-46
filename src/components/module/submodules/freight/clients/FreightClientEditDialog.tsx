
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FreightClient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: FreightClient | null;
  onSubmit: (values: Partial<FreightClient>) => void;
  submitting: boolean;
};

const FreightClientEditDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  client,
  onSubmit,
  submitting
}) => {
  const [form, setForm] = React.useState<Partial<FreightClient>>({});

  React.useEffect(() => {
    if (client) setForm(client);
  }, [client, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.address) return;
    onSubmit(form);
  };

  if (!client) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleFormSubmit} className="space-y-3 mb-2">
          <Input name="name" required placeholder="Nom" value={form.name || ""} onChange={handleChange} />
          <Input name="email" required placeholder="Email" value={form.email || ""} onChange={handleChange} />
          <Input name="phone" required placeholder="Téléphone" value={form.phone || ""} onChange={handleChange} />
          <Input name="address" required placeholder="Adresse" value={form.address || ""} onChange={handleChange} />
          <Input name="notes" placeholder="Notes" value={form.notes || ""} onChange={handleChange} />
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

export default FreightClientEditDialog;
