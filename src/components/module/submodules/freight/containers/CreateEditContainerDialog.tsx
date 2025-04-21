
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";

// Types simplifiés pour adapter à la maquette (adapter ou importer selon votre modèle)
interface Option {
  label: string;
  value: string;
  [key: string]: any;
}

interface CreateEditContainerDialogProps {
  open: boolean;
  onClose: () => void;
  container?: any; // Si édition, pré-rempli ; sinon création vide
  carrierOptions: Option[];
  clientOptions: Option[];
  routeOptions: Option[];
  defaultNumber?: string; // Pour autogénération côté parent
}

const containerTypes = [
  { label: "Standard", value: "standard" },
  { label: "Réfrigéré (Reefer)", value: "reefer" },
  { label: "Citerne", value: "tank" },
  { label: "Open Top", value: "open-top" },
];

const containerSizes = [
  { label: "20 pieds", value: "20ft" },
  { label: "40 pieds", value: "40ft" },
];

const statusOptions = [
  { label: "En transit", value: "en_transit" },
  { label: "En attente", value: "en_attente" },
  { label: "Livré", value: "livre" },
  { label: "Retardé", value: "retarde" },
];

function getInitialValue<T = string>(preset: T | undefined, fallback: T) {
  return preset !== undefined && preset !== null ? preset : fallback;
}

const CreateEditContainerDialog: React.FC<CreateEditContainerDialogProps> = ({
  open,
  onClose,
  container,
  carrierOptions,
  clientOptions,
  routeOptions,
  defaultNumber,
}) => {
  const isEdit = Boolean(container);

  // Etats contrôlés du formulaire
  const [number, setNumber] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [carrier, setCarrier] = useState<string>("");
  const [client, setClient] = useState<string>("");
  const [route, setRoute] = useState<string>("");
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [departureDate, setDepartureDate] = useState<Date | undefined>();
  const [arrivalDate, setArrivalDate] = useState<Date | undefined>();

  // Reset & pré-remplissage selon mode (create/edit)
  useEffect(() => {
    if (open) {
      if (isEdit && container) {
        setNumber(getInitialValue(container.number, ""));
        setType(getInitialValue(container.type, ""));
        setSize(getInitialValue(container.size, ""));
        setStatus(getInitialValue(container.status, ""));
        setCarrier(getInitialValue(container.carrierId, ""));
        setClient(getInitialValue(container.clientId, ""));
        setRoute(getInitialValue(container.routeId, ""));
        setOrigin(getInitialValue(container.origin, ""));
        setDestination(getInitialValue(container.destination, ""));
        setDepartureDate(container.departureDate ? new Date(container.departureDate) : undefined);
        setArrivalDate(container.arrivalDate ? new Date(container.arrivalDate) : undefined);
      } else {
        // Vider et autogénérer pour nouveau conteneur
        setNumber(defaultNumber || "");
        setType("");
        setSize("");
        setStatus("");
        setCarrier("");
        setClient("");
        setRoute("");
        setOrigin("");
        setDestination("");
        setDepartureDate(undefined);
        setArrivalDate(undefined);
      }
    }
  }, [open, isEdit, container, defaultNumber]);

  // Image illustrative non incluse car ce n’est pas demandé (seulement UI form)

  // Soumission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO : envoyer les données au parent/serveur !
    onClose();
  };

  // Mise à jour dynamique de l'origine/destination selon la route sélectionnée
  useEffect(() => {
    if (route && routeOptions.length > 0) {
      const found = routeOptions.find((r) => r.value === route);
      if (found) {
        setOrigin(found.origin || "");
        setDestination(found.destination || "");
      }
    }
  }, [route, routeOptions]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[540px] px-2 py-2 pb-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold py-2">Nouveau conteneur</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 px-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Numéro */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Numéro de conteneur</label>
              <Input
                value={number}
                onChange={e => setNumber(e.target.value)}
                placeholder="ex: MSCU1234567"
                required
                className="bg-gray-50"
                maxLength={15}
                />
            </div>
            {/* Type */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Type</label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {containerTypes.map((opt) => (
                    <SelectItem value={opt.value} key={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Taille */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Taille</label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner taille" />
                </SelectTrigger>
                <SelectContent>
                  {containerSizes.map(opt => <SelectItem value={opt.value} key={opt.value}>{opt.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {/* Statut */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Statut</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner statut" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(opt => <SelectItem value={opt.value} key={opt.value}>{opt.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {/* Transporteur */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Transporteur</label>
              <Select value={carrier} onValueChange={setCarrier}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner transporteur" />
                </SelectTrigger>
                <SelectContent>
                  {carrierOptions.map(opt => <SelectItem value={opt.value} key={opt.value}>{opt.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {/* Client */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Client</label>
              <Select value={client} onValueChange={setClient}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner client" />
                </SelectTrigger>
                <SelectContent>
                  {clientOptions.map(opt => <SelectItem value={opt.value} key={opt.value}>{opt.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {/* Route */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-1">Route</label>
              <Select value={route} onValueChange={setRoute}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la route" />
                </SelectTrigger>
                <SelectContent>
                  {routeOptions.map(opt => (
                    <SelectItem value={opt.value} key={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Origine */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Origine</label>
              <Input value={origin} onChange={e => setOrigin(e.target.value)} placeholder="Ex: CAMEROUN" required />
            </div>
            {/* Destination */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Destination</label>
              <Input value={destination} onChange={e => setDestination(e.target.value)} placeholder="Ex: PARIS" required />
            </div>
            {/* Dates */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Date de départ</label>
              <DatePicker
                date={departureDate}
                onSelect={setDepartureDate}
                placeholder="Choisir la date"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Date d'arrivée prévue</label>
              <DatePicker
                date={arrivalDate}
                onSelect={setArrivalDate}
                placeholder="Choisir la date"
              />
            </div>
          </div>
          {/* Footer actions */}
          <div className="flex justify-end gap-2 pt-2 mt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
              {isEdit ? "Mettre à jour" : "Créer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default CreateEditContainerDialog;
