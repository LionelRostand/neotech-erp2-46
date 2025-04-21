
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFreightClients } from "@/components/module/submodules/freight/hooks/useFreightClients";
import { toast } from "sonner";

const EXP_PREFIX = "EXP-";
const DEFAULT_FORM = {
  reference: EXP_PREFIX,
  customer: "",
  shipmentType: "local",
  origin: "",
  destination: "",
  carrier: "",
  carrierName: "",
  scheduledDate: "",
  estimatedDeliveryDate: "",
  status: "draft",
  totalWeight: 0,
  trackingNumber: "",
  notes: "",
  lines: [],
};

const SHIPMENT_TYPES = [
  { value: "local", label: "Local" },
  { value: "international", label: "International" },
  { value: "import", label: "Import" },
  { value: "export", label: "Export" },
];

interface ShipmentWizardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TABS = [
  { label: "Informations générales", key: "general" },
  { label: "Articles", key: "articles" },
  { label: "Tarification", key: "pricing" },
  { label: "Suivi & Route", key: "tracking" },
];

const ShipmentWizardDialog: React.FC<ShipmentWizardDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [tab, setTab] = useState("general");
  const [submitting, setSubmitting] = useState(false);

  const { clients, isLoading: clientsLoading } = useFreightClients();

  // Handlers
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleReset = () => setForm(DEFAULT_FORM);

  const handleClose = () => {
    handleReset();
    setTab("general");
    onOpenChange(false);
  };

  const handleNext = () => {
    if (tab === "general") setTab("articles");
    else if (tab === "articles") setTab("pricing");
    else if (tab === "pricing") setTab("tracking");
    // add logic to submit at the last step if needed
  };

  // Layout
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nouvelle Expédition</DialogTitle>
        </DialogHeader>
        {/* Onglets */}
        <div className="flex space-x-2 mb-5">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`flex-1 py-2 text-sm font-medium border-b-2 transition-all ${
                tab === t.key
                  ? "border-emerald-500 text-emerald-700 bg-emerald-50"
                  : "border-transparent text-gray-500 bg-transparent hover:bg-muted"
              } rounded-t-md`}
              onClick={() => setTab(t.key)}
              type="button"
            >
              {t.label}
            </button>
          ))}
        </div>
        {/* Onglet principal */}
        {tab === "general" && (
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-5"
            onSubmit={(e) => {
              e.preventDefault();
            }}
            autoComplete="off"
          >
            {/* Référence */}
            <div>
              <label className="font-medium mb-1 block">Référence</label>
              <Input
                name="reference"
                value={form.reference}
                onChange={handleChange}
                required
                placeholder="EXP-"
                className="w-full"
                autoFocus
              />
            </div>
            {/* Client */}
            <div>
              <label className="font-medium mb-1 block">Client</label>
              <select
                required
                name="customer"
                className="w-full rounded-md border px-3 py-2 text-sm bg-white z-50"
                value={form.customer}
                onChange={handleChange}
                disabled={clientsLoading}
              >
                <option value="">Nom du client</option>
                {clientsLoading && (
                  <option disabled value="">
                    Chargement...
                  </option>
                )}
                {!clientsLoading &&
                  clients.map((client) => (
                    <option key={client.id} value={client.name}>
                      {client.name}
                      {client.email ? ` (${client.email})` : ""}
                    </option>
                  ))}
                {!clientsLoading && clients.length === 0 && (
                  <option disabled value="">
                    Aucun client trouvé
                  </option>
                )}
              </select>
            </div>
            {/* Type d'expédition */}
            <div>
              <label className="font-medium mb-1 block">Type d’expédition</label>
              <select
                required
                name="shipmentType"
                className="w-full rounded-md border px-3 py-2 text-sm bg-white"
                value={form.shipmentType}
                onChange={handleChange}
              >
                {SHIPMENT_TYPES.map((option) => (
                  <option value={option.value} key={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {/* Transporteur */}
            <div>
              <label className="font-medium mb-1 block">Transporteur</label>
              <Input
                name="carrier"
                value={form.carrier}
                onChange={handleChange}
                placeholder="Sélectionner un transporteur"
              />
            </div>
            {/* Origine */}
            <div>
              <label className="font-medium mb-1 block">Origine</label>
              <Input
                name="origin"
                value={form.origin}
                onChange={handleChange}
                placeholder="Adresse d'origine"
                required
              />
            </div>
            {/* Destination */}
            <div>
              <label className="font-medium mb-1 block">Destination</label>
              <Input
                name="destination"
                value={form.destination}
                onChange={handleChange}
                placeholder="Adresse de destination"
                required
              />
            </div>
            {/* Date d'expédition */}
            <div>
              <label className="font-medium mb-1 block">Date d'expédition</label>
              <Input
                name="scheduledDate"
                type="date"
                value={form.scheduledDate}
                onChange={handleChange}
                placeholder="jj/mm/aaaa"
              />
            </div>
            {/* Date de livraison estimée */}
            <div>
              <label className="font-medium mb-1 block">
                Date de livraison estimée
              </label>
              <Input
                name="estimatedDeliveryDate"
                type="date"
                value={form.estimatedDeliveryDate}
                onChange={handleChange}
                placeholder="jj/mm/aaaa"
              />
            </div>
            {/* Notes (zone sur deux colonnes) */}
            <div className="md:col-span-2">
              <label className="font-medium mb-1 block">Notes</label>
              <Textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Informations complémentaires sur l'expédition..."
                rows={2}
              />
            </div>
            {/* Bouton suivant aligné à droite */}
            <div className="md:col-span-2 flex justify-end pt-2">
              <Button
                type="button"
                onClick={handleNext}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Suivant
              </Button>
            </div>
          </form>
        )}

        {tab === "articles" && (
          <div className="p-4 text-center text-muted-foreground">
            (Zone « Articles » à implémenter)
            <div className="mt-6 flex justify-between">
              <Button variant="secondary" type="button" onClick={() => setTab("general")}>
                Précédent
              </Button>
              <Button type="button" onClick={handleNext}>
                Suivant
              </Button>
            </div>
          </div>
        )}
        {tab === "pricing" && (
          <div className="p-4 text-center text-muted-foreground">
            (Zone « Tarification » à implémenter)
            <div className="mt-6 flex justify-between">
              <Button variant="secondary" type="button" onClick={() => setTab("articles")}>
                Précédent
              </Button>
              <Button type="button" onClick={handleNext}>
                Suivant
              </Button>
            </div>
          </div>
        )}
        {tab === "tracking" && (
          <div className="p-4 text-center text-muted-foreground">
            (Zone « Suivi & Route » à implémenter)
            <div className="mt-6 flex justify-between">
              <Button variant="secondary" type="button" onClick={() => setTab("pricing")}>
                Précédent
              </Button>
              <Button type="button" variant="default" onClick={handleClose}>
                Terminer
              </Button>
            </div>
          </div>
        )}
        {/* Fermeture / Annulation */}
        <div className="mt-3 flex justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            className="mr-2"
          >
            Annuler
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShipmentWizardDialog;
