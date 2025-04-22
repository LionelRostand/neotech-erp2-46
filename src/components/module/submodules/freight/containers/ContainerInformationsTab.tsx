
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";

interface Props {
  values: any;
  onChange: (field: string, value: any) => void;
  transporteurs?: { id: string; name: string }[];
  clients?: { id: string; name: string }[];
  routes?: { id: string; name: string; origin: string; destination: string }[];
  types?: { type: string; size: string }[];
}

// Liste des statuts classiques pour un conteneur
const STATUTS = [
  { value: "", label: "Sélectionner" },
  { value: "vide", label: "Vide" },
  { value: "chargement", label: "En chargement" },
  { value: "plein", label: "Plein" },
  { value: "en transit", label: "En transit" },
  { value: "livré", label: "Livré" },
];

function generateReferenceCT() {
  // Format : CT-{AAAA}-{4 chiffres aléatoires}
  const year = new Date().getFullYear();
  const rnd = Math.floor(1000 + Math.random() * 9000);
  return `CT-${year}-${rnd}`;
}

const ContainerInformationsTab: React.FC<Props> = ({
  values,
  onChange,
  transporteurs = [],
  clients = [],
  routes = [],
  types = [],
}) => {
  // Génère la référence au montage si elle est vide et commence par "CT"
  useEffect(() => {
    if (!values.reference) {
      onChange("reference", generateReferenceCT());
    }
    // eslint-disable-next-line
  }, []); // Only on mount

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">Référence</label>
        <Input value={values.reference || ""} disabled />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">Type</label>
        {/* Sélection type conteneur */}
        <select
          className="w-full border rounded px-2 py-2 text-sm"
          value={values.type || ""}
          onChange={e => {
            const typeValue = e.target.value;
            const foundType = types.find(t => t.type === typeValue);
            onChange("type", typeValue);
            if (foundType) {
              onChange("size", foundType.size);
            }
          }}
        >
          <option value="">Sélectionner</option>
          {types.map(t => (
            <option key={t.type} value={t.type}>{t.type}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">Taille</label>
        <Input value={values.size || ""} disabled placeholder="Sélectionner un type" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">Statut</label>
        <select
          className="w-full border rounded px-2 py-2 text-sm"
          value={values.status || ""}
          onChange={e => onChange("status", e.target.value)}
        >
          {STATUTS.map(status => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">Transporteur</label>
        <select
          className="w-full border rounded px-2 py-2 text-sm"
          value={values.transporteur || ""}
          onChange={e => onChange("transporteur", e.target.value)}
        >
          <option value="">Sélectionner</option>
          {transporteurs.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">Client</label>
        <select
          className="w-full border rounded px-2 py-2 text-sm"
          value={values.client || ""}
          onChange={e => onChange("client", e.target.value)}
        >
          <option value="">Sélectionner</option>
          {clients.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">Route</label>
        <select
          className="w-full border rounded px-2 py-2 text-sm"
          value={values.route || ""}
          onChange={e => {
            const routeId = e.target.value;
            const selectedRoute = routes.find(r => r.id === routeId);
            onChange("route", routeId);
            // Remplir origine & destination depuis la route choisie
            if (selectedRoute) {
              onChange("origin", selectedRoute.origin);
              onChange("destination", selectedRoute.destination);
            }
          }}
        >
          <option value="">Sélectionner</option>
          {routes.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">Origine</label>
        <Input value={values.origin || ""} disabled placeholder="Rempli via la route" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">Destination</label>
        <Input value={values.destination || ""} disabled placeholder="Rempli via la route" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">Date départ</label>
        <Input
          type="date"
          value={values.departDate || ""}
          onChange={e => onChange("departDate", e.target.value)}
          placeholder="jj/mm/aaaa"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">Date arrivée</label>
        <Input
          type="date"
          value={values.arrivalDate || ""}
          onChange={e => onChange("arrivalDate", e.target.value)}
          placeholder="jj/mm/aaaa"
        />
      </div>
    </div>
  );
};

export default ContainerInformationsTab;
