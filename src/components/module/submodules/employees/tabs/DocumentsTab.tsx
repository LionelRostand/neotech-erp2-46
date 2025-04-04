
import React from 'react';
import { Button } from '@/components/ui/button';
import { Document } from '@/types/employee';
import { FileText, Download, Plus } from 'lucide-react';

interface DocumentsTabProps {
  documents: Document[] | string[] | undefined;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ documents = [] }) => {
  const handleUpload = () => {
    console.log('Upload document');
  };

  const handleDownload = (document: Document | string) => {
    console.log('Download document', document);
  };

  // Function to convert a string to a Document object if needed
  const processDocument = (doc: Document | string): Document => {
    if (typeof doc === 'string') {
      return {
        name: doc,
        date: new Date().toISOString(),
        type: 'pdf'
      };
    }
    return doc;
  };

  const processedDocuments = Array.isArray(documents) 
    ? documents.map(processDocument) 
    : [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Documents</h3>
        <Button size="sm" onClick={handleUpload}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter
        </Button>
      </div>

      {processedDocuments.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-md">
          <FileText className="w-12 h-12 mx-auto text-gray-400" />
          <p className="mt-2 text-gray-500">Aucun document trouvé</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={handleUpload}>
            Importer un document
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {processedDocuments.map((doc, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50"
            >
              <div className="flex items-center">
                <FileText className="w-5 h-5 mr-3 text-blue-500" />
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-sm text-gray-500">
                    {doc.type} • {new Date(doc.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleDownload(doc)}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentsTab;
