
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
  const {
    register,
    handleSubmit,
    control,
    reset,
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

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const onSubmit = (data: ContainerFormData) => {
    // TODO: implement creation logic
    console.log("Creating container with data:", data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
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
              <ContainerArticlesTab />
            </TabsContent>
            <TabsContent value="pricing" className="pt-4">
              <ContainerCostTab />
            </TabsContent>
            <DialogFooter className="flex justify-end space-x-2 mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
              <Button type="submit">Créer</Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CreateContainerDialog;

