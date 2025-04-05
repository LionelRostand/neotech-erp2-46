
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatDate, formatPhoneNumber } from '@/lib/formatters';

interface Insurance {
  id: string;
  name: string;
  type: string;
  coverage: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  status: 'active' | 'inactive' | 'pending';
  address?: string;
  notes?: string;
  createdAt?: string;
}

interface ViewInsuranceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  insurance: Insurance;
}

const ViewInsuranceDialog: React.FC<ViewInsuranceDialogProps> = ({
  isOpen,
  onClose,
  insurance
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-red-500">Inactive</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">En attente</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'private':
        return 'Privée';
      case 'public':
        return 'Publique';
      case 'mutual':
        return 'Mutuelle';
      case 'complementary':
        return 'Complémentaire';
      default:
        return type;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {insurance.name}
            {getStatusBadge(insurance.status)}
          </DialogTitle>
          <DialogDescription>
            Détails de la compagnie d'assurance
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Type</h4>
                <p>{getTypeLabel(insurance.type)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Couverture</h4>
                <p>{insurance.coverage}</p>
              </div>
              <div className="col-span-2">
                <h4 className="text-sm font-medium text-muted-foreground">Adresse</h4>
                <p>{insurance.address || 'Non spécifiée'}</p>
              </div>
              {insurance.createdAt && (
                <div className="col-span-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Date de création</h4>
                  <p>{formatDate(insurance.createdAt)}</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="contact" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Contact</h4>
                <p>{insurance.contactName}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                <p>{insurance.contactEmail}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Téléphone</h4>
                <p>{formatPhoneNumber(insurance.contactPhone)}</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notes" className="mt-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Notes</h4>
              <div className="border p-4 rounded-md min-h-[120px]">
                {insurance.notes || 'Aucune note disponible.'}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewInsuranceDialog;
