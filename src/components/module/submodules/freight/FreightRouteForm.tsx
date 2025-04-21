
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { Route as FreightRoute } from "@/types/freight";

const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  origin: z.string().min(2, { message: "L'origine doit être spécifiée" }),
  destination: z.string().min(2, { message: "La destination doit être spécifiée" }),
  distance: z.coerce.number().positive({ message: "La distance doit être positive" }),
  estimatedTime: z.coerce.number().positive({ message: "Le temps estimé doit être positif" }),
  transportType: z.enum(["road", "sea", "air", "rail", "multimodal"]),
  active: z.boolean().default(true),
});

type RouteFormValues = z.infer<typeof formSchema>;

interface FreightRouteFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FreightRoute) => void;
  initialData?: Partial<FreightRoute>;
}

const FreightRouteForm: React.FC<FreightRouteFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}) => {
  const form = useForm<RouteFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      origin: initialData?.origin || "",
      destination: initialData?.destination || "",
      distance: initialData?.distance || 0,
      estimatedTime: initialData?.estimatedTime || 0,
      transportType: initialData?.transportType || "road",
      active: initialData?.active ?? true,
    },
  });

  const handleSubmit = (values: RouteFormValues) => {
    onSubmit({
      id: initialData?.id || '',
      ...values,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Modifier la route" : "Nouvelle route"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Paris - Lyon" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origine</FormLabel>
                    <FormControl>
                      <Input placeholder="Paris" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <FormControl>
                      <Input placeholder="Lyon" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="distance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distance (km)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="estimatedTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temps estimé (h)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="transportType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de transport</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="road">Route</SelectItem>
                      <SelectItem value="sea">Maritime</SelectItem>
                      <SelectItem value="air">Aérien</SelectItem>
                      <SelectItem value="rail">Ferroviaire</SelectItem>
                      <SelectItem value="multimodal">Multimodal</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Active</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button type="submit">
                {initialData ? "Mettre à jour" : "Créer"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FreightRouteForm;
