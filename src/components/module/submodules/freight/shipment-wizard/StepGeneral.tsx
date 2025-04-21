
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFreightClients } from "../hooks/useFreightClients";

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

  return (
    <form
      className="space-y-4"
      onSubmit={e => {
        e.preventDefault();
        next();
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          required
          name="reference"
          placeholder="Référence"
          value={form.reference}
          onChange={e => updateForm({ reference: e.target.value })}
        />
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
        <Input
          required
          name="origin"
          placeholder="Origine"
          value={form.origin}
          onChange={e => updateForm({ origin: e.target.value })}
        />
        <Input
          required
          name="destination"
          placeholder="Destination"
          value={form.destination}
          onChange={e => updateForm({ destination: e.target.value })}
        />
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
