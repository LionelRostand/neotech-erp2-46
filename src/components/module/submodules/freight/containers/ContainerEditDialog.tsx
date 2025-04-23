
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
import ContainerArticlesTab from "./ContainerArticlesTab";
import { toast } from "sonner";
import useFreightData from "@/hooks/modules/useFreightData";
import { useUpdateContainer } from "@/hooks/modules/useContainersFirestore";
import { Loader2 } from "lucide-react";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { carriers, clients, routes } = useFreightData();
  const updateContainer = useUpdateContainer();

  // Update values when container changes
  useEffect(() => {
    if (container) {
      setValues(container);
    }
  }, [container]);

  const handleSubmit = async () => {
    if (!container || !container.id) {
      toast.error("ID du conteneur manquant");
      return;
    }

    try {
      setIsSubmitting(true);

      // Mise à jour du conteneur avec les nouvelles valeurs
      await updateContainer.mutateAsync({
        id: container.id,
        data: {
          ...values,
          updatedAt: new Date().toISOString()
        }
      });

      toast.success("Conteneur mis à jour avec succès");
      onClose();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du conteneur:", error);
      toast.error("Erreur lors de la mise à jour du conteneur");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Liste des types de conteneurs standards
  const containerTypes = [
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
                transporteurs={carriers}
                clients={clients}
                routes={routes}
                types={containerTypes}
              />
            </TabsContent>

            <TabsContent value="articles">
              <ContainerArticlesTab
                articles={container?.articles || []}
                onChange={(articles) =>
                  setValues((prev) => ({ ...prev, articles }))
                }
              />
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContainerEditDialog;
