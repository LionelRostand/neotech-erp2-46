
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Company } from '../types';
import { Building2, Mail, Phone, Globe, MapPin, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ViewCompanyDialogProps {
  company: Company | null;
  open: boolean;
  onClose: () => void;
}

const ViewCompanyDialog: React.FC<ViewCompanyDialogProps> = ({ company, open, onClose }) => {
  // Return early if company is undefined or null
  if (!company) return null;

  // Format creation date safely
  const formatDate = (dateString: string | undefined) => {
    try {
      if (!dateString) return 'Date non spécifiée';
      const date = parseISO(dateString);
      return format(date, 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date inconnue';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            {company.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Informations générales</h3>
              <div className="space-y-2">
                <p className="text-sm flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  Secteur: {company.industry || 'Non spécifié'}
                </p>
                <p className="text-sm flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email: {company.email || 'Non spécifié'}
                </p>
                <p className="text-sm flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Téléphone: {company.phone || 'Non spécifié'}
                </p>
                <p className="text-sm flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  Site web: {company.website || 'Non spécifié'}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Adresse</h3>
              <div className="space-y-2">
                <p className="text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {company.address?.street || 'Adresse non spécifiée'}
                </p>
                {company.address?.city && (
                  <p className="text-sm pl-6">
                    {company.address.city}, {company.address.postalCode || ''}
                  </p>
                )}
                {company.address?.country && (
                  <p className="text-sm pl-6">{company.address.country}</p>
                )}
              </div>
            </div>
          </div>

          {company.notes && (
            <div>
              <h3 className="font-semibold mb-2">Notes</h3>
              <p className="text-sm text-muted-foreground">{company.notes}</p>
            </div>
          )}

          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Créé le {formatDate(company.createdAt)}
            </p>
            {company.updatedAt && company.updatedAt !== company.createdAt && (
              <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4" />
                Mis à jour le {formatDate(company.updatedAt)}
              </p>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCompanyDialog;
