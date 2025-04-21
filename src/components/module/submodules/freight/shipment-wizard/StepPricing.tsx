
import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const StepPricing = ({
  form,
  updatePricing,
  prev,
  next,
  close,
}: {
  form: any;
  updatePricing: (pricing: any) => void;
  prev: () => void;
  next: () => void;
  close: () => void;
}) => {
  const { pricing, totalWeight = 0 } = form;

  // Simple rule: base 10€, 0.10€/kg, 0.10€/km, extra
  const weightPrice = totalWeight * 0.1;
  const distancePrice = (pricing?.distance || 0) * 0.1;
  const basePrice = pricing?.basePrice || 10;
  const extra = pricing?.extraFees || 0;
  const total = basePrice + weightPrice + distancePrice + extra;

  return (
    <div className="md:flex gap-6">
      {/* Paramètres */}
      <form
        className="flex-1 space-y-4"
        onSubmit={e => {
          e.preventDefault();
          next();
        }}
      >
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            label="Prix de base (€)"
            min="0"
            value={pricing.basePrice}
            onChange={e =>
              updatePricing({ ...pricing, basePrice: parseFloat(e.target.value) || 0 })
            }
            placeholder="Prix de base (€)"
          />
          <select
            value={pricing.geoZone}
            onChange={e => updatePricing({ ...pricing, geoZone: e.target.value })}
            className="rounded-md border px-3 py-2 text-sm bg-white"
          >
            <option value="National">National</option>
            <option value="International">International</option>
          </select>
          <select
            value={pricing.shipmentKind}
            onChange={e => updatePricing({ ...pricing, shipmentKind: e.target.value })}
            className="rounded-md border px-3 py-2 text-sm bg-white"
          >
            <option value="standard">Standard (1-3 jours)</option>
            <option value="express">Express (24h)</option>
          </select>
          <Input
            type="number"
            min="0"
            label="Distance estimée (km)"
            value={pricing.distance}
            onChange={e =>
              updatePricing({ ...pricing, distance: parseFloat(e.target.value) || 0 })
            }
            placeholder="Distance estimée (km)"
          />
          <Input
            type="number"
            label="Frais supplémentaires (€)"
            min="0"
            value={pricing.extraFees}
            onChange={e =>
              updatePricing({ ...pricing, extraFees: parseFloat(e.target.value) || 0 })
            }
            placeholder="Frais suppl."
          />
        </div>
        <div className="flex gap-2 pt-3">
          <Button variant="outline" type="button" onClick={prev}>
            Précédent
          </Button>
          <Button type="submit">
            Suivant
          </Button>
          <Button variant="ghost" type="button" onClick={close}>
            Annuler
          </Button>
        </div>
      </form>
      {/* Résumé */}
      <div className="flex-1 border rounded-lg px-6 py-6 bg-gray-50 ml-0 md:ml-6 mt-6 md:mt-0 min-w-[250px]">
        <h4 className="font-bold mb-2">Résumé du calcul</h4>
        <div className="text-sm space-y-1">
          <p>Poids total: <strong>{totalWeight.toFixed(2)} kg</strong></p>
          <p>Tarif de base: <strong>{basePrice.toFixed(2)} €</strong></p>
          <p>Tarif au poids: <strong>{weightPrice.toFixed(2)} €</strong></p>
          <p>Tarif à la distance: <strong>{distancePrice.toFixed(2)} €</strong></p>
          <p>Frais supp.: <strong>{extra.toFixed(2)} €</strong></p>
        </div>
        <div className="text-lg font-extrabold mt-4">
          PRIX TOTAL: {total.toFixed(2)} €
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          Les prix sont calculés selon nos tarifs en vigueur et peuvent être ajustés.
        </div>
      </div>
    </div>
  );
};
export default StepPricing;
