
import React, { useState, FormEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COLLECTIONS } from "@/lib/firebase-collections";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}

const initialFormData: ClientFormData = {
  name: "",
  email: "",
  phone: "",
  address: "",
  notes: ""
};

const CreateClientDialog: React.FC<Props> = ({ open, onOpenChange, onSuccess }) => {
  const [formData, setFormData] = useState<ClientFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      toast.error("Tous les champs obligatoires doivent être remplis");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, COLLECTIONS.FREIGHT.CLIENTS), {
        ...formData,
        createdAt: serverTimestamp()
      });
      
      toast.success("Client créé avec succès");
      handleClose();
      onSuccess?.();
    } catch (error) {
      console.error("Error creating client:", error);
      toast.error("Erreur lors de la création du client");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              name="name"
              placeholder="Nom du client"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <Input
              name="phone"
              placeholder="Téléphone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
            <Input
              name="address"
              placeholder="Adresse"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
            <Textarea
              name="notes"
              placeholder="Notes (facultatif)"
              value={formData.notes}
              onChange={handleInputChange}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                "Créer"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClientDialog;
