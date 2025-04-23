
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

const typeOptions = [
  { label: "National", value: "national" },
  { label: "International", value: "international" },
  { label: "Local", value: "local" },
];

interface CreateCarrierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

const CreateCarrierDialog: React.FC<CreateCarrierDialogProps> = ({
  open,
  onOpenChange,
  onCreated
}) => {
  const [carrier, setCarrier] = useState({
    name: "",
    code: "",
    type: "national",
    active: true,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCarrier((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSwitch = (checked: boolean) => {
    setCarrier((prev) => ({ ...prev, active: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!carrier.name || !carrier.code) {
      toast.error("Tous les champs sont requis !");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "freight_carriers"), {
        ...carrier,
        active: !!carrier.active,
      });
      toast.success("Transporteur ajouté !");
      setCarrier({ name: "", code: "", type: "national", active: true });
      onOpenChange(false);
      onCreated?.();
    } catch {
      toast.error("Erreur lors de l'ajout");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    // Reset on close
    if (!open) setCarrier({ name: "", code: "", type: "national", active: true });
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un transporteur</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Nom *</label>
            <Input name="name" value={carrier.name} onChange={handleChange} required />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Code *</label>
            <Input name="code" value={carrier.code} onChange={handleChange} required />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Type</label>
            <select name="type" value={carrier.type} onChange={handleChange} className="border px-3 py-2 rounded w-full">
              {typeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={!!carrier.active} onCheckedChange={handleSwitch} id="active" />
            <label htmlFor="active" className="text-sm">Actif</label>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>
              Annuler
            </Button>
            <Button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white" disabled={loading}>
              {loading ? "Ajout..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCarrierDialog;
