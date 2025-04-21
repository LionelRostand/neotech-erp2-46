
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash } from "lucide-react";

interface Article {
  id: string;
  description: string;
  quantity: number;
  weight: number;
}

interface Props {
  articles: Article[];
  onChange: (articles: Article[]) => void;
}

const ContainerArticlesTab: React.FC<Props> = ({ articles, onChange }) => {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [weight, setWeight] = useState(0);

  const addArticle = () => {
    if (!description) {
      return;
    }

    const newArticle = {
      id: Date.now().toString(),
      description,
      quantity,
      weight,
    };

    onChange([...articles, newArticle]);
    
    // Reset form
    setDescription("");
    setQuantity(1);
    setWeight(0);
  };

  const removeArticle = (id: string) => {
    onChange(articles.filter((article) => article.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-2 items-end">
        <div className="col-span-6">
          <label className="block text-sm font-medium text-gray-900 mb-1">Description</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description de l'article"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-900 mb-1">Quantité</label>
          <Input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>
        <div className="col-span-3">
          <label className="block text-sm font-medium text-gray-900 mb-1">Poids (kg)</label>
          <Input
            type="number"
            min={0}
            step={0.1}
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
          />
        </div>
        <div className="col-span-1">
          <Button type="button" onClick={addArticle} size="sm" className="w-full">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {articles.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Poids (kg)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {articles.map((article) => (
                <tr key={article.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {article.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {article.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {article.weight}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="ghost"
                      onClick={() => removeArticle(article.id)}
                      size="sm"
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          Aucun article ajouté
        </div>
      )}

      <div className="mt-2 text-sm text-gray-500">
        Total articles: {articles.length} | 
        Poids total: {articles.reduce((acc, article) => acc + article.quantity * article.weight, 0).toFixed(2)} kg
      </div>
    </div>
  );
};

export default ContainerArticlesTab;
