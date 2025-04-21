
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Plus } from "lucide-react";
import { useFreightClients } from "./hooks/useFreightClients";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { createShipment } from "./services/shipmentService";
import { format } from "date-fns";

export interface ShipmentLine {
  name: string;
  quantity: number;
  weight: number;
  packaging: string;
  totalWeight: number;
}

export interface ShipmentData {
  reference: string;
  customer: string;
  shipmentType: string;
  origin: string;
  destination: string;
  carrier: string;
  carrierName: string;
  scheduledDate: string;
  estimatedDeliveryDate: string;
  status: string;
  totalWeight: number;
  trackingNumber?: string;
  notes?: string;
  lines: ShipmentLine[];
  // tarification/route (could be extended)
}

const emptyShipment: ShipmentData = {
  reference: `EXP-${Date.now().toString().slice(-6)}`,
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

const packagingTypes = ["Carton", "Palette", "Caisse", "Sachet"];

const ShipmentDialogForm: React.FC = () => {
  const { clients, isLoading: clientsLoading } = useFreightClients();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("general");
  const [shipment, setShipment] = useState<ShipmentData>({
    ...emptyShipment,
    scheduledDate: "",
    estimatedDeliveryDate: "",
    reference: `EXP-${Date.now().toString().slice(-6)}`,
    lines: [
      {
        name: "",
        quantity: 1,
        weight: 0,
        packaging: packagingTypes[0],
        totalWeight: 0,
      },
    ],
  });
  const [submitting, setSubmitting] = useState(false);

  // --- field change helpers
  const handleChange = (field: keyof ShipmentData, value: any) => {
    setShipment((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // --- LINE HANDLING ---
  const handleLineChange = (idx: number, field: keyof ShipmentLine, value: any) => {
    setShipment((prev) => ({
      ...prev,
      lines: prev.lines.map((l, i) => i === idx ? { ...l, [field]: value, totalWeight: field === "quantity" || field === "weight" ? (field === "quantity" ? value : l.quantity) * (field === "weight" ? value : l.weight) : l.totalWeight } : l)
    }));
  };

  const addLine = () => {
    setShipment((prev) => ({
      ...prev,
      lines: [
        ...prev.lines,
        { name: "", quantity: 1, weight: 0, packaging: packagingTypes[0], totalWeight: 0 },
      ]
    }));
  };

  const removeLine = (idx: number) => {
    setShipment((prev) => ({
      ...prev,
      lines: prev.lines.filter((_, i) => i !== idx)
    }));
  };

  // --- SUBMIT
  const submitShipment = async () => {
    setSubmitting(true);
    try {
      await createShipment({
        ...shipment,
        shipmentType: shipment.shipmentType as any,
        status: shipment.status as any,
        lines: shipment.lines,
        scheduledDate: shipment.scheduledDate,
        estimatedDeliveryDate: shipment.estimatedDeliveryDate,
        totalWeight: shipment.lines.reduce((acc, l) => acc + l.quantity * l.weight, 0),
      });
      setOpen(false);
      toast.success("Expédition créée !");
    } catch (e) {
      toast.error("Erreur création expédition");
    }
    setSubmitting(false);
  };

  // --- RENDER
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2">
          <Plus className="h-5 w-5" />
          Nouvelle Expédition
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Nouvelle Expédition</DialogTitle>
        </DialogHeader>
        <Tabs value={step} onValueChange={setStep} className="mt-4">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="general">Informations générales</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="pricing">Tarification</TabsTrigger>
            <TabsTrigger value="route">Suivi & Route</TabsTrigger>
          </TabsList>

          {/* Etape 1 : Infos générales */}
          <TabsContent value="general">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Référence</label>
                <Input value={shipment.reference} disabled className="bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Client</label>
                <Select
                  value={shipment.customer}
                  onValueChange={val => handleChange("customer", val)}
                  disabled={clientsLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Nom du client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(client =>
                      <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type d&apos;expédition</label>
                <Select value={shipment.shipmentType} onValueChange={v => handleChange("shipmentType", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local</SelectItem>
                    <SelectItem value="international">International</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Transporteur</label>
                <Input value={shipment.carrierName} placeholder="Sélectionner un transporteur" onChange={(e) => handleChange("carrierName", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Origine</label>
                <Input value={shipment.origin} placeholder="Adresse d'origine" onChange={e => handleChange("origin", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Destination</label>
                <Input value={shipment.destination} placeholder="Adresse de destination" onChange={e => handleChange("destination", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date d&apos;expédition</label>
                <Input type="date" value={shipment.scheduledDate} onChange={e => handleChange("scheduledDate", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date de livraison estimée</label>
                <Input type="date" value={shipment.estimatedDeliveryDate} onChange={e => handleChange("estimatedDeliveryDate", e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea value={shipment.notes} onChange={e => handleChange("notes", e.target.value)} placeholder="Informations complémentaires..." className="w-full rounded border border-gray-300 min-h-[60px] px-2 py-1" />
              </div>
            </div>
            <div className="flex justify-between mt-8">
              <div />
              <Button variant="default" disabled={!shipment.customer} onClick={() => setStep("articles")}>Suivant</Button>
            </div>
          </TabsContent>

          {/* Articles */}
          <TabsContent value="articles">
            {/* Table des articles */}
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border border-gray-200 bg-gray-50">
                <thead>
                  <tr>
                    <th className="font-medium px-3 py-2">Article</th>
                    <th className="font-medium px-3 py-2">Quantité</th>
                    <th className="font-medium px-3 py-2">Poids (kg)</th>
                    <th className="font-medium px-3 py-2">Type d&apos;emballage</th>
                    <th className="font-medium px-3 py-2">Poids total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {shipment.lines.map((line, i) => (
                    <tr key={i} className="bg-white even:bg-gray-50">
                      <td>
                        <Input value={line.name}
                               placeholder="Nom de l'article"
                               onChange={e => handleLineChange(i, "name", e.target.value)}
                        />
                      </td>
                      <td>
                        <Input
                          type="number"
                          min={1}
                          value={line.quantity}
                          onChange={e => handleLineChange(i, "quantity", Number(e.target.value))}
                          className="w-16" />
                      </td>
                      <td>
                        <Input
                          type="number"
                          value={line.weight}
                          min={0}
                          step={0.01}
                          onChange={e => handleLineChange(i, "weight", Number(e.target.value))}
                          className="w-20" />
                      </td>
                      <td>
                        <Select
                          value={line.packaging}
                          onValueChange={v => handleLineChange(i, "packaging", v)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {packagingTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </td>
                      <td>
                        {(line.quantity * line.weight).toFixed(2)} kg
                      </td>
                      <td>
                        {shipment.lines.length > 1 && (
                          <Button variant="ghost" size="icon" onClick={() => removeLine(i)}>
                            <span className="text-red-500 font-bold text-lg">&times;</span>
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Button
                variant="outline"
                size="sm"
                onClick={addLine}
                className="mt-3"
              >+ Ajouter une ligne</Button>
              <div className="flex justify-between items-center mt-4">
                <div>
                  <span className="font-medium">Total articles: </span>
                  {shipment.lines.length}
                  <span className="ml-4 font-medium">Poids total: </span>
                  {shipment.lines.reduce((acc, l) => acc + l.quantity * l.weight, 0).toFixed(2)} kg
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep("general")}>Précédent</Button>
                  <Button variant="default" onClick={() => setStep("pricing")}>Suivant</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tarification */}
          <TabsContent value="pricing">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Prix de base (€)</label>
                    <Input type="number" min={0} value={10} disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Zone géographique</label>
                    <Select value="national" onValueChange={() => {}}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="national">National</SelectItem>
                        <SelectItem value="international">International</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Type d&apos;expédition</label>
                    <Select value="standard" onValueChange={() => {}}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard (1-3 jours)</SelectItem>
                        <SelectItem value="express">Express</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Distance estimée (km)</label>
                    <Input type="number" min={0} value={100} disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Frais supplémentaires (€)</label>
                    <Input type="number" min={0} value={0} disabled />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 space-y-3">
                  <div className="font-bold mb-3">Résumé du calcul</div>
                  <div>Poids total: {shipment.lines.reduce((acc, l) => acc + l.quantity * l.weight, 0).toFixed(2)} kg</div>
                  <div>Tarif de base: 10.00 €</div>
                  <div>Tarif au poids: 0.00 €</div>
                  <div>Tarif à la distance: 10.00 €</div>
                  <div className="font-bold text-lg mt-2">
                    PRIX TOTAL: 20.00 €
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="flex justify-between items-center mt-6">
              <div>
                <Button variant="outline" onClick={() => setStep("articles")}>Précédent</Button>
              </div>
              <Button variant="default" onClick={() => setStep("route")}>Suivant</Button>
            </div>
          </TabsContent>

          {/* Suivi & Route */}
          <TabsContent value="route">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Numéro de suivi</label>
                <Input value={shipment.trackingNumber || `TRK${Date.now().toString().slice(-6)}`} 
                  onChange={e => handleChange("trackingNumber", e.target.value)} 
                  placeholder="Numéro de suivi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Statut</label>
                <Select value={shipment.status} onValueChange={v => handleChange("status", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="confirmed">Confirmée</SelectItem>
                    <SelectItem value="in_transit">En transit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Route</label>
                <Input value="" placeholder="Sélectionner une route" disabled />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type de transport</label>
                <Select value="route" onValueChange={() => {}}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="route">Route</SelectItem>
                    <SelectItem value="air">Aérien</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Délai de transit (heures)</label>
                <Input type="number" value={24} disabled />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Distance (km)</label>
                <Input type="number" value={100} disabled />
              </div>
            </div>
            <div className="bg-blue-50 p-3 mt-6 rounded flex items-center gap-2 text-blue-700">
              <span role="img" aria-label="gps">📍</span>
              Suivi en temps réel : un lien sera généré automatiquement à la création.
            </div>
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setStep("pricing")}>Précédent</Button>
              <div className="flex gap-2">
                <DialogClose asChild>
                  <Button variant="ghost">Annuler</Button>
                </DialogClose>
                <Button
                  variant="default"
                  onClick={submitShipment}
                  disabled={submitting || !shipment.customer}
                  loading={submitting}
                >
                  Créer l&apos;expédition
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ShipmentDialogForm;
