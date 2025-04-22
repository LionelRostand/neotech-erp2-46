
import React from "react";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";

const StepRecap = ({
  form,
  prev,
  onSuccess,
  close,
}: {
  form: any;
  prev: () => void;
  onSuccess: () => void;
  close: () => void;
}) => {
  const handleSubmit = () => {
    // Generate a unique ID for this shipment
    const shipmentId = uuidv4();
    
    // In a real app, this would save to a database
    // For now, we'll just simulate success
    console.log("Submitting shipment:", { id: shipmentId, ...form });
    
    // Call the success handler from parent
    onSuccess();
  };

  // Calculate totals
  const totalItems = form.lines ? form.lines.reduce((sum: number, line: any) => sum + Number(line.quantity), 0) : 0;
  const totalWeight = form.totalWeight || 0;
  const totalPrice = form.pricing ? (
    (form.pricing.basePrice || 0) + 
    (totalWeight * 0.1) + 
    ((form.pricing.distance || 0) * 0.1) + 
    (form.pricing.extraFees || 0)
  ) : 0;

  return (
    <div className="space-y-6">
      {/* Récapitulatif de l'expédition */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Informations générales */}
        <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
          <h3 className="font-bold text-lg">Informations générales</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Référence:</span> {form.reference}</p>
            <p><span className="font-medium">Client:</span> {form.customerName}</p>
            <p><span className="font-medium">Transporteur:</span> {form.carrierName}</p>
            <p><span className="font-medium">Type d'expédition:</span> {form.shipmentType === 'export' ? 'Export' : 'Import'}</p>
            <p><span className="font-medium">Date d'envoi:</span> {form.scheduledDate}</p>
            <p><span className="font-medium">Date de livraison estimée:</span> {form.estimatedDeliveryDate}</p>
          </div>
        </div>

        {/* Informations de suivi et prix */}
        <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
          <h3 className="font-bold text-lg">Suivi & Prix</h3>
          <div className="space-y-2">
            <p><span className="font-medium">N° de suivi:</span> {form.trackingNumber || 'Non défini'}</p>
            <p><span className="font-medium">Route:</span> {form.routeId ? `Route #${form.routeId}` : 'Aucune route sélectionnée'}</p>
            <p><span className="font-medium">Poids total:</span> {totalWeight.toFixed(2)} kg</p>
            <p><span className="font-medium">Total articles:</span> {totalItems}</p>
            <p><span className="font-medium">Prix de base:</span> {form.pricing?.basePrice?.toFixed(2) || 0} €</p>
            <p className="font-bold">
              <span>PRIX TOTAL:</span> {totalPrice.toFixed(2)} €
            </p>
          </div>
        </div>
      </div>

      {/* Articles */}
      {form.lines && form.lines.length > 0 && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="font-bold text-lg mb-3">Articles</h3>
          <div className="space-y-2">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poids unitaire</th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poids total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {form.lines.map((line: any, index: number) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">{line.productName}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">{line.quantity}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">{Number(line.weight).toFixed(2)} kg</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">{(Number(line.weight) * Number(line.quantity)).toFixed(2)} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Notes */}
      {form.notes && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="font-bold text-lg mb-2">Notes</h3>
          <p className="text-sm whitespace-pre-line">{form.notes}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={prev}>Précédent</Button>
        <Button onClick={handleSubmit}>Valider l'expédition</Button>
        <Button variant="ghost" onClick={close}>Annuler</Button>
      </div>
    </div>
  );
};

export default StepRecap;
