
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const exportToPdf = (data: any[], title = 'Export Data', fileName = 'export') => {
  try {
    // Create PDF document
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text(title, 14, 15);
    
    // Prepare data for table
    const tableData = data.map(item => {
      const cleanItem = { ...item };
      
      // Remove id if present
      if ('id' in cleanItem) {
        delete cleanItem.id;
      }
      
      // Process values for PDF export
      Object.keys(cleanItem).forEach(key => {
        // Format dates
        if (cleanItem[key] instanceof Date) {
          cleanItem[key] = cleanItem[key].toLocaleDateString();
        }
        
        // Convert timestamps (firestore format)
        if (cleanItem[key] && 
            typeof cleanItem[key] === 'object' && 
            'seconds' in cleanItem[key]) {
          cleanItem[key] = new Date(cleanItem[key].seconds * 1000).toLocaleDateString();
        }
        
        // Convert objects to strings
        if (typeof cleanItem[key] === 'object' && cleanItem[key] !== null) {
          cleanItem[key] = JSON.stringify(cleanItem[key]);
        }
      });
      
      return Object.values(cleanItem);
    });
    
    // Get table headers (column names)
    const headers = data.length > 0 ? Object.keys(data[0]).filter(key => key !== 'id') : [];
    
    // Create table
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 25,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
    });
    
    // Save PDF
    doc.save(`${fileName}.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    return false;
  }
};
