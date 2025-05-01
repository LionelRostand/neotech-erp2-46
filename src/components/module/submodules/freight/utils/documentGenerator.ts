
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FreightInvoice } from '@/hooks/modules/useFreightInvoices';
import { saveDocumentToModule } from './documentUtils';
import { generateFreightDocument, generateQRCodeDataUrl } from '@/utils/pdfUtils';
import 'jspdf-autotable';

export const generateDocuments = async (invoice: FreightInvoice, paymentData: any) => {
  // Générer la facture
  const generateInvoicePDF = async () => {
    // Company info (in a real app this could come from app settings)
    const companyName = "LOGISTICS EXPRESS";
    
    // Items/packages (in a real app this would come from the database)
    const items = invoice.items || [
      { name: 'Transport international', quantity: 1, description: 'Service de transport' }
    ];
    
    // Generate tracking code - using invoice number or shipment reference
    const trackingCode = invoice.shipmentReference || invoice.invoiceNumber || invoice.containerNumber || '';
    
    // Generate the document using our utility
    const pdfDataUri = await generateFreightDocument(
      'invoice',
      companyName,
      invoice.clientName,
      invoice.containerNumber,
      invoice.invoiceNumber || '',
      items,
      trackingCode
    );
    
    return pdfDataUri;
  };

  // Générer le bon de livraison
  const generateDeliveryNotePDF = async () => {
    // Company info (in a real app this could come from app settings)
    const companyName = "LOGISTICS EXPRESS";
    
    // Items/packages (in a real app this would come from the database)
    const items = invoice.items || [
      { name: 'Colis #1', quantity: 1, description: 'Fragile' },
      { name: 'Colis #2', quantity: 2, description: 'Standard' }
    ];
    
    // Generate tracking code - using invoice number or shipment reference
    const trackingCode = invoice.shipmentReference || invoice.containerNumber || invoice.invoiceNumber || '';
    
    // Generate the document using our utility
    const pdfDataUri = await generateFreightDocument(
      'delivery_note',
      companyName,
      invoice.clientName,
      invoice.containerNumber,
      invoice.shipmentReference || invoice.invoiceNumber || '',
      items,
      trackingCode
    );
    
    return pdfDataUri;
  };

  try {
    // Générer les PDFs
    const invoicePdfDataUri = await generateInvoicePDF();
    const deliveryPdfDataUri = await generateDeliveryNotePDF();
    
    // Sauvegarder les documents
    const invoiceDocId = await saveDocumentToModule({
      name: `Facture_${invoice.invoiceNumber || new Date().getTime()}.pdf`,
      type: 'invoice',
      url: invoicePdfDataUri,
      reference: invoice.invoiceNumber,
      createdAt: new Date().toISOString()
    });

    const deliveryDocId = await saveDocumentToModule({
      name: `BonLivraison_${invoice.invoiceNumber || new Date().getTime()}.pdf`,
      type: 'delivery_note',
      url: deliveryPdfDataUri,
      reference: invoice.invoiceNumber,
      createdAt: new Date().toISOString()
    });

    return { invoiceDocId, deliveryDocId, invoicePdfDataUri, deliveryPdfDataUri };
  } catch (error) {
    console.error('Error generating documents:', error);
    throw error;
  }
};
