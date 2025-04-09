
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { addDocument } from '@/hooks/firestore/create-operations';
import { updateDocument } from '@/hooks/firestore/update-operations';
import { Invoice } from '../types/accounting-types';

interface InvoiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  invoice?: Invoice; // If provided, we're in edit mode
}

const InvoiceFormDialog: React.FC<InvoiceFormDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
  invoice
}) => {
  const isEditMode = !!invoice;
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Partial<Invoice>>(
    isEditMode 
      ? { ...invoice } 
      : {
          invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
          clientName: '',
          clientEmail: '',
          issueDate: format(new Date(), 'yyyy-MM-dd'),
          dueDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
          items: [],
          notes: '',
          status: 'draft',
          total: 0,
          currency: 'EUR'
        }
  );
  
  const [issueDate, setIssueDate] = useState<Date | undefined>(
    isEditMode && invoice.issueDate ? new Date(invoice.issueDate) : new Date()
  );
  
  const [dueDate, setDueDate] = useState<Date | undefined>(
    isEditMode && invoice.dueDate ? new Date(invoice.dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  );
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value }));
  };
  
  const handleCurrencyChange = (value: string) => {
    setFormData(prev => ({ ...prev, currency: value }));
  };
  
  const handleSave = async () => {
    try {
      // Update dates with the selected values
      const dataToSave = {
        ...formData,
        issueDate: issueDate ? format(issueDate, 'yyyy-MM-dd') : undefined,
        dueDate: dueDate ? format(dueDate, 'yyyy-MM-dd') : undefined,
        // We would typically calculate the total from items, but for simplicity:
        total: parseFloat(formData.total?.toString() || '0')
      };
      
      if (isEditMode && invoice) {
        // Update existing invoice
        await updateDocument(COLLECTIONS.ACCOUNTING.INVOICES, invoice.id, dataToSave);
        toast({
          title: "Facture mise à jour",
          description: `La facture ${formData.invoiceNumber} a été mise à jour avec succès.`
        });
      } else {
        // Create new invoice
        await addDocument(COLLECTIONS.ACCOUNTING.INVOICES, dataToSave);
        toast({
          title: "Facture créée",
          description: `La facture ${formData.invoiceNumber} a été créée avec succès.`
        });
      }
      
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde de la facture:", error);
      toast({
        title: "Erreur",
        description: `Impossible de sauvegarder la facture: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Modifier la facture' : 'Nouvelle facture'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Numéro de facture</Label>
              <Input
                id="invoiceNumber"
                name="invoiceNumber"
                value={formData.invoiceNumber || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status || 'draft'}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="sent">Envoyée</SelectItem>
                  <SelectItem value="paid">Payée</SelectItem>
                  <SelectItem value="overdue">En retard</SelectItem>
                  <SelectItem value="cancelled">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Nom du client</Label>
              <Input
                id="clientName"
                name="clientName"
                value={formData.clientName || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="clientEmail">Email du client</Label>
              <Input
                id="clientEmail"
                name="clientEmail"
                type="email"
                value={formData.clientEmail || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issueDate">Date d'émission</Label>
              <DatePicker
                date={issueDate}
                onSelect={setIssueDate}
                placeholder="Sélectionner une date"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDate">Date d'échéance</Label>
              <DatePicker
                date={dueDate}
                onSelect={setDueDate}
                placeholder="Sélectionner une date"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="total">Montant total</Label>
              <Input
                id="total"
                name="total"
                type="number"
                value={formData.total || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Devise</Label>
              <Select
                value={formData.currency || 'EUR'}
                onValueChange={handleCurrencyChange}
              >
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Devise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                  <SelectItem value="USD">Dollar US ($)</SelectItem>
                  <SelectItem value="GBP">Livre sterling (£)</SelectItem>
                  <SelectItem value="CHF">Franc suisse (CHF)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes || ''}
              onChange={handleInputChange}
              rows={4}
            />
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button type="button" onClick={handleSave}>
            {isEditMode ? 'Mettre à jour' : 'Créer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceFormDialog;
