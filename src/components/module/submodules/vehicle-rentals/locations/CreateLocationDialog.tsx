
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

interface CreateLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  address: z.string().min(5, {
    message: "L'adresse doit contenir au moins 5 caractères.",
  }),
  phone: z.string().min(5, {
    message: "Le numéro de téléphone doit contenir au moins 5 caractères.",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }).optional().or(z.literal('')),
  status: z.enum(["active", "inactive"]),
  mondayHours: z.string().optional(),
  tuesdayHours: z.string().optional(),
  wednesdayHours: z.string().optional(),
  thursdayHours: z.string().optional(),
  fridayHours: z.string().optional(),
  saturdayHours: z.string().optional(),
  sundayHours: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

const CreateLocationDialog: React.FC<CreateLocationDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
      status: "active",
      mondayHours: "9:00-18:00",
      tuesdayHours: "9:00-18:00",
      wednesdayHours: "9:00-18:00",
      thursdayHours: "9:00-18:00",
      fridayHours: "9:00-18:00",
      saturdayHours: "10:00-16:00",
      sundayHours: "Fermé",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const openingHours = {
      monday: values.mondayHours || "Fermé",
      tuesday: values.tuesdayHours || "Fermé",
      wednesday: values.wednesdayHours || "Fermé",
      thursday: values.thursdayHours || "Fermé",
      friday: values.fridayHours || "Fermé",
      saturday: values.saturdayHours || "Fermé",
      sunday: values.sundayHours || "Fermé",
    };

    let coordinates = undefined;
    if (values.latitude && values.longitude) {
      coordinates = {
        latitude: parseFloat(values.latitude),
        longitude: parseFloat(values.longitude),
      };
    }

    const locationData = {
      name: values.name,
      address: values.address,
      phone: values.phone,
      email: values.email || undefined,
      isActive: values.status === "active",
      openingHours,
      coordinates,
    };

    onSubmit(locationData);
    toast.success("Nouvel emplacement créé avec succès");
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel emplacement</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de l'emplacement</FormLabel>
                    <FormControl>
                      <Input placeholder="Agence Paris Centre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Statut</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="active" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Actif
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="inactive" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Inactif
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Avenue des Champs-Élysées, 75008 Paris" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input placeholder="+33 1 23 45 67 89" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="paris@autoloc.fr" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">Horaires d'ouverture</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="mondayHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lundi</FormLabel>
                      <FormControl>
                        <Input placeholder="9:00-18:00 ou Fermé" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tuesdayHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mardi</FormLabel>
                      <FormControl>
                        <Input placeholder="9:00-18:00 ou Fermé" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="wednesdayHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mercredi</FormLabel>
                      <FormControl>
                        <Input placeholder="9:00-18:00 ou Fermé" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="thursdayHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jeudi</FormLabel>
                      <FormControl>
                        <Input placeholder="9:00-18:00 ou Fermé" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="fridayHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vendredi</FormLabel>
                      <FormControl>
                        <Input placeholder="9:00-18:00 ou Fermé" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="saturdayHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Samedi</FormLabel>
                      <FormControl>
                        <Input placeholder="10:00-16:00 ou Fermé" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="sundayHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dimanche</FormLabel>
                      <FormControl>
                        <Input placeholder="Fermé" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">Coordonnées GPS (optionnel)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input placeholder="48.8566" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input placeholder="2.3522" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button type="submit">Créer l'emplacement</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLocationDialog;
