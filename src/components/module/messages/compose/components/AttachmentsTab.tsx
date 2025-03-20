
import React from 'react';
import { Button } from '@/components/ui/button';
import { Paperclip, Trash2 } from 'lucide-react';

interface AttachmentsTabProps {
  attachments: File[];
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (fileName: string) => void;
}

const AttachmentsTab: React.FC<AttachmentsTabProps> = ({
  attachments,
  onFileChange,
  onRemoveFile
}) => {
  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed rounded-md p-6">
        <div className="flex flex-col items-center text-center">
          <Paperclip className="h-8 w-8 text-muted-foreground mb-2" />
          <h3 className="font-medium">Ajouter des pièces jointes</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Glissez-déposez vos fichiers ici ou cliquez pour parcourir
          </p>
          <input
            id="file-upload"
            type="file"
            multiple
            className="hidden"
            onChange={onFileChange}
          />
          <Button 
            variant="outline" 
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            Parcourir les fichiers
          </Button>
        </div>
      </div>

      {/* Liste des fichiers ajoutés */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">
            Fichiers ajoutés ({attachments.length})
          </h4>
          <div className="space-y-2">
            {attachments.map((file, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between bg-gray-50 p-2 rounded"
              >
                <div className="flex items-center">
                  <Paperclip className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onRemoveFile(file.name)}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentsTab;
