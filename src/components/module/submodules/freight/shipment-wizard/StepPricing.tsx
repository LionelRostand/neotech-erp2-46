
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Printer } from "lucide-react";

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
  const basePrice = typeof pricing?.basePrice === "number" ? pricing.basePrice : 10;
  const extra = typeof pricing?.extraFees === "number" ? pricing.extraFees : 0;
  const total = basePrice + weightPrice + distancePrice + extra;

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Colonne gauche : paramètres de tarification */}
      <form
        className="flex-1 rounded-lg border bg-white p-6 space-y-6 min-w-[320px]"
        onSubmit={e => {
          e.preventDefault();
          next();
        }}
      >
        <div>
          <h4 className="font-semibold mb-4 text-base">Paramètres de tarification</h4>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm mb-1 font-medium">Prix de base (€)</label>
              <Input
                type="number"
                min="0"
                value={pricing.basePrice}
                onChange={e =>
                  updatePricing({ ...pricing, basePrice: parseFloat(e.target.value) || 0 })
                }
                className="bg-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 font-medium">Zone géographique</label>
              <select
                value={pricing.geoZone}
                onChange={e => updatePricing({ ...pricing, geoZone: e.target.value })}
                className="rounded-md border px-3 py-2 text-sm bg-white w-full"
              >
                <option value="National">National</option>
                <option value="International">International</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1 font-medium">Type d'expédition</label>
              <select
                value={pricing.shipmentKind}
                onChange={e => updatePricing({ ...pricing, shipmentKind: e.target.value })}
                className="rounded-md border px-3 py-2 text-sm bg-white w-full"
              >
                <option value="standard">Standard (1-3 jours)</option>
                <option value="express">Express (24h)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1 font-medium">Distance estimée (km)</label>
              <Input
                type="number"
                min="0"
                value={pricing.distance}
                onChange={e =>
                  updatePricing({ ...pricing, distance: parseFloat(e.target.value) || 0 })
                }
                className="bg-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 font-medium">Frais supplémentaires (€)</label>
              <Input
                type="number"
                min="0"
                value={pricing.extraFees}
                onChange={e =>
                  updatePricing({ ...pricing, extraFees: parseFloat(e.target.value) || 0 })
                }
                className="bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section Documents */}
        <div>
          <h4 className="font-semibold mb-2 text-base">Documents</h4>
          <div className="flex gap-3 mb-2">
            <Button type="button" variant="outline" className="gap-2">
              <FileText className="w-4 h-4" /> Générer la facture
            </Button>
            <Button type="button" variant="outline" className="gap-2">
              <Printer className="w-4 h-4" /> Générer le bon de livraison
            </Button>
          </div>
        </div>

        {/* Pied de formulaire : navigation */}
        <div className="flex gap-2 items-center pt-2">
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

      {/* Colonne droite : Résumé du calcul */}
      <div className="flex-1 border rounded-lg px-8 py-8 bg-gray-50 max-w-md min-w-[260px] flex flex-col">
        <h4 className="font-bold mb-3 text-base">Résumé du calcul</h4>
        <div className="text-sm space-y-2">
          <p>
            Poids total: <strong>{totalWeight.toFixed(2)} kg</strong>
          </p>
          <p>
            Tarif de base: <strong>{basePrice.toFixed(2)} €</strong>
          </p>
          <p>
            Tarif au poids: <strong>{weightPrice.toFixed(2)} €</strong>
          </p>
          <p>
            Tarif à la distance: <strong>{distancePrice.toFixed(2)} €</strong>
          </p>
          <p>
            Frais supp.: <strong>{extra.toFixed(2)} €</strong>
          </p>
        </div>
        <div className="text-lg font-extrabold mt-5 mb-2">
          PRIX TOTAL: {total.toFixed(2)} €
        </div>
        <div className="text-xs text-muted-foreground mb-6">
          Les prix sont calculés selon nos tarifs en vigueur et peuvent être ajustés.
        </div>
        <div className="flex flex-1 items-end justify-end">
          <div className="font-bold text-primary text-base">
            Prix total: {total.toFixed(2)} €
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepPricing;
