
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";

export interface ContainerArticle {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  weight: number;
  value?: number;
}

interface Props {
  articles: ContainerArticle[];
  onChange: (items: ContainerArticle[]) => void;
}

const defaultArticle = (): ContainerArticle => ({
  id: Date.now().toString() + Math.random(),
  name: "",
  description: "",
  quantity: 1,
  weight: 0,
  value: undefined
});

const ContainerArticlesForm: React.FC<Props> = ({ articles, onChange }) => {
  const [articleLines, setArticleLines] = useState<ContainerArticle[]>(articles?.length ? articles : [defaultArticle()]);

  useEffect(() => {
    onChange(articleLines);
    // eslint-disable-next-line
  }, [articleLines]);

  const addLine = () => setArticleLines(lines => [...lines, defaultArticle()]);

  const removeLine = (id: string) => {
    if (articleLines.length > 1) {
      setArticleLines(lines => lines.filter(l => l.id !== id));
    }
  };

  const updateLine = (id: string, key: keyof ContainerArticle, value: any) => {
    setArticleLines(lines =>
      lines.map(line =>
        line.id === id ? { ...line, [key]: value } : line
      )
    );
  };

  return (
    <div className="space-y-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Quantité</TableHead>
            <TableHead>Poids (kg)</TableHead>
            <TableHead>Valeur (€)</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {articleLines.map(line => (
            <TableRow key={line.id}>
              <TableCell>
                <Input value={line.name} onChange={e => updateLine(line.id, "name", e.target.value)} placeholder="Article" />
              </TableCell>
              <TableCell>
                <Input value={line.description ?? ''} onChange={e => updateLine(line.id, "description", e.target.value)} placeholder="Description" />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  min={1}
                  value={line.quantity}
                  onChange={e => updateLine(line.id, "quantity", parseInt(e.target.value, 10) || 0)}
                  className="w-20"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  min={0}
                  step={0.1}
                  value={line.weight}
                  onChange={e => updateLine(line.id, "weight", parseFloat(e.target.value) || 0)}
                  className="w-24"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={line.value ?? ""}
                  onChange={e => updateLine(line.id, "value", parseFloat(e.target.value) || undefined)}
                  className="w-24"
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  title="Supprimer"
                  onClick={() => removeLine(line.id)}
                  disabled={articleLines.length <= 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div>
        <Button type="button" variant="outline" onClick={addLine}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un article
        </Button>
      </div>
    </div>
  );
};

export default ContainerArticlesForm;

