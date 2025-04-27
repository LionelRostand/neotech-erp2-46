
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Route } from "@/types/freight/route-types";
import { updateDocument } from "@/hooks/firestore/update-operations";
import { COLLECTIONS } from "@/lib/firebase-collections";
import { toast } from 'sonner';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  route: Route | null;
  onSuccess: () => void;
};

const FreightRouteEditDialog: React.FC<Props> = ({ open, onOpenChange, route, onSuccess }) => {
  const { register, handleSubmit, reset } = useForm<Route>({
    defaultValues: route || {
      id: "", name: "", origin: "", destination: "", distance: 0, estimatedTime: 0, transportType: "road", active: true,
    },
    values: route || undefined,
  });

  React.useEffect(() => {
    if (route) reset(route);
  }, [route, reset]);

  const onSubmit = async (data: Route) => {
    try {
      if (route) {
        await updateDocument(COLLECTIONS.FREIGHT.ROUTES, route.id, {
          ...data,
          id: route.id
        });
        toast.success('Route mise à jour avec succès');
        onSuccess();
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour de la route');
    }
  };

  if (!route) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la route</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mb-2">
          <Input required placeholder="Nom de la route" {...register("name")} />
          <Input required placeholder="Origine" {...register("origin")} />
          <Input required placeholder="Destination" {...register("destination")} />
          <div className="grid grid-cols-2 gap-3">
            <Input type="number" required placeholder="Distance (km)" {...register("distance", { valueAsNumber: true })} />
            <Input type="number" required placeholder="Temps estimé (h)" {...register("estimatedTime", { valueAsNumber: true })} />
          </div>
          <select {...register("transportType")} className="w-full rounded-md border px-3 py-2 text-sm">
            <option value="road">Route</option>
            <option value="sea">Mer</option>
            <option value="air">Air</option>
            <option value="rail">Rail</option>
            <option value="multimodal">Multimodal</option>
          </select>
          <div className="flex gap-3 items-center">
            <input type="checkbox" {...register("active")} className="accent-emerald-600" />
            <span>Active</span>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Annuler</Button>
            <Button type="submit" className="bg-emerald-600 text-white">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FreightRouteEditDialog;
