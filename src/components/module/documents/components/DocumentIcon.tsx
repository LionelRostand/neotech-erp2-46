
import React from 'react';
import { 
  FileText, 
  FileImage,
  FileCode,
  FileSpreadsheet,
  File
} from 'lucide-react';

interface DocumentIconProps {
  format: string;
  className?: string;
}

export const DocumentIcon: React.FC<DocumentIconProps> = ({ format, className = "h-8 w-8" }) => {
  const formatLower = format.toLowerCase();
  
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(formatLower)) {
    return <FileImage className={`${className} text-blue-500`} />;
  }
  
  if (['pdf'].includes(formatLower)) {
    return <FileText className={`${className} text-red-500`} />;
  }
  
  if (['doc', 'docx'].includes(formatLower)) {
    return <FileText className={`${className} text-blue-700`} />;
  }
  
  if (['xls', 'xlsx'].includes(formatLower)) {
    return <FileSpreadsheet className={`${className} text-green-600`} />;
  }
  
  if (['ppt', 'pptx'].includes(formatLower)) {
    return <File className={`${className} text-orange-500`} />;
  }
  
  if (['html', 'css', 'js', 'ts', 'json', 'xml'].includes(formatLower)) {
    return <FileCode className={`${className} text-green-500`} />;
  }
  
  return <FileText className={`${className} text-gray-500`} />;
};
