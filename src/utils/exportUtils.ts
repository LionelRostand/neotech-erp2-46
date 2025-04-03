
import * as XLSX from 'xlsx';

export const exportToExcel = (data: any[], sheetName = 'Sheet1', fileName = 'export') => {
  try {
    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(
      data.map(item => {
        // Process data - convert dates and clean up object properties
        const cleanItem = { ...item };
        
        // Remove id if present (usually don't want to export this)
        if ('id' in cleanItem) {
          delete cleanItem.id;
        }
        
        // Process and format dates
        Object.keys(cleanItem).forEach(key => {
          // Convert Date objects to strings
          if (cleanItem[key] instanceof Date) {
            cleanItem[key] = cleanItem[key].toLocaleDateString();
          }
          
          // Convert timestamps (firestore format)
          if (cleanItem[key] && 
              typeof cleanItem[key] === 'object' && 
              'seconds' in cleanItem[key]) {
            cleanItem[key] = new Date(cleanItem[key].seconds * 1000).toLocaleDateString();
          }
          
          // Remove functions, complex objects, etc.
          if (typeof cleanItem[key] === 'function' || 
              (typeof cleanItem[key] === 'object' && cleanItem[key] !== null && !(cleanItem[key] instanceof Date))) {
            cleanItem[key] = JSON.stringify(cleanItem[key]);
          }
        });
        
        return cleanItem;
      })
    );
    
    // Create workbook and add worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
    
    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return false;
  }
};
