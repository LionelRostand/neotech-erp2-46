
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';

/**
 * Generate a QR code as a data URL
 * @param value Text to encode in the QR code
 * @returns Promise with data URL
 */
export const generateQRCodeDataUrl = async (value: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(value, {
      margin: 1,
      width: 150,
      color: {
        dark: '#000',
        light: '#fff'
      }
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

/**
 * Export data to PDF file
 * @param data Array of objects to export
 * @param title Document title
 * @param fileName File name without extension
 */
export const exportToPdf = (
  data: any[],
  title: string = 'Export de données',
  fileName: string = 'export'
) => {
  try {
    // Create new PDF document
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text(title, 14, 22);
    doc.setFontSize(10);
    
    // Add date
    const today = new Date();
    const formattedDate = today.toLocaleDateString('fr-FR');
    doc.text(`Exporté le: ${formattedDate}`, 14, 30);
    
    // Extract column headers from first data object
    if (data.length === 0) {
      doc.text('Aucune donnée à exporter', 14, 40);
      doc.save(`${fileName}.pdf`);
      return true;
    }
    
    const firstItem = data[0];
    const columns = Object.keys(firstItem)
      .filter(key => typeof firstItem[key] !== 'object' || firstItem[key] === null)
      .map(key => ({
        header: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
        dataKey: key
      }));
    
    // Prepare rows
    const rows = data.map(item => {
      const row: any = {};
      columns.forEach(column => {
        let value = item[column.dataKey];
        if (typeof value === 'boolean') {
          value = value ? 'Oui' : 'Non';
        } else if (value === null || value === undefined) {
          value = '';
        }
        row[column.dataKey] = value;
      });
      return row;
    });
    
    // Create table
    autoTable(doc, {
      startY: 40,
      head: [columns.map(col => col.header)],
      body: rows.map(row => columns.map(col => row[col.dataKey])),
      theme: 'striped',
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      }
    });
    
    // Save PDF
    doc.save(`${fileName}.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    return false;
  }
};

/**
 * Generate a freight document (invoice or delivery note) with company info, client info, and items
 * @param documentType Type of document ('invoice' or 'delivery_note')
 * @param companyName Company name
 * @param clientName Client name
 * @param containerNumber Container number (optional)
 * @param referenceNumber Reference number
 * @param items Items/packages in the shipment
 * @param trackingCode Code to use for QR tracking
 * @returns Promise resolving to the generated PDF document as a data URL
 */
export const generateFreightDocument = async (
  documentType: 'invoice' | 'delivery_note',
  companyName: string,
  clientName: string,
  containerNumber: string | undefined,
  referenceNumber: string,
  items: Array<{name: string, quantity: number, description?: string}>,
  trackingCode: string
): Promise<string> => {
  try {
    const doc = new jsPDF();
    const title = documentType === 'invoice' ? 'FACTURE' : 'BON DE LIVRAISON';
    const filePrefix = documentType === 'invoice' ? 'Facture' : 'BonLivraison';
    
    // Generate QR code for tracking
    const qrCodeDataUrl = await generateQRCodeDataUrl(`https://track.domain.com/${trackingCode}`);
    
    // Add header with company info
    doc.setFontSize(20);
    doc.text(title, 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text(companyName, 105, 30, { align: 'center' });
    
    // Add reference information
    doc.setFontSize(10);
    doc.text(`Référence: ${referenceNumber}`, 20, 45);
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 50);
    
    // Add client information
    doc.text('Client:', 20, 60);
    doc.text(clientName, 40, 60);
    
    // Add container information if available
    let yPos = 65;
    if (containerNumber) {
      doc.text(`Conteneur: ${containerNumber}`, 20, yPos);
      yPos += 5;
    }
    
    // QR code for tracking (right side)
    doc.addImage(qrCodeDataUrl, 'PNG', 150, 40, 30, 30);
    doc.setFontSize(8);
    doc.text('Scanner pour suivre', 165, 75, { align: 'center' });
    
    // Add items/packages table
    autoTable(doc, {
      startY: yPos + 10,
      head: [['Description', 'Quantité', 'Détails']],
      body: items.map(item => [
        item.name,
        item.quantity.toString(),
        item.description || ''
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
        fontStyle: 'bold'
      }
    });
    
    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `${filePrefix}_${referenceNumber} - Page ${i} sur ${pageCount}`,
        105,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }
    
    // Return as data URL for preview and download
    return doc.output('datauristring');
  } catch (error) {
    console.error(`Error generating ${documentType}:`, error);
    throw error;
  }
};
