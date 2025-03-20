
/**
 * Format file size to a human-readable string
 */
export const formatFileSize = (bytes: number) => {
  if (!bytes || bytes === 0) return '0 B';
  
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
};

/**
 * Get short format description
 */
export const getFormatDescription = (format: string) => {
  format = format.toLowerCase();
  
  const formatMap: Record<string, string> = {
    pdf: 'Document PDF',
    docx: 'Document Word',
    doc: 'Document Word',
    xlsx: 'Feuille Excel',
    xls: 'Feuille Excel',
    pptx: 'Présentation PowerPoint',
    ppt: 'Présentation PowerPoint',
    jpg: 'Image JPEG',
    jpeg: 'Image JPEG',
    png: 'Image PNG',
    gif: 'Image GIF',
    txt: 'Document texte',
    csv: 'Fichier CSV',
    zip: 'Archive ZIP',
    rar: 'Archive RAR'
  };
  
  return formatMap[format] || `Fichier ${format.toUpperCase()}`;
};
