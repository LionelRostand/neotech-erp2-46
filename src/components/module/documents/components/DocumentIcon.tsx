
import React from 'react';
import { 
  FileText, 
  File, 
  FileImage, 
  FileSpreadsheet, 
  FileCode, 
  FileArchive,
  FileX
} from 'lucide-react';

interface DocumentIconProps {
  fileType: string;
  size?: number;
  className?: string;
}

export const DocumentIcon: React.FC<DocumentIconProps> = ({ 
  fileType, 
  size = 24, 
  className = "" 
}) => {
  // Convert fileType to lowercase for case-insensitive comparison
  const type = (fileType || '').toLowerCase();
  
  // Determine the icon based on the file type
  if (type.includes('pdf')) {
    return <File size={size} className={`text-red-500 ${className}`} />;
  } else if (
    type.includes('image') || 
    type.includes('jpg') || 
    type.includes('jpeg') || 
    type.includes('png') || 
    type.includes('gif')
  ) {
    return <FileImage size={size} className={`text-purple-500 ${className}`} />;
  } else if (
    type.includes('excel') || 
    type.includes('spreadsheet') || 
    type.includes('xls') || 
    type.includes('csv')
  ) {
    return <FileSpreadsheet size={size} className={`text-green-500 ${className}`} />;
  } else if (
    type.includes('code') || 
    type.includes('html') || 
    type.includes('json') || 
    type.includes('xml')
  ) {
    return <FileCode size={size} className={`text-blue-500 ${className}`} />;
  } else if (
    type.includes('zip') || 
    type.includes('archive') || 
    type.includes('rar')
  ) {
    return <FileArchive size={size} className={`text-amber-500 ${className}`} />;
  } else if (type === 'unknown' || !type) {
    return <FileX size={size} className={`text-gray-400 ${className}`} />;
  } else {
    return <FileText size={size} className={`text-gray-500 ${className}`} />;
  }
};
