
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Container } from "@/types/freight";
import { CalendarIcon, Boxes, DollarSign, TruckIcon, PackageCheck, MapPinIcon } from "lucide-react";

interface ContainerViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  container: Container;
}

const ContainerViewDialog: React.FC<ContainerViewDialogProps> = ({
  open,
  onOpenChange,
  container,
}) => {
  // Exemple de données pour les articles et coûts (à remplacer par des données réelles)
  const articles = container.articles || [];
  const costs = container.costs || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Conteneur {container.number}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex items-center gap-2">
            <PackageCheck size={18} className="text-gray-500" />
            <div>
              <div className="text-sm text-gray-500">Type</div>
              <div className="font-medium">{container.type}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Boxes size={18} className="text-gray-500" />
            <div>
              <div className="text-sm text-gray-500">Taille</div>
              <div className="font-medium">{container.size}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TruckIcon size={18} className="text-gray-500" />
            <div>
              <div className="text-sm text-gray-500">Transporteur</div>
              <div className="font-medium">{container.carrierName || "Non spécifié"}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div>
              <div className="text-sm text-gray-500">Statut</div>
              <div>
                <span 
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    container.status === 'en transit' ? 'bg-blue-100 text-blue-800' :
                    container.status === 'livré' ? 'bg-green-100 text-green-800' :
                    container.status === 'en attente' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}
                >
                  {container.status}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon size={18} className="text-gray-500" />
            <div>
              <div className="text-sm text-gray-500">Origine</div>
              <div className="font-medium">{container.origin || "Non spécifié"}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon size={18} className="text-gray-500" />
            <div>
              <div className="text-sm text-gray-500">Destination</div>
              <div className="font-medium">{container.destination || "Non spécifié"}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon size={18} className="text-gray-500" />
            <div>
              <div className="text-sm text-gray-500">Départ</div>
              <div className="font-medium">
                {container.departureDate 
                  ? new Date(container.departureDate).toLocaleDateString() 
                  : "Non spécifié"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon size={18} className="text-gray-500" />
            <div>
              <div className="text-sm text-gray-500">Arrivée prévue</div>
              <div className="font-medium">
                {container.arrivalDate 
                  ? new Date(container.arrivalDate).toLocaleDateString() 
                  : "Non spécifié"}
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="articles" className="w-full mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <Boxes size={16} />
              <span>Articles</span>
            </TabsTrigger>
            <TabsTrigger value="costs" className="flex items-center gap-2">
              <DollarSign size={16} />
              <span>Coûts</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="articles" className="mt-4">
            {articles.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-md">
                <p className="text-gray-500">Aucun article associé à ce conteneur</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Description</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Quantité</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Poids (kg)</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Valeur</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map((article: any, index: number) => (
                      <tr key={index} className="border-b">
                        <td className="px-4 py-2">{article.description}</td>
                        <td className="px-4 py-2">{article.quantity}</td>
                        <td className="px-4 py-2">{article.weight}</td>
                        <td className="px-4 py-2">{article.value} €</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
          <TabsContent value="costs" className="mt-4">
            {costs.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-md">
                <p className="text-gray-500">Aucun coût associé à ce conteneur</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Description</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Type</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Montant</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {costs.map((cost: any, index: number) => (
                      <tr key={index} className="border-b">
                        <td className="px-4 py-2">{cost.description}</td>
                        <td className="px-4 py-2">{cost.type}</td>
                        <td className="px-4 py-2">{cost.amount} €</td>
                        <td className="px-4 py-2">
                          {cost.date ? new Date(cost.date).toLocaleDateString() : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContainerViewDialog;
