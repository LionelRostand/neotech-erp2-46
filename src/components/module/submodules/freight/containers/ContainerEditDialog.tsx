import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Container } from "@/types/freight";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import ContainerTabs from "./ContainerTabs";
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
  const isEditMode = !!container;
  const [activeTab, setActiveTab] = useState("info");
  const [formData, setFormData] = useState<Partial<Container>>(
    container || {
      number: "",
      type: "20ft",
      client: "",
      status: "pending",
      destination: "",
      costs: [],
      articles: []
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      // Here would be the code to save the container to Firestore
      toast.success(
        isEditMode
          ? "Conteneur mis à jour avec succès"
          : "Conteneur créé avec succès"
      );
      onClose();
    } catch (error) {
      console.error("Error saving container:", error);
      toast.error(
        isEditMode
          ? "Erreur lors de la mise à jour du conteneur"
          : "Erreur lors de la création du conteneur"
      );
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "info":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="number">Numéro de conteneur</Label>
                <Input
                  id="number"
                  name="number"
                  value={formData.number || ""}
                  onChange={handleInputChange}
                  placeholder="ABCD1234567"
                />
              </div>
              <div>
                <Label htmlFor="type">Type de conteneur</Label>
                <Select
                  name="type"
                  value={formData.type || "20ft"}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20ft">20 pieds</SelectItem>
                    <SelectItem value="40ft">40 pieds</SelectItem>
                    <SelectItem value="40hc">40 pieds HC</SelectItem>
                    <SelectItem value="45ft">45 pieds</SelectItem>
                    <SelectItem value="reefer">Réfrigéré</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client">Client</Label>
                <Input
                  id="client"
                  name="client"
                  value={formData.client || ""}
                  onChange={handleInputChange}
                  placeholder="Nom du client"
                />
              </div>
              <div>
                <Label htmlFor="status">Statut</Label>
                <Select
                  name="status"
                  value={formData.status || "pending"}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="loading">En chargement</SelectItem>
                    <SelectItem value="in_transit">En transit</SelectItem>
                    <SelectItem value="delivered">Livré</SelectItem>
                    <SelectItem value="returned">Retourné</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                name="destination"
                value={formData.destination || ""}
                onChange={handleInputChange}
                placeholder="Destination du conteneur"
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes || ""}
                onChange={handleInputChange}
                placeholder="Notes additionnelles"
                rows={3}
              />
            </div>
          </div>
        );
      case "articles":
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Gestion des articles du conteneur
            </p>
            {/* Articles management would go here */}
            <div className="bg-muted p-4 rounded-md">
              <p>Fonctionnalité en développement</p>
            </div>
          </div>
        );
      case "pricing":
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Gestion des coûts du conteneur
            </p>
            {/* Pricing management would go here */}
            <div className="bg-muted p-4 rounded-md">
              <p>Fonctionnalité en développement</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Modifier le conteneur" : "Nouveau conteneur"}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <ContainerTabs
            tab={activeTab}
            setTab={setActiveTab}
            onNext={() => {}}
            isLastTab={activeTab === "pricing"}
          />
          <div className="mt-6">{renderTabContent()}</div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave}>
            {isEditMode ? "Mettre à jour" : "Créer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContainerEditDialog;
