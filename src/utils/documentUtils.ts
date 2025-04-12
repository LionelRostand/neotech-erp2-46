
/**
 * Utility functions for handling documents
 */

/**
 * Creates an HTML element to download a file
 * @param url URL or base64 data of the file
 * @param filename Name for the downloaded file
 */
export const downloadFile = (url: string, filename: string): void => {
  const downloadLink = document.createElement('a');
  
  // Si c'est une chaîne base64, on crée une URL data
  if (url.startsWith('data:') || url.match(/^[A-Za-z0-9+/=]+$/)) {
    // Vérifie si c'est déjà une URL data ou juste une chaîne base64
    const dataUrl = url.startsWith('data:') ? url : `data:application/octet-stream;base64,${url}`;
    downloadLink.href = dataUrl;
  } else {
    downloadLink.href = url;
  }
  
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};

/**
 * Converts a hexadecimal string to a data URL
 * @param hexString Hexadecimal string data
 * @param mimeType MIME type of the file (e.g., 'image/jpeg')
 * @returns A data URL that can be used in an <img> src or for download
 */
export const hexToDataUrl = (hexString: string, mimeType: string = 'application/octet-stream'): string => {
  try {
    // Convert hex string to byte array
    const byteArray = new Uint8Array(
      hexString.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
    );
    
    // Create a blob from the byte array
    const blob = new Blob([byteArray], { type: mimeType });
    
    // Create a data URL
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error converting hex to data URL:', error);
    return '';
  }
};

/**
 * Opens a document for viewing
 * @param fileData Base64 data, hex data, or URL of the file
 * @param name Name of the document
 * @param fileType MIME type of the document (for hex data)
 * @param format Format of the fileData ('base64', 'hex', or 'url')
 */
export const viewDocument = (
  fileData: string, 
  name: string, 
  fileType: string = 'application/octet-stream',
  format: 'base64' | 'hex' | 'url' = 'base64'
): void => {
  let dataToDisplay: string;
  
  // Determine how to process the file data based on format
  if (format === 'base64') {
    // Si nous avons des données base64, créer une URL data
    dataToDisplay = fileData.startsWith('data:') ? fileData : `data:${fileType};base64,${fileData}`;
  } else if (format === 'hex') {
    // Si nous avons des données hex, les convertir en URL data
    dataToDisplay = hexToDataUrl(fileData, fileType);
  } else {
    // Si c'est une URL, utiliser directement
    dataToDisplay = fileData;
  }
  
  // Create a new window to display the document
  const newTab = window.open('', '_blank');
  if (newTab) {
    newTab.document.write(`
      <html>
        <head>
          <title>${name || 'Document'}</title>
        </head>
        <body style="margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f0f0f0;">
    `);
    
    // Ajouter le contenu approprié en fonction du type de fichier
    if (fileType.startsWith('image/')) {
      newTab.document.write(`<img src="${dataToDisplay}" style="max-width: 100%; max-height: 90vh; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />`);
    } else if (fileType === 'application/pdf') {
      newTab.document.write(`<iframe src="${dataToDisplay}" style="width: 100%; height: 90vh; border: none;" />`);
    } else {
      newTab.document.write(`
        <div style="text-align: center; padding: 20px;">
          <h2>Visualisation non disponible pour ce type de fichier</h2>
          <p>Type: ${fileType}</p>
          <p>Nom: ${name}</p>
          <a href="${dataToDisplay}" download="${name}" style="display: inline-block; padding: 10px 20px; background: #0070f3; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px;">Télécharger le fichier</a>
        </div>
      `);
    }
    
    newTab.document.write(`
      </body>
      </html>
    `);
    newTab.document.close();
  }
};

/**
 * Gets the most reliable data source for a document
 * @param document The document object
 * @returns An object containing the data and its format
 */
export const getDocumentDataSource = (document: any): { data: string; format: 'base64' | 'hex' | 'url' } => {
  // Prioritize local data over URLs to avoid CORS issues
  if (document.fileData) {
    return { data: document.fileData, format: 'base64' };
  } else if (document.fileHex && document.fileType) {
    return { data: document.fileHex, format: 'hex' };
  } else if (document.fileUrl) {
    return { data: document.fileUrl, format: 'url' };
  } else if (document.documentId) {
    // Si nous avons l'ID du document dans hr_documents mais pas les données,
    // indiquons qu'il faut accéder à la collection hr_documents
    console.log(`Les données ne sont pas accessibles directement. Utilisez l'ID ${document.documentId} pour accéder au document dans hr_documents.`);
  }
  
  // Fallback if no data is available
  return { data: '', format: 'url' };
};
