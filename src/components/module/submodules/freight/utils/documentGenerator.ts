
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { FreightInvoice } from '@/hooks/modules/useFreightInvoices';
import QRCode from 'qrcode';
import { saveDocumentToModule } from './documentUtils';

// Company information (In a real app, this would come from settings/config)
const COMPANY_INFO = {
  name: "Transport & Logistics SA",
  address: "123 Avenue du Commerce",
  city: "75001 Paris",
  phone: "+33 1 23 45 67 89",
  email: "contact@transport-logistics.fr",
  siret: "123 456 789 00012"
};

export const generateDocuments = async (invoice: FreightInvoice, paymentData: any) => {
  try {
    console.log('Starting document generation for invoice:', invoice.invoiceNumber);
    
    const timestamp = new Date().toISOString();
    const trackingUrl = `${window.location.origin}/modules/freight/tracking/${paymentData.trackingCode}`;
    const qrCodeDataUrl = await QRCode.toDataURL(trackingUrl);

    // Generate invoice PDF
    const invoicePdf = new jsPDF();
    
    // Add company header
    invoicePdf.setFontSize(18);
    invoicePdf.text(COMPANY_INFO.name, 105, 20, { align: "center" });
    
    invoicePdf.setFontSize(10);
    invoicePdf.text([
      COMPANY_INFO.address,
      COMPANY_INFO.city,
      `Tél: ${COMPANY_INFO.phone}`,
      `Email: ${COMPANY_INFO.email}`,
      `SIRET: ${COMPANY_INFO.siret}`
    ], 105, 30, { align: "center" });

    // Add FACTURE title
    invoicePdf.setFontSize(24);
    invoicePdf.text("FACTURE", 105, 60, { align: "center" });
    
    // Add invoice details
    invoicePdf.setFontSize(12);
    invoicePdf.text([
      `N° Facture: ${invoice.invoiceNumber}`,
      `Date: ${new Date().toLocaleDateString()}`,
      `Client: ${invoice.clientName}`,
      `Montant: ${invoice.amount} ${invoice.currency || "EUR"}`,
      `Référence: ${invoice.shipmentReference || invoice.containerNumber || "N/A"}`
    ], 20, 80);
    
    // Add items table if available
    if (invoice.items && invoice.items.length > 0) {
      invoicePdf.autoTable({
        startY: 120,
        head: [['Description', 'Quantité', 'Prix unitaire', 'Total']],
        body: invoice.items.map(item => [
          item.description,
          item.quantity,
          `${item.unitPrice} ${invoice.currency || "EUR"}`,
          `${item.quantity * item.unitPrice} ${invoice.currency || "EUR"}`
        ])
      });
    }
    
    // Add QR code
    invoicePdf.addImage(qrCodeDataUrl, "PNG", 150, 30, 40, 40);
    invoicePdf.setFontSize(10);
    invoicePdf.text("Scanner pour suivre", 170, 75, { align: "center" });
    
    // Save invoice PDF
    const invoicePdfBlob = new Blob([invoicePdf.output('blob')], { type: 'application/pdf' });
    const invoicePdfUrl = URL.createObjectURL(invoicePdfBlob);
    
    console.log('Invoice PDF generated, saving to Firestore...');
    
    const invoiceDocId = await saveDocumentToModule({
      name: `Facture ${invoice.invoiceNumber || 'Sans numéro'}`,
      type: 'invoice',
      url: invoicePdfUrl,
      reference: invoice.invoiceNumber,
      createdAt: timestamp
    });
    
    console.log('Invoice document saved with ID:', invoiceDocId);

    // Generate delivery note PDF
    const deliveryPdf = new jsPDF();
    
    // Add company header
    deliveryPdf.setFontSize(18);
    deliveryPdf.text(COMPANY_INFO.name, 105, 20, { align: "center" });
    
    deliveryPdf.setFontSize(10);
    deliveryPdf.text([
      COMPANY_INFO.address,
      COMPANY_INFO.city,
      `Tél: ${COMPANY_INFO.phone}`,
      `Email: ${COMPANY_INFO.email}`
    ], 105, 30, { align: "center" });

    // Add BON DE LIVRAISON title
    deliveryPdf.setFontSize(24);
    deliveryPdf.text("BON DE LIVRAISON", 105, 60, { align: "center" });
    
    // Add delivery details
    deliveryPdf.setFontSize(12);
    deliveryPdf.text([
      `Référence: ${invoice.shipmentReference || "N/A"}`,
      `Client: ${invoice.clientName}`,
      `Date: ${new Date().toLocaleDateString()}`
    ], 20, 80);

    if (invoice.containerNumber) {
      deliveryPdf.text(`Conteneur: ${invoice.containerNumber}`, 20, 100);
    }
    
    // Add items table if available
    if (invoice.items && invoice.items.length > 0) {
      deliveryPdf.autoTable({
        startY: 120,
        head: [['Description', 'Quantité', 'Poids', 'Remarques']],
        body: invoice.items.map(item => [
          item.description,
          item.quantity,
          item.weight ? `${item.weight} kg` : 'N/A',
          item.notes || ''
        ])
      });
    }
    
    // Add QR code
    deliveryPdf.addImage(qrCodeDataUrl, "PNG", 150, 30, 40, 40);
    deliveryPdf.setFontSize(10);
    deliveryPdf.text("Scanner pour suivre", 170, 75, { align: "center" });
    
    // Save delivery note PDF
    const deliveryPdfBlob = new Blob([deliveryPdf.output('blob')], { type: 'application/pdf' });
    const deliveryPdfUrl = URL.createObjectURL(deliveryPdfBlob);
    
    console.log('Delivery note PDF generated, saving to Firestore...');
    
    const deliveryDocId = await saveDocumentToModule({
      name: `Bon de livraison ${invoice.invoiceNumber || 'Sans numéro'}`,
      type: 'delivery_note',
      url: deliveryPdfUrl,
      reference: invoice.invoiceNumber,
      createdAt: timestamp
    });
    
    console.log('Delivery note document saved with ID:', deliveryDocId);

    return { invoiceDocId, deliveryDocId };
  } catch (error) {
    console.error("Error generating documents:", error);
    throw error;
  }
};
