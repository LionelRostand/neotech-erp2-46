
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
  downloadLink.href = url;
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};

/**
 * Opens a document for viewing
 * @param fileData Base64 data or URL of the file
 * @param name Name of the document
 * @param isBase64 Whether the fileData is base64 encoded
 */
export const viewDocument = (fileData: string, name: string, isBase64 = true): void => {
  if (isBase64) {
    // If we have base64 data, open in a new tab
    const newTab = window.open();
    if (newTab) {
      newTab.document.write(`
        <html>
          <head>
            <title>${name || 'Document'}</title>
          </head>
          <body style="margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f0f0f0;">
            <img src="${fileData}" style="max-width: 100%; max-height: 90vh; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
          </body>
        </html>
      `);
      newTab.document.close();
    }
  } else {
    // If it's a URL, open in a new tab
    window.open(fileData, '_blank');
  }
};
