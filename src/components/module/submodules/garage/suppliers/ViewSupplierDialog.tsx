
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GarageSupplier } from '@/hooks/garage/useGarageSuppliers';
import { Badge } from '@/components/ui/badge';

interface ViewSupplierDialogProps {
  supplier: GarageSupplier | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewSupplierDialog = ({ supplier, open, onOpenChange }: ViewSupplierDialogProps) => {
  if (!supplier) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Détails du fournisseur</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Informations générales</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nom de l'entreprise</p>
                  <p className="font-medium">{supplier.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Statut</p>
                  <Badge variant={supplier.status === 'active' ? 'default' : 'secondary'}>
                    {supplier.status === 'active' ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Catégorie</p>
                  <p className="font-medium">{supplier.category || '-'}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Contact</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nom du contact</p>
                  <p className="font-medium">{supplier.contactName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{supplier.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="font-medium">{supplier.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Adresse</p>
                  <p className="font-medium">{supplier.address || '-'}</p>
                </div>
              </div>
            </div>

            {supplier.notes && (
              <div>
                <h3 className="font-medium mb-2">Notes</h3>
                <p className="text-sm">{supplier.notes}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewSupplierDialog;
