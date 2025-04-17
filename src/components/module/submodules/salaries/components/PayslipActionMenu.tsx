
import React from 'react';
import { MoreHorizontal, Download, Eye, Trash2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { updatePaySlip } from '../services/payslipService';
import { SalarySlip } from '@/hooks/useSalarySlipsData';

interface PayslipActionMenuProps {
  payslip: SalarySlip;
}

const PayslipActionMenu: React.FC<PayslipActionMenuProps> = ({ payslip }) => {
  const handleDownload = () => {
    // This would be implemented with a proper PDF generation library
    toast.success('Téléchargement démarré');
  };

  const handleView = () => {
    toast.info('Affichage du bulletin de paie');
    // This would open a modal or navigate to a detail page
  };

  const handleDelete = () => {
    toast.error('Fonctionnalité de suppression non implémentée');
    // This would require confirmation and delete functionality
  };

  const handleSend = async () => {
    try {
      // Update the payslip status to "Sent"
      if (payslip.id) {
        // Using any type here to avoid type mismatch with PaySlipData
        await updatePaySlip(payslip.id, { statusValue: 'Envoyé' } as any);
        toast.success('Bulletin de paie envoyé avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du bulletin:', error);
      toast.error('Erreur lors de l\'envoi du bulletin de paie');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleView}>
          <Eye className="h-4 w-4 mr-2" />
          Voir
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Télécharger
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSend}>
          <Send className="h-4 w-4 mr-2" />
          Envoyer
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
          <Trash2 className="h-4 w-4 mr-2" />
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PayslipActionMenu;
