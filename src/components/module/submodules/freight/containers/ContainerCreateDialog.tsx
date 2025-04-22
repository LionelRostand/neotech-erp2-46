
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";
import ContainerTabs from "./ContainerTabs";
import ContainerInformationsTab from "./ContainerInformationsTab";
import ContainerArticlesTab from "./ContainerArticlesTab";
import ContainerCostTab from "./ContainerCostTab";
import useFreightData from "@/hooks/modules/useFreightData";
import { useCreateContainer } from "@/hooks/modules/useContainersFirestore";

const defaultValues = {
  reference: "",
  type: "",
  size: "",
  status: "",
  transporteur: "",
  client: "",
  route: "",
  origin: "",
  destination: "",
  departDate: "",
  arrivalDate: "",
  articles: [],
  costs: [],
};

// Liste des types de conteneurs standards en français
const CONTAINER_TYPES = [
  { type: "Conteneur standard 20'", size: "20 pieds" },
  { type: "Conteneur standard 40'", size: "40 pieds" },
  { type: "Conteneur high cube 40'", size: "40 pieds HC" },
  { type: "Conteneur high cube 45'", size: "45 pieds" },
  { type: "Conteneur frigorifique 20'", size: "20 pieds" },
  { type: "Conteneur frigorifique 40'", size: "40 pieds" },
  { type: "Conteneur open top 20'", size: "20 pieds" },
  { type: "Conteneur open top 40'", size: "40 pieds" },
  { type: "Conteneur flat rack 20'", size: "20 pieds" },
  { type: "Conteneur flat rack 40'", size: "40 pieds" },
  { type: "Conteneur citerne 20'", size: "20 pieds" },
  { type: "Conteneur citerne 30'", size: "30 pieds" },
];

interface ContainerCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const ContainerCreateDialog: React.FC<ContainerCreateDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [tab, setTab] = useState("info");
  const [values, setValues] = useState(defaultValues);
  const { carriers, clients, routes, loading } = useFreightData();
  const createContainer = useCreateContainer();

  // Reset form on open/close
  useEffect(() => {
    if (open) {
      setTab("info");
      setValues(defaultValues);
    }
  }, [open]);

  const handleChange = (field: string, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!values.reference) {
      toast.error("Veuillez renseigner une référence");
      return;
    }

    try {
      // Prepare the container data
      const containerData = {
        number: values.reference,
        type: values.type,
        size: values.size,
        status: values.status || "vide",
        carrierName: carriers.find(c => c.id === values.transporteur)?.name || "",
        origin: values.origin,
        destination: values.destination,
        departureDate: values.departDate,
        arrivalDate: values.arrivalDate,
        location: values.origin,
        client: clients.find(c => c.id === values.client)?.name || "",
        articles: values.articles || [],
        costs: values.costs || [],
        createdAt: new Date().toISOString()
      };

      await createContainer.mutateAsync(containerData);
      toast.success("Conteneur créé avec succès");
      onOpenChange(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erreur lors de la création du conteneur:", error);
      toast.error("Erreur lors de la création du conteneur");
    }
  };

  const isLastTab = tab === "pricing";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nouveau conteneur</DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fermer</span>
          </button>
        </DialogHeader>

        <div className="py-4">
          <ContainerTabs 
            tab={tab} 
            setTab={setTab} 
            isLastTab={isLastTab}
          />

          <div className="mt-4">
            {tab === "info" && (
              <ContainerInformationsTab
                values={values}
                onChange={handleChange}
                transporteurs={carriers}
                clients={clients}
                routes={routes}
                types={CONTAINER_TYPES}
              />
            )}

            {tab === "articles" && (
              <ContainerArticlesTab
                articles={values.articles || []}
                onChange={(articles) => handleChange("articles", articles)}
              />
            )}

            {tab === "pricing" && (
              <ContainerCostTab
                costs={values.costs || []}
                containerType={values.type}
                onChange={(costs) => handleChange("costs", costs)}
              />
            )}
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          {isLastTab && (
            <Button 
              type="button" 
              onClick={handleSubmit}
              disabled={createContainer.isPending}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {createContainer.isPending ? "Création..." : "Créer"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContainerCreateDialog;
