
import React, { useState } from 'react';
import {
  Eye,
  FileText,
  Download,
  Trash,
  FileArchive,
  FileCog,
  FileCheck,
  FileX
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import DocumentViewDialog from './DocumentViewDialog';

interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  reference?: string;
  createdAt: string;
}

interface FreightDocumentsListProps {
  documents: Document[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
}

const FreightDocumentsList: React.FC<FreightDocumentsListProps> = ({
  documents,
  isLoading = false,
  onDelete
}) => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setViewDialogOpen(true);
  };

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'invoice':
        return <FileCheck className="h-4 w-4 text-green-500" />;
      case 'delivery_note':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'customs':
        return <FileCog className="h-4 w-4 text-amber-500" />;
      case 'certificate':
        return <FileArchive className="h-4 w-4 text-purple-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'invoice':
        return 'Facture';
      case 'delivery_note':
        return 'Bon de livraison';
      case 'customs':
        return 'Douane';
      case 'certificate':
        return 'Certificat';
      default:
        return 'Document';
    }
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <FileX className="h-16 w-16 text-gray-400 mb-4" />
        <h3 className="font-medium text-lg">Aucun document</h3>
        <p className="text-muted-foreground">
          Les documents générés apparaîtront ici.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Type</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Référence</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((document) => (
              <TableRow key={document.id} className="hover:bg-muted/50 group">
                <TableCell className="font-medium flex items-center gap-2">
                  {getDocumentTypeIcon(document.type)}
                  {getDocumentTypeLabel(document.type)}
                </TableCell>
                <TableCell>{document.name}</TableCell>
                <TableCell>{document.reference || '-'}</TableCell>
                <TableCell>
                  {new Date(document.createdAt).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewDocument(document)}
                      title="Voir"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(document.id)}
                        className="text-red-500"
                        title="Supprimer"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DocumentViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        document={selectedDocument}
      />
    </>
  );
};

export default FreightDocumentsList;
