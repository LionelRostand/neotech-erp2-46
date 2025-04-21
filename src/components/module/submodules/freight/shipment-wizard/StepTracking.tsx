
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const statusOptions = [
  { value: "draft", label: "Brouillon" },
  { value: "confirmed", label: "Confirmée" },
  { value: "in_transit", label: "En transit" },
  { value: "delivered", label: "Livrée" },
  { value: "cancelled", label: "Annulée" },
  { value: "delayed", label: "Retard" },
];

const typeOptions = [
  { value: "road", label: "Route" },
  { value: "sea", label: "Mer" },
  { value: "air", label: "Air" },
  { value: "rail", label: "Rail" },
  { value: "multimodal", label: "Multimodal" },
];

const StepTracking = ({
  form,
  updateTracking,
  create,
  prev,
  close,
  submitting,
}: {
  form: any;
  updateTracking: (tracking: any) => void;
  create: () => void;
  prev: () => void;
  close: () => void;
  submitting: boolean;
}) => {
  const { tracking } = form;
  return (
    <form
      className="space-y-4"
      onSubmit={e => {
        e.preventDefault();
        create();
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-medium mb-1 block">Numéro de suivi</label>
          <div className="flex items-center gap-2">
            <Input value={tracking.trackingNumber} readOnly className="bg-gray-100" />
            <Button
              type="button"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(tracking.trackingNumber);
              }}
              variant="outline"
            >Copier</Button>
          </div>
        </div>
        <div>
          <label className="font-medium mb-1 block">Statut</label>
          <select
            value={form.status}
            onChange={e => updateTracking({ ...tracking, status: e.target.value })}
            className="rounded-md border px-3 py-2 bg-white w-full"
          >
            {statusOptions.map(opt => (
              <option value={opt.value} key={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-medium mb-1 block">Route</label>
          <Input
            value={tracking.route}
            onChange={e => updateTracking({ ...tracking, route: e.target.value })}
            placeholder="Sélectionner une route"
          />
        </div>
        <div>
          <label className="font-medium mb-1 block">Type de transport</label>
          <select
            value={tracking.transportType}
            onChange={e => updateTracking({ ...tracking, transportType: e.target.value })}
            className="rounded-md border px-3 py-2 bg-white w-full"
          >
            {typeOptions.map(opt => (
              <option value={opt.value} key={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-medium mb-1 block">Délai de transit (heures)</label>
          <Input
            type="number"
            min="0"
            value={tracking.estimatedTime}
            onChange={e => updateTracking({ ...tracking, estimatedTime: parseInt(e.target.value) || 0 })}
            placeholder="Délai de transit (heures)"
          />
        </div>
        <div>
          <label className="font-medium mb-1 block">Distance (km)</label>
          <Input
            type="number"
            min="0"
            value={tracking.distance}
            onChange={e => updateTracking({ ...tracking, distance: parseFloat(e.target.value) || 0 })}
            placeholder="Distance (km)"
          />
        </div>
      </div>
      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-md px-4 py-3 text-blue-800 mt-2 text-xs">
        <strong>Suivi en temps réel</strong> <br />
        Un lien de suivi sera généré automatiquement après la création de l&apos;expédition.
        Les clients pourront accéder au suivi en temps réel via le code de suivi.
      </div>
      <div className="flex gap-2 pt-4 justify-end">
        <Button type="button" variant="outline" onClick={prev}>
          Précédent
        </Button>
        <Button type="button" variant="ghost" onClick={close}>
          Annuler
        </Button>
        <Button type="submit" className="bg-emerald-600 text-white px-6" disabled={submitting}>
          Créer l&apos;expédition
        </Button>
      </div>
    </form>
  );
};
export default StepTracking;
