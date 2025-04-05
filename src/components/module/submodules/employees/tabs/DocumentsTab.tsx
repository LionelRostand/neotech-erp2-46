
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Employee } from '@/types/employee';
import { FileText, Download, Plus, Upload, Calendar, FilePen, FileArchive, FileImage, File } from 'lucide-react';
import UploadDocumentDialog from '../../documents/components/UploadDocumentDialog';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

interface Document {
  name: string;
  date: string;
  type: string;
  fileUrl?: string;
  id?: string;
  size?: number;
}

interface DocumentsTabProps {
  documents?: Document[] | string[];
  employee?: Employee;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ documents = [], employee }) => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadDocumentType, setUploadDocumentType] = useState('');

  const handleUpload = () => {
    setUploadDocumentType('');
    setUploadDialogOpen(true);
  };

  const handleUploadSuccess = () => {
    toast.success("Document ajouté avec succès");
    // In a real implementation, we would refresh the documents list here
  };

  const handleDownload = (document: Document | string) => {
    const processedDoc = processDocument(document);
    if (processedDoc.fileUrl) {
      window.open(processedDoc.fileUrl, '_blank');
    } else {
      toast.error("URL du document non disponible");
    }
  };

  // Function to convert a string to a Document object if needed
  const processDocument = (doc: Document | string): Document => {
    if (typeof doc === 'string') {
      return {
        name: doc,
        date: new Date().toISOString(),
        type: 'autre'
      };
    }
    return doc;
  };

  const processedDocuments = Array.isArray(documents) 
    ? documents.map(processDocument) 
    : [];

  // Group documents by month
  const groupedDocuments = processedDocuments.reduce((acc, doc) => {
    try {
      const date = new Date(doc.date);
      const month = format(date, 'MMMM yyyy', { locale: fr });
      
      if (!acc[month]) {
        acc[month] = [];
      }
      
      acc[month].push(doc);
    } catch (e) {
      // If date format is invalid, group under "Non daté"
      if (!acc["Non daté"]) {
        acc["Non daté"] = [];
      }
      acc["Non daté"].push(doc);
    }
    return acc;
  }, {} as Record<string, Document[]>);

  // Sort months in descending order (newest first)
  const sortedMonths = Object.keys(groupedDocuments).sort((a, b) => {
    if (a === "Non daté") return 1;
    if (b === "Non daté") return -1;
    
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateB.getTime() - dateA.getTime();
  });

  // Get appropriate icon for document type
  const getDocumentTypeIcon = (type: string) => {
    const documentTypes = {
      'contrat': <FilePen className="w-5 h-5 text-primary" />,
      'attestation': <FileText className="w-5 h-5 text-primary" />,
      'formulaire': <FileArchive className="w-5 h-5 text-primary" />,
      'identite': <FileImage className="w-5 h-5 text-primary" />,
      'diplome': <File className="w-5 h-5 text-primary" />,
      'cv': <File className="w-5 h-5 text-primary" />
    };
    
    return documentTypes[type.toLowerCase() as keyof typeof documentTypes] || <FileText className="w-5 h-5 text-primary" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Documents</h3>
        <Button size="sm" onClick={handleUpload}>
          <Upload className="w-4 h-4 mr-2" />
          Ajouter
        </Button>
      </div>

      {processedDocuments.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-md bg-gray-50">
          <FileText className="w-12 h-12 mx-auto text-gray-400" />
          <p className="mt-2 text-gray-500">Aucun document trouvé</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={handleUpload}>
            Importer un document
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedMonths.map(month => (
            <div key={month} className="space-y-2">
              <h4 className="text-sm font-medium text-gray-500 flex items-center border-b pb-1">
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                {month.charAt(0).toUpperCase() + month.slice(1)}
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {groupedDocuments[month].map((doc, index) => (
                  <div 
                    key={doc.id || index} 
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="bg-primary-50 p-2 rounded mr-3">
                        {getDocumentTypeIcon(doc.type)}
                      </div>
                      <div>
                        <p className="font-medium line-clamp-1" title={doc.name}>
                          {doc.name}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Badge variant="outline" className="mr-2 text-xs">
                            {doc.type}
                          </Badge>
                          {doc.date && (
                            <span>
                              {format(new Date(doc.date), 'P', { locale: fr })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleDownload(doc)}>
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Document Dialog */}
      <UploadDocumentDialog 
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onSuccess={handleUploadSuccess}
        defaultType={uploadDocumentType}
      />
    </div>
  );
};

export default DocumentsTab;
