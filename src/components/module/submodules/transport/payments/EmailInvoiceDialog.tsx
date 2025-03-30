
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, Clipboard, Mail, Send, X } from "lucide-react";
import { toast } from "sonner";
import { ChevronsUpDown } from '@/components/icons/ChevronIcons';

interface EmailInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: any | null;
}

const EmailInvoiceDialog: React.FC<EmailInvoiceDialogProps> = ({
  open,
  onOpenChange,
  invoice
}) => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(invoice ? `Facture ${invoice.number} - Transport` : '');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  // Ensure ChevronsUpDown is available globally
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.ChevronsUpDown = ChevronsUpDown;
    }
  }, []);

  const handleSendEmail = () => {
    if (!email.trim()) {
      toast.error("L'adresse email est requise");
      return;
    }
    
    setIsSending(true);
    
    // Simulate email sending with timeout
    setTimeout(() => {
      toast.success("Facture envoyée par email avec succès");
      setIsSending(false);
      onOpenChange(false);
    }, 1500);
  };

  const handleCopyLink = () => {
    // In a real app, this would be a tracking link to download the invoice
    navigator.clipboard.writeText(`https://example.com/factures/${invoice?.id}`);
    toast.success("Lien copié dans le presse-papier");
  };

  if (!invoice) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Envoyer la facture par email</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center p-3 bg-muted rounded-md">
            <Mail className="h-5 w-5 mr-2 text-muted-foreground" />
            <span>Facture {invoice.number}</span>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={handleCopyLink}
              title="Copier le lien"
            >
              <Clipboard className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email destinataire</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Objet</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Veuillez trouver ci-joint votre facture..."
              rows={5}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="mr-2 h-4 w-4" />
            Annuler
          </Button>
          <Button onClick={handleSendEmail} disabled={isSending}>
            {isSending ? (
              <>Envoi en cours...</>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Envoyer
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailInvoiceDialog;
