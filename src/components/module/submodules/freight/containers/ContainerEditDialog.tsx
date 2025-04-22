
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Container } from "@/types/freight";
import ContainerInformationsTab from "./ContainerInformationsTab";
import ArticlesTab from "../shipments/tabs/ArticlesTab";
import { toast } from "sonner";

// Sample data for dropdown options
const transporteurs = [
  { id: "carrier1", name: "Maersk" },
  { id: "carrier2", name: "MSC" },
  { id: "carrier3", name: "CMA CGM" },
];

const clients = [
  { id: "client1", name: "Entreprise A" },
  { id: "client2", name: "Entreprise B" },
  { id: "client3", name: "Entreprise C" },
];

const routes = [
  { id: "route1", name: "Shanghai - Rotterdam", origin: "Shanghai", destination: "Rotterdam" },
  { id: "route2", name: "Los Angeles - New York", origin: "Los Angeles", destination: "New York" },
  { id: "route3", name: "Dubai - Singapour", origin: "Dubai", destination: "Singapour" },
];

const containerTypes = [
  { type: "20ft Standard", size: "20ft" },
  { type: "40ft Standard", size: "40ft" },
  { type: "40ft High Cube", size: "40ft HC" },
  { type: "20ft Réfrigéré", size: "20ft" },
  { type: "40ft Réfrigéré", size: "40ft" },
];

interface ContainerEditDialogProps {
  container: Container | null;
  open: boolean;
  onClose: () => void;
}

const ContainerEditDialog: React.FC<ContainerEditDialogProps> = ({
  container,
  open,
  onClose,
}) => {
  const [tab, setTab] = useState("info");
  const [values, setValues] = useState<Partial<Container>>(container || {});

  // Update values when container changes
  useEffect(() => {
    if (container) {
      setValues(container);
    }
  }, [container]);

  const handleSubmit = async () => {
    try {
      // Implement update logic here
      toast.success("Conteneur mis à jour avec succès");
      onClose();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du conteneur:", error);
      toast.error("Erreur lors de la mise à jour du conteneur");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier le conteneur {container?.number}</DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Informations</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <TabsContent value="info">
              <ContainerInformationsTab
                values={values}
                onChange={(field, value) =>
                  setValues((prev) => ({ ...prev, [field]: value }))
                }
                transporteurs={transporteurs}
                clients={clients}
                routes={routes}
                types={containerTypes}
              />
            </TabsContent>

            <TabsContent value="articles">
              <ArticlesTab lines={container?.articles || []} />
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContainerEditDialog;
