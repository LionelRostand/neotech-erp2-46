
import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

// Fonction locale pour générer un numéro de conteneur similaire à celle utilisée ailleurs
const generateContainerNumber = () => {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.floor(10000 + Math.random() * 90000).toString();
  return `CTR-${datePart}-${randomPart}`;
};

interface CreateEditContainerDialogProps {
  open: boolean;
  onClose: () => void;
  container: any | null;
  carrierOptions: { label: string; value: string }[];
  clientOptions: { label: string; value: string }[];
  routeOptions: { label: string; value: string, origin: string, destination: string }[];
  defaultNumber?: string; // on peut laisser cette prop mais elle ne sera plus utilisée ici
}

const CreateEditContainerDialog: React.FC<CreateEditContainerDialogProps> = ({
  open,
  onClose,
  container,
  carrierOptions,
  clientOptions,
  routeOptions,
  defaultNumber, // pas utilisé, on génère ici systématiquement
}) => {
  const isEditMode = Boolean(container);

  const { register, setValue, reset, handleSubmit, watch } = useForm({
    defaultValues: {
      number: isEditMode ? container?.number || "" : "", // vide initialement en création
      client: isEditMode ? container?.client || "" : "",
      carrier: isEditMode ? container?.carrier || "" : "",
      route: isEditMode ? container?.route || "" : "",
      status: isEditMode ? container?.status || "" : "",
      // Ajoutez ici tous les champs nécessaires...
    }
  });

  // À chaque ouverture du popup en mode création, on génère et définit le numéro de conteneur
  useEffect(() => {
    if (open && !isEditMode) {
      const generatedNumber = generateContainerNumber();
      setValue("number", generatedNumber, { shouldDirty: true });
    }
  }, [open, isEditMode, setValue]);

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
              placeholder="ex: MSCU1234567"
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
