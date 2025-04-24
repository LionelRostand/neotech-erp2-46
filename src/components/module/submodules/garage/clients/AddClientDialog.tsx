
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGarageClients } from '@/hooks/garage/useGarageClients';
import { Loader2 } from "lucide-react";

interface AddClientDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClientAdded?: () => void;
}

const AddClientDialog: React.FC<AddClientDialogProps> = ({
  isOpen,
  onOpenChange,
  onClientAdded
}) => {
  const { addClient } = useGarageClients();
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addClient(formData);
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        notes: ''
      });
      
      // Call onClientAdded callback if provided
      if (onClientAdded) {
        onClientAdded();
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du client:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!isSubmitting) {
        onOpenChange(open);
      }
    }}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nouveau Client</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom *</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Nom *</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone *</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="col-span-2 space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="col-span-2 space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
          
          <DialogFooter className="col-span-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ajout en cours...
                </>
              ) : (
                'Ajouter le client'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClientDialog;
