
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFreightClients } from "../hooks/useFreightClients";

function generateReference() {
  return "EXP" + Math.floor(100000 + Math.random() * 900000);
}

const StepGeneral = ({
  form,
  updateForm,
  next,
  close,
  submitting,
}: {
  form: any;
  updateForm: (fields: any) => void;
  next: () => void;
  close: () => void;
  submitting: boolean;
}) => {
  const { clients, isLoading } = useFreightClients();

  // Auto-générer une référence si le champ est vide au chargement
  useEffect(() => {
    if (!form.reference) {
      updateForm({ reference: generateReference() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form
      className="space-y-4"
      onSubmit={e => {
        e.preventDefault();
        next();
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Champ Référence avec bouton de génération */}
        <div>
          <label className="block font-medium mb-1">Référence</label>
          <div className="flex gap-2">
            <Input
              required
              name="reference"
              placeholder="Référence"
              value={form.reference}
              onChange={e => updateForm({ reference: e.target.value })}
            />
            <Button
              type="button"
              size="sm"
              className="shrink-0"
              title="Générer une nouvelle référence"
              onClick={() => updateForm({ reference: generateReference() })}
            >
              Générer
            </Button>
          </div>
        </div>
        {/* Client expéditeur */}
        <div>
          <label className="block font-medium mb-1">Client</label>
          <select
            required
            name="customer"
            value={form.customer}
            onChange={e => updateForm({ customer: e.target.value })}
            className="w-full rounded-md border px-3 py-2 text-sm bg-white z-10"
            disabled={isLoading}
          >
            <option value="">Sélectionner un client</option>
            {isLoading ? (
              <option disabled>Chargement...</option>
            ) : clients && clients.length > 0 ? (
              clients.map((client: any) => (
                <option key={client.id} value={client.name}>
                  {client.name} {client.email ? `(${client.email})` : ""}
                </option>
              ))
            ) : (
              <option disabled>Aucun client trouvé</option>
            )}
          </select>
        </div>
        {/* Origine */}
        <div>
          <label className="block font-medium mb-1">Origine</label>
          <Input
            required
            name="origin"
            placeholder="Origine"
            value={form.origin}
            onChange={e => updateForm({ origin: e.target.value })}
          />
        </div>
        {/* Destination */}
        <div>
          <label className="block font-medium mb-1">Destination</label>
          <Input
            required
            name="destination"
            placeholder="Destination"
            value={form.destination}
            onChange={e => updateForm({ destination: e.target.value })}
          />
        </div>
      </div>
      {/* Ajout ici : Affichage résumé champs clés  */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <div>
          <div className="text-xs text-gray-500 mb-1">Type d'expédition</div>
          <div className="font-semibold">{form.shipmentType === "import" ? "Import" : form.shipmentType === "export" ? "Export" : form.shipmentType}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Statut actuel</div>
          <div className="font-semibold capitalize">{form.status === "draft" ? "Brouillon" : form.status}</div>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" type="button" onClick={close}>
          Annuler
        </Button>
        <Button type="submit" disabled={submitting}>
          Suivant
        </Button>
      </div>
    </form>
  );
};
export default StepGeneral;
