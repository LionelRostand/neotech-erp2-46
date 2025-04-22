
import React, { useState } from "react";
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
import ArticlesTab from "../shipments/tabs/ArticlesTab";
import { toast } from "sonner";

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
  const [values, setValues] = useState(container || {});

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
