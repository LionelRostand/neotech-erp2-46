
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import type { Route as FreightRoute } from "@/types/freight";

type FreightRouteFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (route: FreightRoute) => void;
};

const DEFAULT_VALUES = {
  name: "",
  origin: "",
  destination: "",
  distance: 0,
  estimatedTime: 0,
  transportType: "road",
  active: true,
};

const FreightRouteForm: React.FC<FreightRouteFormProps> = ({ open, onOpenChange, onSubmit }) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: DEFAULT_VALUES,
  });

  const submitHandler = (data: Omit<FreightRoute, "id">) => {
    // Ensure distance and estimatedTime are numbers
    const formattedData = {
      ...data,
      distance: Number(data.distance),
      estimatedTime: Number(data.estimatedTime),
    };
    
    onSubmit({ ...formattedData, id: "" });
    reset(DEFAULT_VALUES);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => { onOpenChange(open); if (!open) reset(DEFAULT_VALUES); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvelle Route</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4 mt-2">
          <Input required placeholder="Nom de la route" {...register("name")} />
          <Input required placeholder="Origine" {...register("origin")} />
          <Input required placeholder="Destination" {...register("destination")} />
          <div className="grid grid-cols-2 gap-3">
            <Input 
              type="number" 
              required 
              placeholder="Distance (km)" 
              {...register("distance", { valueAsNumber: true })} 
            />
            <Input 
              type="number" 
              required 
              placeholder="Temps estimé (h)" 
              {...register("estimatedTime", { valueAsNumber: true })} 
            />
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
          <div className="flex justify-between gap-4 pt-3">
            <Button type="button" variant="secondary" onClick={() => { onOpenChange(false); reset(DEFAULT_VALUES); }}>Annuler</Button>
            <Button type="submit" className="bg-emerald-600 text-white">Enregistrer</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FreightRouteForm;
