
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Définition des types pour le formulaire
const defaultValues = {
  name: '',
  origin: '',
  destination: '',
  transportType: '',
  distance: '',
  estimatedTime: '',
  active: true,
};

const TRANSPORT_TYPES = [
  { value: 'road', label: 'Routier' },
  { value: 'sea', label: 'Maritime' },
  { value: 'air', label: 'Aérien' },
  { value: 'rail', label: 'Ferroviaire' },
  { value: 'multimodal', label: 'Multimodal' },
];

const AddRouteDialog = ({ open, onOpenChange, onSuccess }: { open: boolean; onOpenChange: (b: boolean) => void; onSuccess: () => void }) => {
  const form = useForm({
    defaultValues,
  });

  const onSubmit = async (values: any) => {
    try {
      await addDoc(collection(db, "freight_routes"), {
        name: values.name,
        origin: values.origin,
        destination: values.destination,
        transportType: values.transportType,
        distance: Number(values.distance),
        estimatedTime: Number(values.estimatedTime),
        active: values.active
      });
      toast.success("Route ajoutée avec succès !");
      onSuccess();
      form.reset(defaultValues);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'ajout de la route.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle route</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de la route</FormLabel>
                  <FormControl>
                    <Input {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origine</FormLabel>
                    <FormControl>
                      <Input {...field} required />
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
                      <Input {...field} required />
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
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TRANSPORT_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="distance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distance (km)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.1" {...field} required onChange={e => field.onChange(e.target.value)} />
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
                    <FormLabel>Temps estimé (heures)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.1" {...field} required onChange={e => field.onChange(e.target.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={field.value} onChange={e => field.onChange(e.target.checked)} />
                    <span>Active</span>
                  </label>
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit">Ajouter la route</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRouteDialog;

