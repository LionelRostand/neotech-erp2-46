
import { useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useFreightData } from '@/hooks/modules/useFreightData';
import { toast } from 'sonner';
import QRCode from 'qrcode';

/**
 * Hook for generating freight-related documents with QR codes
 */
export const useFreightDocumentGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const invoicesCollection = useFirestore(COLLECTIONS.FREIGHT.BILLING);
  const { shipments, containers } = useFreightData();

  // Generate a tracking URL that will be encoded in the QR code
  const generateTrackingUrl = (type: string, reference: string) => {
    // In a real app, this would be your actual tracking URL
    const baseUrl = window.location.origin;
    return `${baseUrl}/modules/freight/tracking?type=${type}&reference=${reference}`;
  };

  // Generate QR code image as Data URL
  const generateQRCodeDataUrl = async (value: string): Promise<string> => {
    try {
      return await QRCode.toDataURL(value, {
        margin: 1,
        width: 100,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
      // Return empty placeholder in case of error
      return '';
    }
  };

  // Generate an invoice PDF
  const generateInvoicePdf = async (invoiceId: string, paymentData: any) => {
    try {
      setIsGenerating(true);

      // Retrieve invoice data
      const invoiceData = await invoicesCollection.getById(invoiceId);
      if (!invoiceData) {
        throw new Error('Invoice not found');
      }

      // Create new PDF document
      const doc = new jsPDF();
      const today = new Date().toLocaleDateString();

      // Add header
      doc.setFontSize(20);
      doc.text('FACTURE', 105, 20, { align: 'center' });

      // Add company info
      doc.setFontSize(10);
      doc.text('EXPORT TRANSIT SERVICES', 20, 40);
      doc.text('123 Rue du Commerce', 20, 45);
      doc.text('75001 Paris, France', 20, 50);
      doc.text('Tel: +33 1 23 45 67 89', 20, 55);
      doc.text('Email: contact@export-transit.com', 20, 60);

      // Add invoice details
      doc.setFontSize(12);
      doc.text(`Facture N°: ${invoiceData.invoiceNumber || `INV-${invoiceId.substring(0, 8)}`}`, 150, 40, { align: 'right' });
      doc.text(`Date: ${today}`, 150, 45, { align: 'right' });
      doc.text(`Échéance: ${today}`, 150, 50, { align: 'right' });

      // Add client info
      doc.setFontSize(11);
      doc.text('Facturé à:', 20, 80);
      doc.setFontSize(10);
      doc.text(`${invoiceData.clientName}`, 20, 85);

      // Add payment info
      doc.setFontSize(11);
      doc.text('Détails du paiement:', 20, 100);
      doc.setFontSize(10);
      doc.text(`Méthode: ${getPaymentMethodLabel(paymentData.method)}`, 20, 105);
      doc.text(`Date: ${new Date(paymentData.date).toLocaleDateString()}`, 20, 110);
      doc.text(`Référence: ${paymentData.reference || 'N/A'}`, 20, 115);

      // Generate table data
      const tableColumn = ["Description", "Montant"];
      let tableRows = [];

      // Add invoice items
      let description = "Services de transport et logistique";
      if (invoiceData.shipmentReference) {
        description += ` - Expédition ${invoiceData.shipmentReference}`;
      }
      if (invoiceData.containerNumber) {
        description += ` - Conteneur ${invoiceData.containerNumber}`;
      }

      tableRows.push([description, `${invoiceData.amount.toFixed(2)} €`]);

      // Add table
      (doc as any).autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 130,
        theme: 'grid',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [66, 100, 158] }
      });

      // Add totals
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.text(`Total: ${invoiceData.amount.toFixed(2)} €`, 150, finalY, { align: 'right' });

      // Generate and add QR code
      let qrValue = '';
      if (invoiceData.shipmentReference) {
        qrValue = generateTrackingUrl('shipment', invoiceData.shipmentReference);
      } else if (invoiceData.containerNumber) {
        qrValue = generateTrackingUrl('container', invoiceData.containerNumber);
      }

      if (qrValue) {
        const qrCodeDataUrl = await generateQRCodeDataUrl(qrValue);
        doc.addImage(qrCodeDataUrl, 'PNG', 20, finalY + 10, 30, 30);
        
        // Add QR code caption
        doc.setFontSize(8);
        doc.text('Scannez ce QR code pour suivre', 20, finalY + 45);
        doc.text('votre expédition en temps réel', 20, finalY + 50);
      }

      // Add notes
      if (paymentData.notes) {
        doc.setFontSize(10);
        doc.text('Notes:', 20, finalY + 60);
        doc.setFontSize(9);
        doc.text(paymentData.notes, 20, finalY + 65);
      }

      // Add footer
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(8);
      doc.text('Merci pour votre confiance. Pour toute question concernant cette facture, veuillez nous contacter.',
        105, pageHeight - 20, { align: 'center' });

      // Save the PDF
      doc.save(`facture_${invoiceData.invoiceNumber || invoiceId}.pdf`);

      // Update invoice status in database
      await invoicesCollection.update(invoiceId, {
        status: 'paid',
        paidAt: new Date().toISOString(),
        paymentMethod: paymentData.method,
        paymentReference: paymentData.reference
      });

      toast.success('Facture générée avec succès');
    } catch (error) {
      console.error('Error generating invoice PDF:', error);
      toast.error('Erreur lors de la génération de la facture');
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate a delivery note PDF
  const generateDeliveryNotePdf = async (invoiceId: string, paymentData: any) => {
    try {
      setIsGenerating(true);

      // Retrieve invoice data
      const invoiceData = await invoicesCollection.getById(invoiceId);
      if (!invoiceData) {
        throw new Error('Invoice not found');
      }

      // Create new PDF document
      const doc = new jsPDF();
      const today = new Date().toLocaleDateString();

      // Add header
      doc.setFontSize(20);
      doc.text('BON DE LIVRAISON', 105, 20, { align: 'center' });

      // Add company info
      doc.setFontSize(10);
      doc.text('EXPORT TRANSIT SERVICES', 20, 40);
      doc.text('123 Rue du Commerce', 20, 45);
      doc.text('75001 Paris, France', 20, 50);
      doc.text('Tel: +33 1 23 45 67 89', 20, 55);
      doc.text('Email: contact@export-transit.com', 20, 60);

      // Add delivery note details
      doc.setFontSize(12);
      doc.text(`Bon de Livraison N°: BL-${invoiceId.substring(0, 8)}`, 150, 40, { align: 'right' });
      doc.text(`Date: ${today}`, 150, 45, { align: 'right' });

      // Add client info
      doc.setFontSize(11);
      doc.text('Client:', 20, 80);
      doc.setFontSize(10);
      doc.text(`${invoiceData.clientName}`, 20, 85);

      // Add shipment/container info
      doc.setFontSize(11);
      doc.text('Détails de l\'expédition:', 20, 100);
      doc.setFontSize(10);

      // Gather details about the shipment or container
      let details = [];
      if (invoiceData.shipmentReference) {
        const shipment = shipments.find(s => s.reference === invoiceData.shipmentReference);
        if (shipment) {
          details.push(['Référence Expédition', shipment.reference]);
          details.push(['Origine', shipment.origin]);
          details.push(['Destination', shipment.destination]);
          details.push(['Transporteur', shipment.carrierName]);
          details.push(['Date d\'expédition', new Date(shipment.scheduledDate).toLocaleDateString()]);
          details.push(['Livraison estimée', new Date(shipment.estimatedDeliveryDate).toLocaleDateString()]);
        } else {
          details.push(['Référence Expédition', invoiceData.shipmentReference]);
        }
      }

      if (invoiceData.containerNumber) {
        const container = containers.find(c => c.number === invoiceData.containerNumber);
        if (container) {
          details.push(['Numéro de Conteneur', container.number]);
          details.push(['Type', container.type]);
          details.push(['Taille', container.size]);
          details.push(['Départ', new Date(container.departureDate).toLocaleDateString()]);
          details.push(['Arrivée estimée', new Date(container.arrivalDate).toLocaleDateString()]);
        } else {
          details.push(['Numéro de Conteneur', invoiceData.containerNumber]);
        }
      }

      // Add details to document
      let y = 105;
      details.forEach(([label, value]) => {
        doc.text(`${label}: ${value}`, 20, y);
        y += 5;
      });

      // Generate and add QR code
      let qrValue = '';
      if (invoiceData.shipmentReference) {
        qrValue = generateTrackingUrl('shipment', invoiceData.shipmentReference);
      } else if (invoiceData.containerNumber) {
        qrValue = generateTrackingUrl('container', invoiceData.containerNumber);
      }

      if (qrValue) {
        const qrCodeDataUrl = await generateQRCodeDataUrl(qrValue);
        doc.addImage(qrCodeDataUrl, 'PNG', 140, 100, 40, 40);
        
        // Add QR code caption
        doc.setFontSize(8);
        doc.text('Scannez ce QR code pour suivre', 140, 145);
        doc.text('votre expédition en temps réel', 140, 150);
      }

      // Add additional notes
      doc.setFontSize(10);
      doc.text('Notes:', 20, 170);
      doc.setFontSize(9);
      doc.text('Ce bon de livraison confirme l\'expédition de vos marchandises.', 20, 175);

      // Add footer
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(8);
      doc.text('Pour toute question concernant cette livraison, veuillez nous contacter.',
        105, pageHeight - 20, { align: 'center' });

      // Save the PDF
      doc.save(`bon_livraison_${invoiceData.invoiceNumber || invoiceId}.pdf`);

      toast.success('Bon de livraison généré avec succès');
    } catch (error) {
      console.error('Error generating delivery note PDF:', error);
      toast.error('Erreur lors de la génération du bon de livraison');
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper function to get payment method label
  const getPaymentMethodLabel = (method: string): string => {
    const methods: Record<string, string> = {
      'card': 'Carte bancaire',
      'paypal': 'PayPal',
      'transfer': 'Virement bancaire',
      'cash': 'Espèces'
    };
    return methods[method] || method;
  };

  return {
    generateInvoicePdf,
    generateDeliveryNotePdf,
    isGenerating
  };
};

export default useFreightDocumentGenerator;
