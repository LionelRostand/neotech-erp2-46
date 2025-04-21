
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Article {
  name: string;
  quantity: number;
  weight?: number;
}

interface Props {
  articles?: Article[];
  setArticles?: (articles: Article[]) => void;
}

const ContainerArticlesTab: React.FC<Props> = ({ articles = [], setArticles }) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [weight, setWeight] = useState<number | undefined>(undefined);

  const handleAdd = () => {
    if (!setArticles) return; // Exit if setArticles is not provided
    
    if (name && quantity > 0) {
      setArticles([...articles, { name, quantity, weight }]);
      setName("");
      setQuantity(1);
      setWeight(undefined);
    }
  };

  const handleDelete = (idx: number) => {
    if (!setArticles) return; // Exit if setArticles is not provided
    
    setArticles(articles.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 mb-4">
        <div>
          <Label htmlFor="articleName">Nom de l'article</Label>
          <Input
            id="articleName"
            placeholder="ex: Téléviseur 55 pouces"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={!setArticles}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="quantity">Quantité</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              disabled={!setArticles}
            />
          </div>
          <div>
            <Label htmlFor="weight">Poids (kg)</Label>
            <Input
              id="weight"
              type="number"
              min={0}
              placeholder="Optionnel"
              value={weight ?? ""}
              onChange={e => setWeight(e.target.value ? Number(e.target.value) : undefined)}
              disabled={!setArticles}
            />
          </div>
        </div>
        
        {setArticles && (
          <Button 
            type="button" 
            onClick={handleAdd}
            disabled={!name || quantity < 1}
            className="self-end"
          >
            Ajouter l'article
          </Button>
        )}
      </div>

      <div className="mt-6">
        <h3 className="font-medium mb-2">Articles ({articles.length})</h3>
        
        {articles.length > 0 ? (
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Article
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Poids
                  </th>
                  {setArticles && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {articles.map((article, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {article.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {article.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {article.weight ? `${article.weight} kg` : "-"}
                    </td>
                    {setArticles && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDelete(idx)}
                        >
                          Supprimer
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-4 border rounded-md bg-gray-50 text-gray-500">
            Aucun article ajouté
          </div>
        )}
      </div>
    </div>
  );
};

export default ContainerArticlesTab;
