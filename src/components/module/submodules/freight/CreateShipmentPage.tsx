
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ShipmentLine } from "@/types/freight";
import { toast } from "sonner";
import { createShipment } from "./services/shipmentService";
import { useFreightClients } from "./hooks/useFreightClients";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import CreateClientDialog from "./clients/CreateClientDialog";

const EMPTY_SHIPMENT = {
  reference: "",
  customer: "",
  shipmentType: "import",
  origin: "",
  destination: "",
  carrier: "",
  carrierName: "",
  scheduledDate: "",
  estimatedDeliveryDate: "",
  status: "draft",
  totalWeight: 0,
  totalPrice: undefined,
  trackingNumber: "",
  notes: "",
  lines: [] as ShipmentLine[],
};

const CreateShipmentPage: React.FC = () => {
  const [shipmentData, setShipmentData] = useState({ ...EMPTY_SHIPMENT });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateClientDialogOpen, setIsCreateClientDialogOpen] = useState(false);

  const navigate = useNavigate();
  const { clients, isLoading: isLoadingClients, refetchClients } = useFreightClients();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setShipmentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClientChange = (value: string) => {
    setShipmentData((prev) => ({
      ...prev,
      customer: value,
    }));
  };

  const handleSubmit = async () => {
    if (!shipmentData.customer) {
      toast.error("Veuillez sélectionner un client");
      return;
    }
    setIsSubmitting(true);
    try {
      await createShipment({
        ...shipmentData,
        shipmentType: shipmentData.shipmentType as "import" | "export" | "local" | "international",
        status: shipmentData.status as "draft" | "confirmed" | "in_transit" | "delivered" | "cancelled" | "delayed",
        lines: shipmentData.lines,
        totalWeight: Number(shipmentData.totalWeight),
      });
      toast.success(`Expédition ${shipmentData.reference} créée avec succès`);
      navigate("/modules/freight/shipments");
    } catch (err) {
      console.error('Error creating shipment:', err);
      toast.error("Une erreur est survenue lors de la création de l'expédition.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClientCreated = () => {
    setIsCreateClientDialogOpen(false);
    refetchClients();
  };

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Créer une nouvelle expédition</h2>
      <div className="grid gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Select
              value={shipmentData.customer}
              onValueChange={handleClientChange}
              disabled={isLoadingClients}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent className="z-[100] bg-white">
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsCreateClientDialogOpen(true)}
            title="Ajouter un client"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <input
          className="input input-bordered w-full"
          name="reference"
          type="text"
          placeholder="Référence"
          value={shipmentData.reference}
          onChange={handleInputChange}
        />

        <input
          className="input input-bordered w-full"
          name="origin"
          type="text"
          placeholder="Origine"
          value={shipmentData.origin}
          onChange={handleInputChange}
        />

        <input
          className="input input-bordered w-full"
          name="destination"
          type="text"
          placeholder="Destination"
          value={shipmentData.destination}
          onChange={handleInputChange}
        />

        <input
          className="input input-bordered w-full"
          name="carrier"
          type="text"
          placeholder="ID Transporteur"
          value={shipmentData.carrier}
          onChange={handleInputChange}
        />

        <input
          className="input input-bordered w-full"
          name="carrierName"
          type="text"
          placeholder="Nom du Transporteur"
          value={shipmentData.carrierName}
          onChange={handleInputChange}
        />

        <input
          className="input input-bordered w-full"
          name="scheduledDate"
          type="date"
          placeholder="Date prévue"
          value={shipmentData.scheduledDate}
          onChange={handleInputChange}
        />

        <input
          className="input input-bordered w-full"
          name="estimatedDeliveryDate"
          type="date"
          placeholder="Date livraison estimée"
          value={shipmentData.estimatedDeliveryDate}
          onChange={handleInputChange}
        />

        <textarea
          className="textarea textarea-bordered w-full"
          name="notes"
          placeholder="Notes"
          value={shipmentData.notes}
          onChange={handleInputChange}
        />

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !shipmentData.customer}
          className="w-full"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enregistrer sur Firebase
        </Button>
      </div>

      <CreateClientDialog
        open={isCreateClientDialogOpen}
        onOpenChange={setIsCreateClientDialogOpen}
        onSuccess={handleClientCreated}
      />
    </div>
  );
};

export default CreateShipmentPage;

