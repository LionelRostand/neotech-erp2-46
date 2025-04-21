
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useAddContainer, useUpdateContainer } from "@/hooks/modules/useContainersFirestore";
import { toast } from "sonner";

// Options statiques pour correspondre à la maquette
const TYPES = [
  { value: "Reefer", label: "Réfrigéré (Reefer)" },
  { value: "Standard", label: "Standard" },
  { value: "OpenTop", label: "Toit ouvert" },
  { value: "FlatRack", label: "Flat Rack" },
];
const SIZES = [
  { value: "20 pieds", label: "20 pieds" },
  { value: "40 pieds", label: "40 pieds" },
];
const STATUS = [
  { value: "En transit", label: "En transit" },
  { value: "Arrivé", label: "Arrivé" },
  { value: "Bloqué", label: "Bloqué" },
  { value: "Livré", label: "Livré" },
];
const CARRIERS = [
  { value: "TEST-TRANSPORT", label: "TEST-TRANSPORT" },
  { value: "CMA CGM", label: "CMA CGM" },
  { value: "MAERSK", label: "MAERSK" },
];
const CLIENTS = [
  { value: "DJOSSA LIONEL", label: "DJOSSA LIONEL" },
  { value: "SOCAPALM", label: "SOCAPALM" },
  { value: "TRANSAFRIC", label: "TRANSAFRIC" },
];
const ROUTES = [
  { value: "CAMEROUN-PARIS (CAMEROUN)", label: "CAMEROUN-PARIS (CAMEROUN)" },
  { value: "DLA-ABJ", label: "DLA-ABJ" },
];

function generateContainerNumber() {
  // MSCU + 7 chiffres aléatoires
  return `MSCU${Math.floor(1000000 + Math.random() * 9000000)}`;
}

const defaultForm = {
  number: "",
  type: TYPES[0]?.value || "",
  size: SIZES[0]?.value || "",
  status: STATUS[0]?.value || "",
  carrierName: CARRIERS[0]?.value || "",
  client: CLIENTS[0]?.value || "",
  origin: "",
  destination: "",
  route: ROUTES[0]?.value || "",
  departureDate: undefined,
  arrivalDate: undefined,
};

const CreateEditContainerDialog = ({
  open,
  onClose,
  onSave,
  container,
  defaultNumber,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  container: any | null;
  defaultNumber: string;
}) => {
  const [form, setForm] = useState<any>(defaultForm);

  useEffect(() => {
    if (open) {
      if (container) {
        setForm({
          ...defaultForm,
          ...container,
        });
      } else {
        setForm({
          ...defaultForm,
          number: defaultNumber || generateContainerNumber(),
        });
      }
    }
    // eslint-disable-next-line
  }, [open, container, defaultNumber]);

  // Champs handlers
  const handleField = (field: string, value: any) => setForm((prev: any) => ({ ...prev, [field]: value }));

  // Validation simple
  const validate = () => {
    if (!form.number?.trim()) return toast.error("Le numéro de conteneur est requis");
    if (!form.type) return toast.error("Le type est requis");
    if (!form.size) return toast.error("La taille est requise");
    if (!form.status) return toast.error("Le statut est requis");
    if (!form.carrierName) return toast.error("Le transporteur est requis");
    if (!form.client) return toast.error("Le client est requis");
    if (!form.origin?.trim()) return toast.error("L'origine est requise");
    if (!form.destination?.trim()) return toast.error("La destination est requise");
    if (!form.route) return toast.error("La route est requise");
    if (!form.departureDate) return toast.error("Date de départ requise");
    if (!form.arrivalDate) return toast.error("Date d'arrivée requise");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (container) {
      // Edition : On délègue au parent l'appel mutation d'update (pour homogénéité !)
      onSave({ ...form, id: container.id });
    } else {
      onSave(form);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Nouveau conteneur</DialogTitle>
            <DialogDescription className="text-sm">Remplissez les informations du conteneur.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {/* Numéro */}
            <div>
              <label className="text-sm font-medium mb-1 block">Numéro de conteneur</label>
              <Input
                placeholder="ex: MSCU1234567"
                value={form.number || ""}
                onChange={(e) => handleField("number", e.target.value)}
                required
                autoFocus
                className="bg-white"
              />
            </div>
            {/* Type */}
            <div>
              <label className="text-sm font-medium mb-1 block">Type</label>
              <Select value={form.type} onValueChange={val => handleField("type", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map(option => (
                    <SelectItem value={option.value} key={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Taille */}
            <div>
              <label className="text-sm font-medium mb-1 block">Taille</label>
              <Select value={form.size} onValueChange={val => handleField("size", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Taille" />
                </SelectTrigger>
                <SelectContent>
                  {SIZES.map(option => (
                    <SelectItem value={option.value} key={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Statut */}
            <div>
              <label className="text-sm font-medium mb-1 block">Statut</label>
              <Select value={form.status} onValueChange={val => handleField("status", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS.map(option => (
                    <SelectItem value={option.value} key={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Transporteur */}
            <div>
              <label className="text-sm font-medium mb-1 block">Transporteur</label>
              <Select value={form.carrierName} onValueChange={val => handleField("carrierName", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Transporteur" />
                </SelectTrigger>
                <SelectContent>
                  {CARRIERS.map(option => (
                    <SelectItem value={option.value} key={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Client */}
            <div>
              <label className="text-sm font-medium mb-1 block">Client</label>
              <Select value={form.client} onValueChange={val => handleField("client", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Client" />
                </SelectTrigger>
                <SelectContent>
                  {CLIENTS.map(option => (
                    <SelectItem value={option.value} key={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Route */}
            <div>
              <label className="text-sm font-medium mb-1 block">Route</label>
              <Select value={form.route} onValueChange={val => handleField("route", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Route" />
                </SelectTrigger>
                <SelectContent>
                  {ROUTES.map(option => (
                    <SelectItem value={option.value} key={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Origine */}
            <div>
              <label className="text-sm font-medium mb-1 block">Origine</label>
              <Input
                placeholder="CAMEROUN"
                value={form.origin || ""}
                onChange={e => handleField("origin", e.target.value)}
                className="bg-white"
              />
            </div>
            {/* Destination */}
            <div>
              <label className="text-sm font-medium mb-1 block">Destination</label>
              <Input
                placeholder="PARIS"
                value={form.destination || ""}
                onChange={e => handleField("destination", e.target.value)}
                className="bg-white"
              />
            </div>
            {/* Date de départ */}
            <div>
              <label className="text-sm font-medium mb-1 block">Date de départ</label>
              <DatePicker
                date={form.departureDate ? new Date(form.departureDate) : undefined}
                onSelect={date => handleField("departureDate", date ? date.toISOString() : undefined)}
                placeholder="Date de départ"
                className="w-full"
              />
            </div>
            {/* Date d'arrivée prévue */}
            <div>
              <label className="text-sm font-medium mb-1 block">Date d'arrivée prévue</label>
              <DatePicker
                date={form.arrivalDate ? new Date(form.arrivalDate) : undefined}
                onSelect={date => handleField("arrivalDate", date ? date.toISOString() : undefined)}
                placeholder="Date d'arrivée"
                className="w-full"
              />
            </div>
          </div>
          <DialogFooter className="pt-6">
            <Button variant="outline" type="button" onClick={onClose}>Annuler</Button>
            <Button type="submit" className="bg-green-600 text-white hover:bg-green-700" disabled={false}>
              {container ? "Enregistrer" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEditContainerDialog;
