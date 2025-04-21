
import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/patched-select";

const generateContainerNumber = () => {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.floor(10000 + Math.random() * 90000).toString();
  return `CTR-${datePart}-${randomPart}`;
};

interface Option {
  label: string;
  value: string;
}

interface RouteOption extends Option {
  origin: string;
  destination: string;
}

interface CreateEditContainerDialogProps {
  open: boolean;
  onClose: () => void;
  container: any | null;
  carrierOptions: Option[];
  clientOptions: Option[];
  routeOptions: RouteOption[];
  defaultNumber?: string;
}

const STATUS_OPTIONS = [
  { label: "À quai", value: "quay" },
  { label: "En transit", value: "transit" },
  { label: "Livré", value: "delivered" },
  { label: "Stocké", value: "stocked" },
  { label: "Autre", value: "other" },
];

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

  const { register, setValue, reset, handleSubmit, watch, formState } = useForm({
    defaultValues: {
      number: isEditMode ? container?.number || "" : "",
      client: isEditMode ? container?.client || "" : "",
      carrier: isEditMode ? container?.carrier || "" : "",
      route: isEditMode ? container?.route || "" : "",
      status: isEditMode ? container?.status || "" : "",
    },
  });

  // Auto-générer le numéro lors de l'ouverture du popup en mode création
  useEffect(() => {
    if (open && !isEditMode) {
      const generatedNumber = generateContainerNumber();
      setValue("number", generatedNumber, { shouldDirty: true });
      reset({
        number: generatedNumber,
        client: "",
        carrier: "",
        route: "",
        status: "",
      });
    } else if (open && isEditMode) {
      // Pour l'édition, reset avec les valeurs existantes
      reset({
        number: container?.number || "",
        client: container?.client || "",
        carrier: container?.carrier || "",
        route: container?.route || "",
        status: container?.status || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isEditMode]);

  // Pour éviter un warning si select ne reçoit pas string
  const selectedClient = watch("client") || "";
  const selectedCarrier = watch("carrier") || "";
  const selectedRoute = watch("route") || "";
  const selectedStatus = watch("status") || "";

  const onSubmit = (data: any) => {
    // Enregistrement ou modification
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
            {/* Numéro de conteneur */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Numéro de conteneur <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("number", { required: true })}
                disabled
                data-testid="container-number"
                placeholder="ex: MSCU1234567"
              />
            </div>

            {/* Client */}
            <div>
              <label className="block text-sm font-medium mb-1">Client <span className="text-red-500">*</span></label>
              <Select
                value={selectedClient}
                onValueChange={val => setValue("client", val, { shouldDirty: true })}
                disabled={isEditMode}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-white">
                  {clientOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Transporteur */}
            <div>
              <label className="block text-sm font-medium mb-1">Transporteur <span className="text-red-500">*</span></label>
              <Select
                value={selectedCarrier}
                onValueChange={val => setValue("carrier", val, { shouldDirty: true })}
                disabled={isEditMode}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un transporteur" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-white">
                  {carrierOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Trajet / Route */}
            <div>
              <label className="block text-sm font-medium mb-1">Trajet <span className="text-red-500">*</span></label>
              <Select
                value={selectedRoute}
                onValueChange={val => setValue("route", val, { shouldDirty: true })}
                disabled={isEditMode}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un trajet" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-white">
                  {routeOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Statut */}
            <div>
              <label className="block text-sm font-medium mb-1">Statut <span className="text-red-500">*</span></label>
              <Select
                value={selectedStatus}
                onValueChange={val => setValue("status", val, { shouldDirty: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-white">
                  {STATUS_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-4">
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
