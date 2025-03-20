
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { FileUploader } from '../../documents/components/FileUploader';
import { FileUploadState } from '../../documents/types/document-types';

interface UploadingFilesListProps {
  uploadingFiles: FileUploadState[];
}

const UploadingFilesList: React.FC<UploadingFilesListProps> = ({ uploadingFiles }) => {
  if (uploadingFiles.length === 0) return null;
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          Téléversement en cours ({uploadingFiles.filter(f => f.status === 'success').length}/{uploadingFiles.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {uploadingFiles.map((file, index) => (
            <FileUploader key={index} file={file} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadingFilesList;
