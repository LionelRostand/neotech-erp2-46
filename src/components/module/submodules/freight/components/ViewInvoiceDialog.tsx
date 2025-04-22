
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FreightInvoice } from "@/hooks/modules/useFreightInvoices";
import { format } from "date-fns";
import fr from "date-fns/locale/fr";

interface ViewInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: FreightInvoice;
}

export const ViewInvoiceDialog = ({ open, onOpenChange, invoice }: ViewInvoiceDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Détails de la facture</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Client</p>
              <p>{invoice.clientName}</p>
            </div>
            <div>
              <p className="font-semibold">Montant</p>
              <p>{invoice.amount.toLocaleString('fr-FR')} €</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Référence</p>
              <p>{invoice.invoiceNumber || '-'}</p>
            </div>
            <div>
              <p className="font-semibold">Statut</p>
              <p className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Payée
              </p>
            </div>
          </div>
          {invoice.containerNumber && (
            <div>
              <p className="font-semibold">N° Conteneur</p>
              <p>{invoice.containerNumber}</p>
            </div>
          )}
          {invoice.shipmentReference && (
            <div>
              <p className="font-semibold">Réf. Expédition</p>
              <p>{invoice.shipmentReference}</p>
            </div>
          )}
          <div>
            <p className="font-semibold">Date de création</p>
            <p>{format(new Date(invoice.createdAt), 'dd/MM/yyyy', { locale: fr })}</p>
          </div>
          {invoice.paidAt && (
            <div>
              <p className="font-semibold">Date de paiement</p>
              <p>{format(new Date(invoice.paidAt), 'dd/MM/yyyy', { locale: fr })}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
