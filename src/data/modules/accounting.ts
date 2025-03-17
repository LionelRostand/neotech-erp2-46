
import { Calculator, ReceiptText, CreditCard, Percent, FileText, Settings } from 'lucide-react';
import { AppModule, createIcon } from '../types/modules';

export const accountingModule: AppModule = {
  id: 9,
  name: "Comptabilité",
  description: "Gestion financière, facturation et suivi des taxes",
  href: "/modules/accounting",
  icon: createIcon(Calculator),
  submodules: [
    { id: "accounting-invoices", name: "Factures", href: "/modules/accounting/invoices", icon: createIcon(ReceiptText) },
    { id: "accounting-payments", name: "Paiements", href: "/modules/accounting/payments", icon: createIcon(CreditCard) },
    { id: "accounting-taxes", name: "Taxes & TVA", href: "/modules/accounting/taxes", icon: createIcon(Percent) },
    { id: "accounting-reports", name: "Rapports", href: "/modules/accounting/reports", icon: createIcon(FileText) },
    { id: "accounting-settings", name: "Paramètres", href: "/modules/accounting/settings", icon: createIcon(Settings) }
  ]
};
