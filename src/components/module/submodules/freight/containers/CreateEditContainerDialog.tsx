
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCollectionData } from "@/hooks/useCollectionData";
import { toast } from "sonner";

// Définition du schéma de validation
const containerSchema = z.object({
  number: z.string().min(1, "Le numéro de conteneur est requis"),
  type: z.string().min(1, "Le type de conteneur est requis"),
  size: z.string().min(1, "La taille du conteneur est requise"),
  status: z.string().min(1, "Le statut est requis"),
  origin: z.string().min(1, "L'origine est requise"),
  destination: z.string().min(1, "La destination est requise"),
  client: z.string().min(1, "Le client est requis"),
  carrierName: z.string().min(1, "Le transporteur est requis"),
  departureDate: z.string().optional(),
  arrivalDate: z.string().optional(),
});

// Types pour les props
interface CreateEditContainerDialogProps {
  open: boolean;
  onClose: () => void;
  container: any | null;
  onSave: (data: any) => void;
  defaultNumber?: string;
}

const CreateEditContainerDialog: React.FC<CreateEditContainerDialogProps> = ({
  open,
  onClose,
  container,
  onSave,
  defaultNumber,
}) => {
  // Récupération des données de référence depuis Firestore
  const { data: clients = [], isLoading: isLoadingClients } = useCollectionData("crm_clients");
  const { data: carriers = [], isLoading: isLoadingCarriers } = useCollectionData("freight_carriers");
  const { data: routes = [], isLoading: isLoadingRoutes } = useCollectionData("freight_routes");

  // État local pour stocker les valeurs par défaut
  const [defaultValues, setDefaultValues] = useState({
    number: defaultNumber || "",
    type: "Standard",
    size: "40'",
    status: "En attente",
    origin: "",
    destination: "",
    client: "",
    carrierName: "",
    departureDate: "",
    arrivalDate: "",
  });

  // Configurer le formulaire
  const form = useForm<z.infer<typeof containerSchema>>({
    resolver: zodResolver(containerSchema),
    defaultValues,
  });

  // Mettre à jour les valeurs par défaut lorsque les props changent
  useEffect(() => {
    if (container) {
      // Mode édition: charger les données existantes
      setDefaultValues({
        number: container.number || "",
        type: container.type || "Standard",
        size: container.size || "40'",
        status: container.status || "En attente",
        origin: container.origin || "",
        destination: container.destination || "",
        client: container.client || "",
        carrierName: container.carrierName || "",
        departureDate: container.departureDate || "",
        arrivalDate: container.arrivalDate || "",
      });
      
      // Reset the form with the new values
      form.reset({
        number: container.number || "",
        type: container.type || "Standard",
        size: container.size || "40'",
        status: container.status || "En attente",
        origin: container.origin || "",
        destination: container.destination || "",
        client: container.client || "",
        carrierName: container.carrierName || "",
        departureDate: container.departureDate || "",
        arrivalDate: container.arrivalDate || "",
      });
    } else {
      // Mode création: utiliser les valeurs par défaut
      setDefaultValues(prev => ({
        ...prev,
        number: defaultNumber || "",
      }));
      
      // Reset the form with the default values
      form.reset({
        ...defaultValues,
        number: defaultNumber || "",
      });
    }
  }, [container, defaultNumber, form]);

  // Gérer la soumission du formulaire
  const onSubmit = (data: z.infer<typeof containerSchema>) => {
    try {
      onSave(data);
      toast.success(container ? "Conteneur modifié avec succès" : "Conteneur créé avec succès");
      form.reset();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {container ? "Modifier le conteneur" : "Nouveau conteneur"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Numéro de conteneur */}
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de conteneur</FormLabel>
                    <FormControl>
                      <Input placeholder="CTR-20240421-12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Type de conteneur */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Standard">Standard</SelectItem>
                        <SelectItem value="Réfrigéré">Réfrigéré</SelectItem>
                        <SelectItem value="Open Top">Open Top</SelectItem>
                        <SelectItem value="Flat Rack">Flat Rack</SelectItem>
                        <SelectItem value="Tank">Tank</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Taille */}
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taille</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une taille" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="20'">20'</SelectItem>
                        <SelectItem value="40'">40'</SelectItem>
                        <SelectItem value="45'">45'</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Statut */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="En attente">En attente</SelectItem>
                        <SelectItem value="En préparation">En préparation</SelectItem>
                        <SelectItem value="En transit">En transit</SelectItem>
                        <SelectItem value="Livré">Livré</SelectItem>
                        <SelectItem value="Retourné">Retourné</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Origine */}
              <FormField
                control={form.control}
                name="origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origine</FormLabel>
                    <FormControl>
                      <Input placeholder="Ville d'origine" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Destination */}
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <FormControl>
                      <Input placeholder="Ville de destination" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Client */}
              <FormField
                control={form.control}
                name="client"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingClients ? (
                          <SelectItem value="">Chargement...</SelectItem>
                        ) : clients && clients.length > 0 ? (
                          clients.map((client: any) => (
                            <SelectItem key={client.id} value={client.name || client.companyName || "Client sans nom"}>
                              {client.name || client.companyName || "Client sans nom"}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="">Aucun client disponible</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Transporteur */}
              <FormField
                control={form.control}
                name="carrierName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transporteur</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un transporteur" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingCarriers ? (
                          <SelectItem value="">Chargement...</SelectItem>
                        ) : carriers && carriers.length > 0 ? (
                          carriers.map((carrier: any) => (
                            <SelectItem key={carrier.id} value={carrier.name || "Transporteur sans nom"}>
                              {carrier.name || "Transporteur sans nom"}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="">Aucun transporteur disponible</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date de départ */}
              <FormField
                control={form.control}
                name="departureDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de départ</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date d'arrivée */}
              <FormField
                control={form.control}
                name="arrivalDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date d'arrivée</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit">
                {container ? "Mettre à jour" : "Enregistrer"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEditContainerDialog;
