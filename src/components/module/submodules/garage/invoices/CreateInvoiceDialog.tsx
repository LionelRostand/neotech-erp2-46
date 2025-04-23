
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Invoice, InvoiceItem } from '../types/garage-types';

interface CreateInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (invoice: Partial<Invoice>) => void;
  repairs: any[];
  clientsMap: Record<string, string>;
  vehiclesMap: Record<string, string>;
}

const CreateInvoiceDialog = ({
  open,
  onOpenChange,
  onSave,
  repairs,
  clientsMap,
  vehiclesMap,
}: CreateInvoiceDialogProps) => {
  const [items, setItems] = React.useState<InvoiceItem[]>([]);
  const [selectedRepair, setSelectedRepair] = React.useState('no-repair');

  const handleAddItem = () => {
    setItems([...items, {
      id: `ITEM${Date.now()}`,
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
      type: 'part'
    }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const invoice: Partial<Invoice> = {
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'draft',
      items: items,
      subtotal: items.reduce((sum, item) => sum + item.total, 0),
      tax: items.reduce((sum, item) => sum + item.total * 0.2, 0),
      total: items.reduce((sum, item) => sum + item.total * 1.2, 0),
    };
    onSave(invoice);
  };

  // If repairs is empty, provide a default non-empty value
  const hasRepairs = repairs && repairs.length > 0;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nouvelle facture</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label>Réparation associée</Label>
              <Select 
                value={selectedRepair} 
                onValueChange={setSelectedRepair}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une réparation" />
                </SelectTrigger>
                <SelectContent>
                  {!hasRepairs ? (
                    <SelectItem value="no-repair">Aucune réparation disponible</SelectItem>
                  ) : (
                    repairs.map((repair) => (
                      <SelectItem key={repair.id} value={repair.id}>
                        {repair.description} - {repair.vehicleName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="border p-4 rounded-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Articles</h3>
                <Button type="button" variant="outline" onClick={handleAddItem}>
                  Ajouter un article
                </Button>
              </div>
              
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 mb-2">
                  <div className="col-span-5">
                    <Input 
                      placeholder="Description"
                      name={`items[${index}].description`}
                    />
                  </div>
                  <div className="col-span-2">
                    <Input 
                      type="number"
                      placeholder="Quantité"
                      name={`items[${index}].quantity`}
                    />
                  </div>
                  <div className="col-span-2">
                    <Input 
                      type="number"
                      placeholder="Prix unitaire"
                      name={`items[${index}].unitPrice`}
                    />
                  </div>
                  <div className="col-span-3">
                    <Select 
                      defaultValue={item.type || 'part'}
                      name={`items[${index}].type`}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="part">Pièce</SelectItem>
                        <SelectItem value="labor">Main d'œuvre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea name="notes" placeholder="Notes ou commentaires..." />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Créer la facture
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInvoiceDialog;
