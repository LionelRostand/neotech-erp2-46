
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/patched-select";
import { useFreightClients } from "@/components/module/submodules/freight/hooks/useFreightClients";
import { useCarriers } from "@/components/module/submodules/freight/hooks/useCarriers";
import { useRoutes } from "@/components/module/submodules/freight/hooks/useRoutes";

interface CreateContainerDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const initialForm = {
  reference: "",
  type: "",
  size: "",
  status: "",
  carrier: "",
  client: "",
  origin: "",
  destination: "",
  departureDate: "",
  arrivalDate: "",
  routeId: "",
};

const CreateContainerDialog: React.FC<CreateContainerDialogProps> = ({ open, onOpenChange }) => {
  const [form, setForm] = useState(initialForm);

  // Get lists from hooks
  const { clients } = useFreightClients();
  const { carriers } = useCarriers();
  const { routes } = useRoutes();

  // Préremplissage Origine/Destination via sélection route
  useEffect(() => {
    if (form.routeId && routes.length > 0) {
      const route = routes.find((r: any) => r.id === form.routeId);
      if (route) {
        setForm(f => ({
          ...f,
          origin: route.origin || "",
          destination: route.destination || ""
        }));
      }
    }
  }, [form.routeId, routes]);

  // Gestion champs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSelect = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  // Création du conteneur (ne rien changer à la logique ici)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ... garder la logique actuelle pour créer un conteneur
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nouveau conteneur</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mt-2">
          {/* Ligne 1 */}
          <div>
            <Label htmlFor="reference">Référence</Label>
            <Input id="reference" name="reference" value={form.reference} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <Input id="type" name="type" value={form.type} onChange={handleChange} required />
          </div>

          {/* Ligne 2 */}
          <div>
            <Label htmlFor="size">Taille</Label>
            <Input id="size" name="size" value={form.size} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="status">Statut</Label>
            <Input id="status" name="status" value={form.status} onChange={handleChange} />
          </div>

          {/* Ligne 3: Transporteur & Client */}
          <div>
            <Label>Transporteur</Label>
            <Select value={form.carrier} onValueChange={v => handleSelect("carrier", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un transporteur" />
              </SelectTrigger>
              <SelectContent>
                {carriers && carriers.length > 0
                  ? carriers.map((carrier: any) => (
                      <SelectItem key={carrier.id} value={carrier.name}>{carrier.name}</SelectItem>
                    ))
                  : <SelectItem value="">Aucun transporteur disponible</SelectItem>
                }
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Client</Label>
            <Select value={form.client} onValueChange={v => handleSelect("client", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                {clients && clients.length > 0
                  ? clients.map((client: any) => (
                      <SelectItem key={client.id} value={client.name}>{client.name}</SelectItem>
                    ))
                  : <SelectItem value="">Aucun client disponible</SelectItem>
                }
              </SelectContent>
            </Select>
          </div>

          {/* Ligne 4: Sélecteur de route */}
          <div className="col-span-2">
            <Label>Route</Label>
            <Select value={form.routeId} onValueChange={v => handleSelect("routeId", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une route" />
              </SelectTrigger>
              <SelectContent>
                {routes && routes.length > 0
                  ? routes.map((r: any) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name} ({r.origin} → {r.destination})
                      </SelectItem>
                    ))
                  : <SelectItem value="">Aucune route disponible</SelectItem>
                }
              </SelectContent>
            </Select>
          </div>

          {/* Ligne 5: Origine/Destination */}
          <div>
            <Label htmlFor="origin">Origine</Label>
            <Input id="origin" name="origin" value={form.origin} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="destination">Destination</Label>
            <Input id="destination" name="destination" value={form.destination} onChange={handleChange} />
          </div>

          {/* Ligne 6: Dates */}
          <div>
            <Label htmlFor="departureDate">Date départ</Label>
            <Input id="departureDate" name="departureDate" type="date" value={form.departureDate} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="arrivalDate">Date arrivée</Label>
            <Input id="arrivalDate" name="arrivalDate" type="date" value={form.arrivalDate} onChange={handleChange} />
          </div>

          {/* Actions */}
          <div className="col-span-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">Créer</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateContainerDialog;
