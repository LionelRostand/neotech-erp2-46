
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { FreightInvoice } from '@/hooks/modules/useFreightInvoices';
import QRCode from 'qrcode';

export const generateDocuments = async (invoice: FreightInvoice, paymentData: any) => {
  try {
    const trackingUrl = `${window.location.origin}/modules/freight/tracking/${paymentData.trackingCode}`;
    const qrCodeDataUrl = await QRCode.toDataURL(trackingUrl);

    // Generate invoice PDF
    const invoicePdf = new jsPDF();
    
    // Add header
    invoicePdf.setFontSize(18);
    invoicePdf.text("FACTURE", 105, 20, { align: "center" });
    
    // Add invoice details
    invoicePdf.setFontSize(12);
    invoicePdf.text(`N° Facture: ${invoice.invoiceNumber}`, 20, 40);
    invoicePdf.text(`Client: ${invoice.clientName}`, 20, 50);
    invoicePdf.text(`Montant: ${invoice.amount} ${invoice.currency || "EUR"}`, 20, 60);
    invoicePdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, 70);
    
    // Add QR code
    invoicePdf.addImage(qrCodeDataUrl, "PNG", 150, 30, 40, 40);
    invoicePdf.text("Scanner pour suivre", 150, 80, { align: "center" });
    
    // Generate PDF
    invoicePdf.save(`facture_${invoice.invoiceNumber}.pdf`);

    // Generate delivery note
    const deliveryPdf = new jsPDF();
    
    // Add header
    deliveryPdf.setFontSize(18);
    deliveryPdf.text("BON DE LIVRAISON", 105, 20, { align: "center" });
    
    // Add delivery details
    deliveryPdf.setFontSize(12);
    deliveryPdf.text(`Référence: ${invoice.shipmentReference || "N/A"}`, 20, 40);
    deliveryPdf.text(`Client: ${invoice.clientName}`, 20, 50);
    if (invoice.containerNumber) {
      deliveryPdf.text(`Conteneur: ${invoice.containerNumber}`, 20, 60);
    }
    
    // Add QR code
    deliveryPdf.addImage(qrCodeDataUrl, "PNG", 150, 30, 40, 40);
    deliveryPdf.text("Scanner pour suivre", 150, 80, { align: "center" });
    
    // Generate PDF
    deliveryPdf.save(`bon_livraison_${invoice.invoiceNumber}.pdf`);

    return true;
  } catch (error) {
    console.error("Error generating documents:", error);
    throw error;
  }
};
