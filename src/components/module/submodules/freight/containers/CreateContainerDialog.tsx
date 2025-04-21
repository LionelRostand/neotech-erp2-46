
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ContainerArticlesTab from "./ContainerArticlesTab";
import ContainerCostTab from "./ContainerCostTab";
import { useForm, Controller } from "react-hook-form";
import type { Container } from "@/types/freight";
import { toast } from "sonner";
import { useAddContainer } from "@/hooks/modules/useContainersFirestore";

interface CreateContainerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ContainerFormData {
  number: string;
  type: string;
  size: string;
  status: string;
  carrierName: string;
  client: string;
  origin: string;
  destination: string;
  departureDate: string;
  arrivalDate: string;
}

const CreateContainerDialog: React.FC<CreateContainerDialogProps> = ({
  open,
  onOpenChange
}) => {
  const [articles, setArticles] = useState<{name: string; quantity: number; weight?: number}[]>([]);
  const [cost, setCost] = useState(0);
  const addContainer = useAddContainer();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors }
  } = useForm<ContainerFormData>({
    defaultValues: {
      number: "",
      type: "",
      size: "",
      status: "",
      carrierName: "",
      client: "",
      origin: "",
      destination: "",
      departureDate: "",
      arrivalDate: "",
    }
  });

  // Reset the form when the dialog is closed
  useEffect(() => {
    if (!open) {
      reset();
      setArticles([]);
      setCost(0);
    }
  }, [open, reset]);

  const containerType = watch("type");

  const onSubmit = (data: ContainerFormData) => {
    const containerData = {
      ...data,
      articles,
      cost,
      location: "À l'entrepôt", // Default value
      createdAt: new Date().toISOString(),
    };

    addContainer.mutate(containerData, {
      onSuccess: () => {
        toast.success("Conteneur créé avec succès");
        onOpenChange(false);
      },
      onError: (error) => {
        console.error("Error creating container:", error);
        toast.error("Erreur lors de la création du conteneur");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouveau conteneur</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="info" className="space-y-6">
          <TabsList>
            <TabsTrigger value="info">Informations</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="pricing">Tarification</TabsTrigger>
          </TabsList>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TabsContent value="info" className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="number">Référence</Label>
                <Input id="number" {...register("number", { required: true })} />
                {errors.number && <p className="text-sm text-destructive">Ce champ est requis.</p>}
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Input id="type" {...register("type", { required: true })} />
                {errors.type && <p className="text-sm text-destructive">Ce champ est requis.</p>}
              </div>

              <div>
                <Label htmlFor="size">Taille</Label>
                <Input id="size" {...register("size", { required: true })} />
                {errors.size && <p className="text-sm text-destructive">Ce champ est requis.</p>}
              </div>
              <div>
                <Label htmlFor="status">Statut</Label>
                <Input id="status" {...register("status", { required: true })} />
                {errors.status && <p className="text-sm text-destructive">Ce champ est requis.</p>}
              </div>

              <div>
                <Label htmlFor="carrierName">Transporteur</Label>
                <Input
                  id="carrierName"
                  placeholder="ex: TEST-TRANSPORT"
                  {...register("carrierName")}
                />
              </div>
              <div>
                <Label htmlFor="client">Client</Label>
                <Input id="client" {...register("client")} />
              </div>

              <div>
                <Label htmlFor="origin">Origine</Label>
                <Input id="origin" {...register("origin", { required: true })} />
                {errors.origin && <p className="text-sm text-destructive">Ce champ est requis.</p>}
              </div>
              <div>
                <Label htmlFor="destination">Destination</Label>
                <Input id="destination" {...register("destination", { required: true })} />
                {errors.destination && <p className="text-sm text-destructive">Ce champ est requis.</p>}
              </div>

              <div>
                <Label htmlFor="departureDate">Date départ</Label>
                <Controller
                  name="departureDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="departureDate"
                      type="date"
                      {...field}
                    />
                  )}
                />
              </div>
              <div>
                <Label htmlFor="arrivalDate">Date arrivée</Label>
                <Controller
                  name="arrivalDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="arrivalDate"
                      type="date"
                      {...field}
                    />
                  )}
                />
              </div>
            </TabsContent>
            <TabsContent value="articles" className="pt-4">
              <ContainerArticlesTab articles={articles} setArticles={setArticles} />
            </TabsContent>
            <TabsContent value="pricing" className="pt-4">
              <ContainerCostTab containerType={containerType} articles={articles} cost={cost} setCost={setCost} />
            </TabsContent>
            <DialogFooter className="flex justify-end space-x-2 mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
              <Button type="submit" disabled={addContainer.isPending}>
                {addContainer.isPending ? "Création..." : "Créer"}
              </Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CreateContainerDialog;
