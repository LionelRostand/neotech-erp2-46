import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { generateShipmentReference } from "../utils/shipmentUtils";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomerSelector } from "@/components/selectors/CustomerSelector";
import { CarrierSelector } from "@/components/selectors/CarrierSelector";

interface StepGeneralProps {
  form: any;
  updateForm: (data: any) => void;
  prev: () => void;
  next: () => void;
  close: () => void;
}

const StepGeneral: React.FC<StepGeneralProps> = ({
  form,
  updateForm,
  prev,
  next,
  close
}) => {
  // Auto-generate reference on component mount if not already set
  useEffect(() => {
    if (!form.reference) {
      const newReference = generateShipmentReference();
      updateForm({ reference: newReference });
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Référence</label>
          <Input
            value={form.reference}
            onChange={(e) => updateForm({ reference: e.target.value })}
            placeholder="EXP-2023-1234"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Type d'expédition</label>
          <Select
            value={form.shipmentType}
            onValueChange={(value) => updateForm({ shipmentType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="export">Export</SelectItem>
              <SelectItem value="import">Import</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Client</label>
          <CustomerSelector
            value={form.customer}
            onChange={(value, name) => updateForm({ customer: value, customerName: name })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Transporteur</label>
          <CarrierSelector
            value={form.carrier}
            onChange={(value, name) => updateForm({ carrier: value, carrierName: name })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Date d'envoi</label>
          <Input
            type="date"
            value={form.scheduledDate}
            onChange={(e) => updateForm({ scheduledDate: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date de livraison estimée</label>
          <Input
            type="date"
            value={form.estimatedDeliveryDate}
            onChange={(e) => updateForm({ estimatedDeliveryDate: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <Textarea
          value={form.notes}
          onChange={(e) => updateForm({ notes: e.target.value })}
          placeholder="Informations supplémentaires sur l'expédition..."
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={close}>
          Annuler
        </Button>
        <Button onClick={next}>
          Suivant
        </Button>
      </div>
    </div>
  );
};

export default StepGeneral;
