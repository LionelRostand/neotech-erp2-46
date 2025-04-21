
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Route } from "@/types/freight";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  route: Route | null;
  onSubmit: (route: Route) => Promise<void>;
  submitting: boolean;
};

const FreightRouteEditDialog: React.FC<Props> = ({ open, onOpenChange, route, onSubmit, submitting }) => {
  const { register, handleSubmit, reset } = useForm<Route>({
    defaultValues: route || {
      id: "", name: "", origin: "", destination: "", distance: 0, estimatedTime: 0, transportType: "road", active: true,
    },
    values: route || undefined,
  });

  React.useEffect(() => {
    if (route) reset(route);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);

  const _onSubmit = (data: Route) => {
    // force id to stay the same
    if (route) {
      onSubmit({ ...data, id: route.id });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la route</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(_onSubmit)} className="space-y-3 mb-2">
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
            <Button type="submit" className="bg-emerald-600 text-white" loading={submitting}>Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FreightRouteEditDialog;
