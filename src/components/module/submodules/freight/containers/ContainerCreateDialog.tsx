
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ContainerTabs from "./ContainerTabs";
import ContainerInformationsTab from "./ContainerInformationsTab";
import ContainerArticlesTab from "./ContainerArticlesTab";
import ContainerCostTab from "./ContainerCostTab";
import { useCarriers } from "../hooks/useCarriers";
import { useFreightClients } from "../hooks/useFreightClients";
import { useRoutes } from "../hooks/useRoutes";
import { useAddContainer } from "@/hooks/modules/useContainersFirestore";

// Liste des types de conteneurs (statiques pour l'instant)
const CONTAINER_TYPES = [
  { type: "Standard", size: "20ft" },
  { type: "Standard", size: "40ft" },
  { type: "Réfrigéré", size: "20ft" },
  { type: "Réfrigéré", size: "40ft" },
  { type: "Open Top", size: "20ft" },
  { type: "Flat Rack", size: "40ft" },
  { type: "Tank", size: "20ft" }
];

interface ContainerCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const ContainerCreateDialog: React.FC<ContainerCreateDialogProps> = ({ 
  open, 
  onOpenChange,
  onSuccess
}) => {
  // Récupération des données depuis les hooks
  const { carriers, isLoading: isLoadingCarriers } = useCarriers();
  const { clients, isLoading: isLoadingClients } = useFreightClients();
  const { routes, isLoading: isLoadingRoutes } = useRoutes();
  const addContainer = useAddContainer();

  // État pour les onglets et les données du conteneur
  const [currentTab, setCurrentTab] = useState("info");
  const [containerData, setContainerData] = useState({
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
    arrivalDate: ""
  });
  
  const [articles, setArticles] = useState([]);
  const [cost, setCost] = useState(0);

  // Mettre à jour les données du conteneur
  const handleChange = (field: string, value: any) => {
    setContainerData(prev => ({ ...prev, [field]: value }));
  };

  // Création du conteneur
  const handleCreate = async () => {
    try {
      // Validation de base
      if (!containerData.reference || !containerData.type || !containerData.transporteur || !containerData.client) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        return;
      }

      // Préparer les données pour la sauvegarde
      const containerToSave = {
        number: containerData.reference,
        type: containerData.type,
        size: containerData.size,
        status: containerData.status,
        carrierName: carriers.find(c => c.id === containerData.transporteur)?.name || "",
        client: clients.find(c => c.id === containerData.client)?.name || "",
        origin: containerData.origin,
        destination: containerData.destination,
        departureDate: containerData.departDate,
        arrivalDate: containerData.arrivalDate,
        articles,
        cost,
        // Ces champs sont nécessaires pour la liste des conteneurs
        location: containerData.origin, // On définit la location comme l'origine par défaut
      };

      await addContainer.mutateAsync(containerToSave);
      toast.success("Conteneur créé avec succès!");
      
      // Réinitialiser le formulaire et fermer le dialogue
      resetForm();
      onOpenChange(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erreur lors de la création du conteneur:", error);
      toast.error("Une erreur est survenue lors de la création du conteneur");
    }
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setContainerData({
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
      arrivalDate: ""
    });
    setArticles([]);
    setCost(0);
    setCurrentTab("info");
  };

  // Déterminer si l'onglet actuel est le dernier
  const isLastTab = currentTab === "pricing";

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        resetForm();
      }
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nouveau conteneur</DialogTitle>
        </DialogHeader>

        <ContainerTabs 
          tab={currentTab} 
          setTab={setCurrentTab} 
          onNext={() => {}} 
          isLastTab={isLastTab}
        />

        <div className="mt-4">
          {currentTab === "info" && (
            <ContainerInformationsTab
              values={containerData}
              onChange={handleChange}
              transporteurs={carriers}
              clients={clients}
              routes={routes}
              types={CONTAINER_TYPES}
            />
          )}

          {currentTab === "articles" && (
            <ContainerArticlesTab
              articles={articles}
              setArticles={setArticles}
            />
          )}

          {currentTab === "pricing" && (
            <ContainerCostTab
              containerType={containerData.type}
              articles={articles}
              cost={cost}
              setCost={setCost}
            />
          )}
        </div>

        <DialogFooter className="flex justify-between items-center mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          
          <div className="flex gap-2">
            {currentTab !== "info" && (
              <Button 
                variant="outline" 
                onClick={() => {
                  const currentIndex = ["info", "articles", "pricing"].indexOf(currentTab);
                  if (currentIndex > 0) {
                    setCurrentTab(["info", "articles", "pricing"][currentIndex - 1]);
                  }
                }}
              >
                Précédent
              </Button>
            )}
            
            {!isLastTab ? (
              <Button 
                onClick={() => {
                  const currentIndex = ["info", "articles", "pricing"].indexOf(currentTab);
                  if (currentIndex < 2) {
                    setCurrentTab(["info", "articles", "pricing"][currentIndex + 1]);
                  }
                }}
              >
                Suivant
              </Button>
            ) : (
              <Button 
                onClick={handleCreate} 
                disabled={addContainer.isPending}
              >
                {addContainer.isPending ? "Création..." : "Créer"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContainerCreateDialog;
