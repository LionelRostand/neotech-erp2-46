
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ContainerTabs from "./ContainerTabs";

const initialForm = {
  number: "",
  type: "",
  size: "",
  status: "",
  carrierName: "",
  client: "",
  origin: "",
  destination: "",
  departureDate: "",
  arrivalDate: "",
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewContainerDialogWithTabs: React.FC<Props> = ({ open, onOpenChange }) => {
  const [tab, setTab] = useState<"info" | "articles" | "pricing">("info");
  const [form, setForm] = useState(initialForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  // Pour l'instant, l'envoi ne fait qu'un reset
  const handleCreate = () => {
    setForm(initialForm);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Nouveau conteneur</DialogTitle>
        </DialogHeader>
        <ContainerTabs tab={tab} setTab={setTab} />
        <div>
          {tab === "info" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Référence</label>
                <input className="w-full border rounded px-3 py-2" name="number" value={form.number} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Type</label>
                <input className="w-full border rounded px-3 py-2" name="type" value={form.type} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Taille</label>
                <input className="w-full border rounded px-3 py-2" name="size" value={form.size} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Statut</label>
                <input className="w-full border rounded px-3 py-2" name="status" value={form.status} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Transporteur</label>
                <input className="w-full border rounded px-3 py-2" name="carrierName" value={form.carrierName} onChange={handleChange} placeholder="ex: TEST-TRANSPORT" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Client</label>
                <input className="w-full border rounded px-3 py-2" name="client" value={form.client} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Origine</label>
                <input className="w-full border rounded px-3 py-2" name="origin" value={form.origin} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Destination</label>
                <input className="w-full border rounded px-3 py-2" name="destination" value={form.destination} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Date départ</label>
                <input type="date" className="w-full border rounded px-3 py-2" name="departureDate" value={form.departureDate} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Date arrivée</label>
                <input type="date" className="w-full border rounded px-3 py-2" name="arrivalDate" value={form.arrivalDate} onChange={handleChange} />
              </div>
            </div>
          )}
          {tab === "articles" && (
            <div className="py-8 text-gray-400 text-center">
              Articles (à implémenter)
            </div>
          )}
          {tab === "pricing" && (
            <div className="py-8 text-gray-400 text-center">
              Tarification (à implémenter)
            </div>
          )}
        </div>
        <DialogFooter className="pt-5">
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button onClick={handleCreate} type="button">
            Créer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewContainerDialogWithTabs;
