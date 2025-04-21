import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

interface CreateEditContainerDialogProps {
  open: boolean;
  onClose: () => void;
  container: any | null;
  carrierOptions: { label: string; value: string }[];
  clientOptions: { label: string; value: string }[];
  routeOptions: { label: string; value: string, origin: string, destination: string }[];
  defaultNumber?: string;
}

const CreateEditContainerDialog: React.FC<CreateEditContainerDialogProps> = ({
  open,
  onClose,
  container,
  carrierOptions,
  clientOptions,
  routeOptions,
  defaultNumber,
}) => {
  const isEditMode = Boolean(container);

  const { register, setValue, reset, handleSubmit, watch } = useForm({
    defaultValues: {
      number: isEditMode ? container?.number || "" : defaultNumber || "",
      client: isEditMode ? container?.client || "" : "",
      carrier: isEditMode ? container?.carrier || "" : "",
      route: isEditMode ? container?.route || "" : "",
      status: isEditMode ? container?.status || "" : "",
      // Ajoutez ici tous les champs nécessaires...
    }
  });

  // À chaque ouverture du popup en mode création, on définit le numéro de conteneur
  useEffect(() => {
    if (open && !isEditMode && defaultNumber) {
      setValue("number", defaultNumber, { shouldDirty: false });
    }
    // Si on souhaite réinitialiser tout le formulaire à l'ouverture, on peut remettre reset ici
    // reset({ number: defaultNumber || "", ... });
  }, [open, isEditMode, defaultNumber, setValue]);

  const onSubmit = (data: any) => {
    // Traitez l'enregistrement ou la modification ici...
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Modifier le conteneur" : "Nouveau conteneur"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Numéro de conteneur <span className="text-red-500">*</span>
            </label>
            <Input
              {...register("number", { required: true })}
              disabled={isEditMode}
              data-testid="container-number"
            />
          </div>
          {/* Ajoutez ici d'autres champs comme client, transporteur, route, etc. */}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" variant="default">
              {isEditMode ? "Enregistrer" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEditContainerDialog;
