
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Carrier } from "@/types/freight";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { COLLECTIONS } from "@/lib/firebase-collections";

interface EditCarrierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  carrier: Carrier | null;
  onUpdated?: () => void;
}

const EditCarrierDialog: React.FC<EditCarrierDialogProps> = ({ open, onOpenChange, carrier, onUpdated }) => {
  const [form, setForm] = useState<Carrier | null>(carrier);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    setForm(carrier);
  }, [carrier, open]);
  
  if (!form) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => prev ? { ...prev, [name]: type === "checkbox" ? checked : value } : prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, COLLECTIONS.FREIGHT.CARRIERS, form.id), {
        ...form
      });
      toast.success("Transporteur mis à jour !");
      onOpenChange(false);
      onUpdated?.();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le Transporteur</DialogTitle>
          <DialogDescription>
            Modifiez les informations du transporteur puis sauvegardez.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Input
            label="Nom"
            name="name"
            value={form.name}
            onChange={handleChange}
            disabled={loading}
            required
          />
          <Input
            label="Code"
            name="code"
            value={form.code}
            onChange={handleChange}
            disabled={loading}
            required
          />
          <Input
            label="Type"
            name="type"
            value={form.type}
            onChange={handleChange}
            disabled={loading}
            required
          />
          <Input
            label="Contact"
            name="contactName"
            value={form.contactName || ""}
            onChange={handleChange}
            disabled={loading}
          />
          <Input
            label="Email"
            name="contactEmail"
            value={form.contactEmail || ""}
            onChange={handleChange}
            disabled={loading}
            type="email"
          />
          <Input
            label="Téléphone"
            name="contactPhone"
            value={form.contactPhone || ""}
            onChange={handleChange}
            disabled={loading}
            type="tel"
          />
          <div className="flex items-center gap-2">
            <Switch
              id="carrier-active"
              checked={form.active}
              name="active"
              onCheckedChange={(checked: boolean) => setForm(prev => prev ? { ...prev, active: checked } : prev)}
              disabled={loading}
            />
            <label htmlFor="carrier-active" className="text-sm">Actif</label>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)} disabled={loading}>
              Annuler
            </Button>
            <Button type="submit" loading={loading}>
              {loading ? "Mise à jour..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCarrierDialog;
