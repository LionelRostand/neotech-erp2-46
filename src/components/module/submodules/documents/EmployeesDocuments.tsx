
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  FolderOpen,
  Upload,
  Download,
  Search
} from 'lucide-react';
import { useDocumentsData } from '@/hooks/useDocumentsData';
import { toast } from 'sonner';

const EmployeesDocuments: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tous');
  const { documents, isLoading, error } = useDocumentsData();

  const handleExportData = (format: 'excel' | 'pdf') => {
    toast.success(`Export ${format.toUpperCase()} téléchargé`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <p className="ml-2">Chargement des documents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        Une erreur est survenue lors du chargement des documents.
      </div>
    );
  }

  const filteredDocuments = activeTab === 'tous' 
    ? documents 
    : documents?.filter(doc => doc.type?.toLowerCase() === activeTab) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Documents RH</h2>
          <p className="text-gray-500">Gestion des documents du personnel</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Rechercher
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExportData('excel')}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Uploader
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-5">
          <TabsTrigger value="tous" className="flex items-center">
            <FolderOpen className="h-4 w-4 mr-2" />
            Tous
          </TabsTrigger>
          <TabsTrigger value="contrat" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Contrats
          </TabsTrigger>
          <TabsTrigger value="attestation" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Attestations
          </TabsTrigger>
          <TabsTrigger value="formulaire" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Formulaires
          </TabsTrigger>
          <TabsTrigger value="autre" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Autres
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <CardContent className="p-6">
              {filteredDocuments.length === 0 ? (
                <div className="text-center p-8 border border-dashed rounded-md">
                  <FileText className="w-12 h-12 mx-auto text-gray-400" />
                  <p className="mt-2 text-gray-500">Aucun document trouvé</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    Importer un document
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {filteredDocuments.map((doc, index) => (
                    <div key={index} className="border rounded-md p-4 hover:bg-gray-50">
                      <div className="flex items-center mb-2">
                        <FileText className="w-5 h-5 mr-2 text-blue-500" />
                        <span className="font-medium">{doc.title || doc.filename || doc.name}</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">
                        {doc.type} • {doc.uploadDate || doc.createdAt || doc.date}
                      </p>
                      <div className="flex justify-end">
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeesDocuments;
