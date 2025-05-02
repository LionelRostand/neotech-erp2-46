
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Company } from '../types';
import { Building2 } from 'lucide-react';
import { companyService } from '../services/companyService';
import { toast } from 'sonner';

interface EditCompanyDialogProps {
  company: Company;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const EditCompanyDialog: React.FC<EditCompanyDialogProps> = ({ 
  company, 
  open, 
  onClose,
  onSuccess 
}) => {
  const [formData, setFormData] = useState<Partial<Company>>({
    name: company.name || '',
    industry: company.industry || '',
    website: company.website || '',
    phone: company.phone || '',
    email: company.email || '',
    address: {
      street: company.address?.street || '',
      city: company.address?.city || '',
      postalCode: company.address?.postalCode || '',
      country: company.address?.country || ''
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name?.trim()) {
      toast.error("Le nom de l'entreprise est requis");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await companyService.updateCompany(company.id, formData);
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
        toast.success("L'entreprise a été mise à jour avec succès");
      }
    } catch (error) {
      console.error('Error updating company:', error);
      toast.error("Une erreur est survenue lors de la mise à jour de l'entreprise");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Modifier l'entreprise
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom*
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="industry" className="text-right">
                Secteur
              </Label>
              <Input
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="website" className="text-right">
                Site web
              </Label>
              <Input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Téléphone
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address.street" className="text-right">
                Adresse
              </Label>
              <Input
                id="address.street"
                name="address.street"
                value={formData.address?.street}
                onChange={handleChange}
                placeholder="Rue"
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address.city" className="text-right">
                Ville
              </Label>
              <Input
                id="address.city"
                name="address.city"
                value={formData.address?.city}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address.postalCode" className="text-right">
                Code postal
              </Label>
              <Input
                id="address.postalCode"
                name="address.postalCode"
                value={formData.address?.postalCode}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address.country" className="text-right">
                Pays
              </Label>
              <Input
                id="address.country"
                name="address.country"
                value={formData.address?.country}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCompanyDialog;
