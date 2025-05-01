
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, FileArchive, FileCog, FileCheck } from 'lucide-react';
import { toast } from 'sonner';
import FreightDocumentsList from './documents/FreightDocumentsList';

interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  reference?: string;
  createdAt: string;
}

const FreightDocuments = () => {
  const [activeTab, setActiveTab] = useState('all');

  // Fetch documents from Firestore
  const { data: documents = [], isLoading, refetch } = useQuery({
    queryKey: ['freight-documents'],
    queryFn: async () => {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.FREIGHT.DOCUMENTS));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Document[];
    }
  });

  // Delete a document
  const handleDeleteDocument = async (id: string) => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.FREIGHT.DOCUMENTS, id));
      toast.success('Document supprimé avec succès');
      refetch();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Erreur lors de la suppression du document');
    }
  };

  // Filter documents by type
  const getFilteredDocuments = () => {
    if (activeTab === 'all') return documents;
    return documents.filter(doc => doc.type === activeTab);
  };

  // Count documents by type
  const invoicesCount = documents.filter(doc => doc.type === 'invoice').length;
  const deliveryNotesCount = documents.filter(doc => doc.type === 'delivery_note').length;
  const customsCount = documents.filter(doc => doc.type === 'customs').length;
  const certificatesCount = documents.filter(doc => doc.type === 'certificate').length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Documents</h1>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Tous ({documents.length})</span>
          </TabsTrigger>
          <TabsTrigger value="invoice" className="flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            <span>Factures ({invoicesCount})</span>
          </TabsTrigger>
          <TabsTrigger value="delivery_note" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Bons de livraison ({deliveryNotesCount})</span>
          </TabsTrigger>
          <TabsTrigger value="customs" className="flex items-center gap-2">
            <FileCog className="h-4 w-4" />
            <span>Douanes ({customsCount})</span>
          </TabsTrigger>
          <TabsTrigger value="certificate" className="flex items-center gap-2">
            <FileArchive className="h-4 w-4" />
            <span>Certificats ({certificatesCount})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <FreightDocumentsList 
            documents={getFilteredDocuments()}
            isLoading={isLoading}
            onDelete={handleDeleteDocument}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FreightDocuments;
