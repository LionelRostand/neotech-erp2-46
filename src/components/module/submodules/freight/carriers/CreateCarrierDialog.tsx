
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Carrier } from "@/types/freight";

interface CreateCarrierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (carrier: Carrier) => void;
}

const defaultCarrier: Partial<Carrier> = {
  name: "",
  code: "",
  type: "national",
  contactName: "",
  contactEmail: "",
  active: true,
};

const typeOptions = [
  { label: "National", value: "national" },
  { label: "International", value: "international" },
  { label: "Local", value: "local" },
];

const CreateCarrierDialog: React.FC<CreateCarrierDialogProps> = ({
  open,
  onOpenChange,
  onCreated,
}) => {
  const [carrier, setCarrier] = useState<Partial<Carrier>>(defaultCarrier);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCarrier((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSwitch = (val: boolean) => {
    setCarrier((prev) => ({ ...prev, active: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Valider champs minimaux
    if (!carrier.name || !carrier.code || !carrier.type) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "freight_carriers"), {
        ...carrier,
        active: !!carrier.active,
      });
      const newCarrier = { ...(carrier as Carrier), id: docRef.id };
      toast.success("Transporteur ajouté !");
      onCreated?.(newCarrier);
      setCarrier(defaultCarrier);
      onOpenChange(false);
    } catch (err) {
      toast.error("Erreur lors de l'ajout du transporteur.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!open) setCarrier(defaultCarrier);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer un nouveau transporteur</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Nom <span className="text-red-500">*</span></label>
            <Input name="name" value={carrier.name || ""} onChange={handleChange} required />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Code <span className="text-red-500">*</span></label>
            <Input name="code" value={carrier.code || ""} onChange={handleChange} required />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Type <span className="text-red-500">*</span></label>
            <select
              className="border px-3 py-2 rounded w-full mt-1"
              name="type"
              value={carrier.type}
              onChange={handleChange}
              required
            >
              {typeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Nom du contact</label>
            <Input name="contactName" value={carrier.contactName || ""} onChange={handleChange} />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Email du contact</label>
            <Input name="contactEmail" value={carrier.contactEmail || ""} onChange={handleChange} />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={!!carrier.active} onCheckedChange={handleSwitch} id="active" />
            <label htmlFor="active" className="text-sm">Actif</label>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading} className="bg-green-700 hover:bg-green-800 text-white">
              {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCarrierDialog;
