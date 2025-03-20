
import React from 'react';
import { FileUploadState } from '../types/document-types';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface FileUploaderProps {
  file: FileUploadState;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ file }) => {
  // Format file size
  const formatFileSize = (size: number) => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
  };
  
  return (
    <div className="rounded-md border p-2">
      <div className="flex justify-between items-center mb-1">
        <div className="flex-1 truncate text-sm font-medium">
          {file.file.name}
        </div>
        <div className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
          {formatFileSize(file.file.size)}
        </div>
      </div>
      
      <div className="space-y-1">
        <Progress value={file.progress} className="h-2" />
        
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center">
            {file.status === 'success' && (
              <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
            )}
            {file.status === 'error' && (
              <AlertCircle className="h-3 w-3 text-red-500 mr-1" />
            )}
            <span className={
              file.status === 'success' ? 'text-green-500' : 
              file.status === 'error' ? 'text-red-500' : 
              'text-muted-foreground'
            }>
              {file.status === 'success' ? 'Complété' : 
               file.status === 'error' ? 'Erreur' : 
               file.status === 'uploading' ? 'Téléversement...' : 
               'En attente...'}
            </span>
          </div>
          <div className="text-muted-foreground">
            {file.progress}%
          </div>
        </div>
        
        {file.status === 'error' && file.errorMessage && (
          <div className="text-xs text-red-500 mt-1">
            {file.errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};
