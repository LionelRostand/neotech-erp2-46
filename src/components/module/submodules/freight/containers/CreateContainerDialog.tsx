
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";

interface CreateContainerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialState = {
  reference: "",
  type: "Standard (Dry)",
  taille: "",
  statut: "Prévu",
  transporteur: "",
  client: "",
  origine: "",
  destination: "",
  pays: "",
  dateDepart: "",
  dateArrivee: "",
};

const CreateContainerDialog: React.FC<CreateContainerDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [tab, setTab] = useState("informations");
  const [form, setForm] = useState(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  // Placeholder submit handler
  const handleCreate = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nouveau conteneur</DialogTitle>
        </DialogHeader>
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="mb-4 grid grid-cols-3 w-full">
            <TabsTrigger value="informations">Informations</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="tarif">Tarification</TabsTrigger>
          </TabsList>
          <TabsContent value="informations" className="space-y-4">
            {/* Champs avec labels visibles */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="reference">Référence</label>
                <Input
                  id="reference"
                  name="reference"
                  value={form.reference}
                  onChange={handleChange}
                  placeholder="CTR-20250421-90427"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="type">Type</label>
                <Input
                  id="type"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  placeholder="Standard (Dry)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="taille">Taille</label>
                <Input
                  id="taille"
                  name="taille"
                  value={form.taille}
                  onChange={handleChange}
                  placeholder="20 pieds"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="statut">Statut</label>
                <Input
                  id="statut"
                  name="statut"
                  value={form.statut}
                  onChange={handleChange}
                  placeholder="Prévu"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="transporteur">Transporteur</label>
                <Input
                  id="transporteur"
                  name="transporteur"
                  value={form.transporteur}
                  onChange={handleChange}
                  placeholder="ex: TEST-TRANSPORT"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="client">Client</label>
                <Input
                  id="client"
                  name="client"
                  value={form.client}
                  onChange={handleChange}
                  placeholder="Sans nom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="origine">Origine</label>
                <Input
                  id="origine"
                  name="origine"
                  value={form.origine}
                  onChange={handleChange}
                  placeholder="CAMEROUN-PARIS"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="pays">Pays</label>
                <Input
                  id="pays"
                  name="pays"
                  value={form.pays}
                  onChange={handleChange}
                  placeholder="CAMEROUN"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="destination">Destination</label>
                <Input
                  id="destination"
                  name="destination"
                  value={form.destination}
                  onChange={handleChange}
                  placeholder="PARIS"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="dateDepart">Date départ</label>
                <div className="relative flex items-center">
                  <Input
                    type="date"
                    id="dateDepart"
                    name="dateDepart"
                    value={form.dateDepart}
                    onChange={handleChange}
                    placeholder="jj/mm/aaaa"
                  />
                  <Calendar className="absolute right-2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              <div></div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="dateArrivee">Date arrivée</label>
                <div className="relative flex items-center">
                  <Input
                    type="date"
                    id="dateArrivee"
                    name="dateArrivee"
                    value={form.dateArrivee}
                    onChange={handleChange}
                    placeholder="jj/mm/aaaa"
                  />
                  <Calendar className="absolute right-2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="articles">
            <div className="text-gray-500 text-center py-10">
              <span>Ajoutez ici les articles pour ce conteneur.</span>
            </div>
          </TabsContent>
          <TabsContent value="tarif">
            <div className="text-gray-500 text-center py-10">
              <span>Fixez le coût selon la distance et le type de conteneur.</span>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleCreate}>Créer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateContainerDialog;
