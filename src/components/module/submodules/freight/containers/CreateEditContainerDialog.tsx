
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/patched-select";
import { COLLECTIONS } from "@/lib/firebase-collections";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { addDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import type { Container } from "@/types/freight";

interface CreateEditContainerDialogProps {
  open: boolean;
  onClose: () => void;
  container: Container | null;
  carrierOptions: { label: string, value: string }[];
  clientOptions: { label: string, value: string }[];
  routeOptions: { label: string, value: string; origin: string; destination: string }[];
}

const genContainerNumber = () => "CONT" + Math.floor(100000 + Math.random() * 900000);

const initialForm = {
  number: genContainerNumber(),
  type: '',
  size: '',
  status: '',
  carrierName: '',
  carrierId: '',
  client: '',
  routeId: '',
  origin: '',
  destination: ''
};

const CreateEditContainerDialog: React.FC<CreateEditContainerDialogProps> = ({
  open, onClose, container, carrierOptions, clientOptions, routeOptions
}) => {
  const [form, setForm] = useState<any>(initialForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (container) {
      setForm(container);
    } else {
      setForm({ ...initialForm, number: genContainerNumber() });
    }
  }, [container, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSelect = (name: string, value: string) => {
    setForm((prev: any) => ({ ...prev, [name]: value }));
    if (name === "routeId") {
      // Trouver origine/destination depuis l'option route sélectionnée
      const found = routeOptions.find((r) => r.value === value);
      setForm((prev: any) => ({
        ...prev,
        origin: found?.origin || "",
        destination: found?.destination || ""
      }));
    }
    if (name === "carrierId") {
      const foundCarrier = carrierOptions.find(c => c.value === value);
      setForm((prev: any) => ({
        ...prev,
        carrierName: foundCarrier?.label || ""
      }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (container && container.id) {
        // MAJ
        await updateDoc(doc(db, COLLECTIONS.FREIGHT.CONTAINERS, container.id), form);
        toast.success("Conteneur mis à jour !");
      } else {
        // Création avec nouveau numéro
        await addDoc(collection(db, COLLECTIONS.FREIGHT.CONTAINERS), {
          ...form,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        toast.success("Conteneur créé !");
      }
      onClose();
    } catch (err: any) {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>{container ? "Modifier le Conteneur" : "Nouveau Conteneur"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1">Numéro</label>
            <Input name="number" value={form.number} disabled className="bg-muted" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Type</label>
            <Input name="type" value={form.type} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Taille</label>
            <Input name="size" value={form.size} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Status</label>
            <Input name="status" value={form.status} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Transporteur</label>
            <Select value={form.carrierId} onValueChange={v => handleSelect("carrierId", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un transporteur" />
              </SelectTrigger>
              <SelectContent>
                {carrierOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Client</label>
            <Select value={form.client} onValueChange={v => handleSelect("client", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                {clientOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Route</label>
            <Select value={form.routeId} onValueChange={v => handleSelect("routeId", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une route" />
              </SelectTrigger>
              <SelectContent>
                {routeOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="block text-xs font-medium mb-1">Origine</label>
              <Input name="origin" value={form.origin} disabled className="bg-muted" />
            </div>
            <div className="w-1/2">
              <label className="block text-xs font-medium mb-1">Destination</label>
              <Input name="destination" value={form.destination} disabled className="bg-muted" />
            </div>
          </div>
          <DialogFooter className="mt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Annuler
            </Button>
            <Button type="submit" loading={saving.toString()} disabled={saving}>
              {saving ? "Enregistrement..." : (container ? "Mettre à jour" : "Enregistrer")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEditContainerDialog;
