
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

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
