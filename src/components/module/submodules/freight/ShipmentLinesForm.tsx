import React, { useState, useEffect } from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShipmentLine } from '@/types/freight';
import { Plus, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ShipmentLinesFormProps {
  onLinesUpdate?: (lines: ShipmentLine[]) => void;
}

const ShipmentLinesForm: React.FC<ShipmentLinesFormProps> = ({ onLinesUpdate }) => {
  const [lines, setLines] = useState<ShipmentLine[]>([
    {
      id: '1',
      productName: '',
      quantity: 1,
      weight: 0,
      cost: 0,
      packageType: 'box'
    }
  ]);

  const packageTypes = [
    { value: 'box', label: 'Carton' },
    { value: 'pallet', label: 'Palette' },
    { value: 'crate', label: 'Caisse' },
    { value: 'bag', label: 'Sac' },
    { value: 'drum', label: 'Fût' },
    { value: 'tube', label: 'Tube' },
    { value: 'roll', label: 'Rouleau' },
    { value: 'other', label: 'Autre' }
  ];

  const addLine = () => {
    const newLine: ShipmentLine = {
      id: Date.now().toString(),
      productName: '',
      quantity: 1,
      weight: 0,
      cost: 0,
      packageType: 'box'
    };
    const updatedLines = [...lines, newLine];
    setLines(updatedLines);
    if (onLinesUpdate) {
      onLinesUpdate(updatedLines);
    }
  };

  const removeLine = (id: string) => {
    if (lines.length > 1) {
      const updatedLines = lines.filter(line => line.id !== id);
      setLines(updatedLines);
      if (onLinesUpdate) {
        onLinesUpdate(updatedLines);
      }
    }
  };

  const updateLine = (id: string, field: keyof ShipmentLine, value: any) => {
    const updatedLines = lines.map(line => 
      line.id === id ? { ...line, [field]: value } : line
    );
    setLines(updatedLines);
    if (onLinesUpdate) {
      onLinesUpdate(updatedLines);
    }
  };

  const calculateTotalCost = () => {
    return lines.reduce((sum, line) => sum + (line.cost * line.quantity), 0);
  };

  const totalWeight = lines.reduce((sum, line) => sum + (line.weight * line.quantity), 0);
  const totalItems = lines.reduce((sum, line) => sum + line.quantity, 0);
  const totalCost = calculateTotalCost();

  useEffect(() => {
    if (onLinesUpdate) {
      onLinesUpdate(lines);
    }
  }, [lines, onLinesUpdate]);

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Article</TableHead>
              <TableHead>Quantité</TableHead>
              <TableHead>Poids (kg)</TableHead>
              <TableHead>Coût unitaire (€)</TableHead>
              <TableHead>Type d'emballage</TableHead>
              <TableHead>Coût total</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lines.map((line) => (
              <TableRow key={line.id}>
                <TableCell>
                  <Input 
                    value={line.productName} 
                    onChange={(e) => updateLine(line.id, 'productName', e.target.value)}
                    placeholder="Nom de l'article"
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    type="number" 
                    min="1"
                    value={line.quantity} 
                    onChange={(e) => updateLine(line.id, 'quantity', parseInt(e.target.value) || 0)}
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    type="number" 
                    min="0"
                    step="0.1"
                    value={line.weight} 
                    onChange={(e) => updateLine(line.id, 'weight', parseFloat(e.target.value) || 0)}
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    type="number"
                    min="0"
                    step="0.01"
                    value={line.cost} 
                    onChange={(e) => updateLine(line.id, 'cost', parseFloat(e.target.value) || 0)}
                  />
                </TableCell>
                <TableCell>
                  <Select 
                    value={line.packageType}
                    onValueChange={(value) => updateLine(line.id, 'packageType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type d'emballage" />
                    </SelectTrigger>
                    <SelectContent>
                      {packageTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  {(line.cost * line.quantity).toFixed(2)} €
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeLine(line.id)}
                    disabled={lines.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-between items-center">
        <Button type="button" variant="outline" onClick={addLine}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une ligne
        </Button>
        
        <div className="text-sm text-right space-y-1">
          <p><strong>Total articles:</strong> {totalItems}</p>
          <p><strong>Poids total:</strong> {totalWeight.toFixed(2)} kg</p>
          <p><strong>Coût total:</strong> {totalCost.toFixed(2)} €</p>
        </div>
      </div>
    </div>
  );
};

export default ShipmentLinesForm;
