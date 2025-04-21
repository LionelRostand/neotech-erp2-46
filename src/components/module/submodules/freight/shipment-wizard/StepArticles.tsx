
import React, { useEffect } from "react";
import ShipmentLinesForm from "../ShipmentLinesForm";
import { Button } from "@/components/ui/button";

const StepArticles = ({
  lines,
  updateLines,
  prev,
  next,
  close,
}: {
  lines: any[];
  updateLines: (lines: any[]) => void;
  prev: () => void;
  next: () => void;
  close: () => void;
}) => {
  // Calculs totaux
  const totalWeight = lines.reduce((sum, l) => sum + l.weight * l.quantity, 0);
  const totalItems = lines.reduce((sum, l) => sum + l.quantity, 0);

  // Pour valider qu'on a au moins 1 produit
  const canContinue = lines.length > 0 && lines.every(l => l.productName);

  return (
    <div>
      <ShipmentLinesForm onLinesUpdate={updateLines} />
      <div className="flex flex-col md:flex-row justify-between pt-3 gap-4">
        <div>
          <p>
            <strong>Total articles:</strong> {totalItems}
          </p>
          <p>
            <strong>Poids total:</strong> {totalWeight.toFixed(2)} kg
          </p>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={prev}>Précédent</Button>
          <Button onClick={next} disabled={!canContinue}>Suivant</Button>
          <Button variant="ghost" onClick={close}>Annuler</Button>
        </div>
      </div>
    </div>
  );
};
export default StepArticles;
