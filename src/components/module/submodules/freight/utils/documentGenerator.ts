
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FreightInvoice } from '@/hooks/modules/useFreightInvoices';
import { saveDocumentToModule } from './documentUtils';
import 'jspdf-autotable';

export const generateDocuments = async (invoice: FreightInvoice, paymentData: any) => {
  // Générer la facture
  const generateInvoicePDF = async () => {
    const doc = new jsPDF();
    
    // En-tête
    doc.setFontSize(20);
    doc.text('FACTURE', 105, 20, { align: 'center' });
    
    // Informations de la facture
    doc.setFontSize(10);
    doc.text(`Facture N°: ${invoice.invoiceNumber || '-'}`, 20, 40);
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 45);
    doc.text(`Client: ${invoice.clientName}`, 20, 50);
    
    // Détails du paiement
    autoTable(doc, {
      startY: 70,
      head: [['Description', 'Montant']],
      body: [
        ['Prestation', `${invoice.amount.toLocaleString('fr-FR')} €`],
        ['Mode de paiement', paymentData.method],
        ['Référence', paymentData.reference || '-']
      ],
    });
    
    return doc;
  };

  // Générer le bon de livraison
  const generateDeliveryNotePDF = async () => {
    const doc = new jsPDF();
    
    // En-tête
    doc.setFontSize(20);
    doc.text('BON DE LIVRAISON', 105, 20, { align: 'center' });
    
    // Informations
    doc.setFontSize(10);
    doc.text(`Référence: ${invoice.shipmentReference || invoice.containerNumber || '-'}`, 20, 40);
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 45);
    doc.text(`Client: ${invoice.clientName}`, 20, 50);
    
    // Tableau des détails
    autoTable(doc, {
      startY: 70,
      head: [['Type', 'Référence']],
      body: [
        ['N° Facture', invoice.invoiceNumber || '-'],
        ['Réf. Expédition', invoice.shipmentReference || '-'],
        ['N° Conteneur', invoice.containerNumber || '-']
      ],
    });
    
    return doc;
  };

  try {
    // Générer les PDFs
    const invoiceDoc = await generateInvoicePDF();
    const deliveryDoc = await generateDeliveryNotePDF();
    
    // Sauvegarder les documents
    const invoiceDocId = await saveDocumentToModule({
      name: `Facture_${invoice.invoiceNumber || new Date().getTime()}.pdf`,
      type: 'invoice',
      url: invoiceDoc.output('datauristring'),
      reference: invoice.invoiceNumber,
      createdAt: new Date().toISOString()
    });

    const deliveryDocId = await saveDocumentToModule({
      name: `BonLivraison_${invoice.invoiceNumber || new Date().getTime()}.pdf`,
      type: 'delivery_note',
      url: deliveryDoc.output('datauristring'),
      reference: invoice.invoiceNumber,
      createdAt: new Date().toISOString()
    });

    return { invoiceDocId, deliveryDocId };
  } catch (error) {
    console.error('Error generating documents:', error);
    throw error;
  }
};
