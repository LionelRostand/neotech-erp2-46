
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Company } from '../types';
import { Building2, Mail, Phone, Globe, MapPin } from 'lucide-react';

interface ViewCompanyDialogProps {
  company: Company | null;
  open: boolean;
  onClose: () => void;
}

const ViewCompanyDialog: React.FC<ViewCompanyDialogProps> = ({ company, open, onClose }) => {
  if (!company) return null;

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
                    {company.address.city}, {company.address.postalCode}
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
            <p className="text-sm text-muted-foreground">
              Créé le {new Date(company.createdAt).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCompanyDialog;
