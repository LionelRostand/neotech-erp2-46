
import React, { useState } from "react";

interface Article {
  name: string;
  quantity: number;
  weight?: number;
}

interface Props {
  articles: Article[];
  setArticles: (articles: Article[]) => void;
}

const ContainerArticlesTab: React.FC<Props> = ({ articles, setArticles }) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [weight, setWeight] = useState<number | undefined>(undefined);

  const handleAdd = () => {
    if (name && quantity > 0) {
      setArticles([...articles, { name, quantity, weight }]);
      setName("");
      setQuantity(1);
      setWeight(undefined);
    }
  };

  const handleDelete = (idx: number) => {
    setArticles(articles.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Nom de l'article"
          className="border rounded px-2 py-2 flex-1"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Quantité"
          min={1}
          className="border rounded px-2 py-2 w-20"
          value={quantity}
          onChange={e => setQuantity(Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="Poids (kg)"
          min={0}
          className="border rounded px-2 py-2 w-24"
          value={weight ?? ""}
          onChange={e => setWeight(e.target.value ? Number(e.target.value) : undefined)}
        />
        <button
          type="button"
          className="bg-blue-500 text-white px-2 rounded"
          onClick={handleAdd}
        >
          Ajouter
        </button>
      </div>
      <ul>
        {articles.map((art, idx) => (
          <li key={idx} className="flex items-center border-b py-1 gap-2">
            <span className="flex-1">{art.name}</span>
            <span className="w-20 text-center">{art.quantity}</span>
            <span className="w-24 text-center">{art.weight ?? "-"}</span>
            <button
              className="bg-red-500 text-white px-2 ml-2 rounded"
              onClick={() => handleDelete(idx)}
            >
              Supprimer
            </button>
          </li>
        ))}
        {articles.length === 0 && (
          <li className="text-muted-foreground text-sm py-4 text-center">Aucun article ajouté.</li>
        )}
      </ul>
    </div>
  );
};

export default ContainerArticlesTab;
