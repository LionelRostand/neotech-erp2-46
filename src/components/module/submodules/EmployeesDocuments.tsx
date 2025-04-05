
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  ListFilter, 
  Plus,
  Download,
  Upload,
  Search,
  FolderOpen,
  Filter
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useDocumentsData } from '@/hooks/useDocumentsData';
import UploadDocumentDialog from './documents/components/UploadDocumentDialog';
import { exportToExcel } from '@/utils/exportUtils';
import { exportToPdf } from '@/utils/pdfUtils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const EmployeesDocuments: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tous');
  const { documents, stats, isLoading, error } = useDocumentsData();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadDocumentType, setUploadDocumentType] = useState('');

  // Define document types for upload and for tabs
  const documentTypes = [
    { id: 'contrat', label: 'Contrats' },
    { id: 'attestation', label: 'Attestations' },
    { id: 'formulaire', label: 'Formulaires' },
    { id: 'autre', label: 'Autres' }
  ];

  const handleExportData = (format: 'excel' | 'pdf') => {
    const filteredDocuments = activeTab === 'tous' 
      ? documents 
      : documents.filter(doc => doc.type.toLowerCase() === activeTab);
      
    if (filteredDocuments.length === 0) {
      toast.error("Aucune donnée à exporter");
      return;
    }
    
    if (format === 'excel') {
      exportToExcel(filteredDocuments, 'Documents_RH', `Documents_RH_${new Date().toISOString().slice(0,10)}`);
      toast.success("Export Excel téléchargé");
    } else {
      exportToPdf(filteredDocuments, 'Documents RH', `Documents_RH_${new Date().toISOString().slice(0,10)}`);
      toast.success("Export PDF téléchargé");
    }
  };
  
  const handleUploadSuccess = () => {
    toast.success("Document ajouté avec succès");
    // In a real implementation, we would refresh the documents list here
  };

  // Handler for uploading a specific document type
  const handleUploadByType = (type: string) => {
    setUploadDocumentType(type);
    setUploadDialogOpen(true);
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
    : documents.filter(doc => doc.type.toLowerCase() === activeTab);

  return (
    <div className="space-y-6">
      {/* Header with actions */}
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExportData('excel')}>
                Exporter en Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportData('pdf')}>
                Exporter en PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Upload dropdown with document type options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Uploader
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleUploadByType('')}>
                Tout type de document
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUploadByType('contrat')}>
                Contrat
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUploadByType('attestation')}>
                Attestation
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUploadByType('formulaire')}>
                Formulaire
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUploadByType('identite')}>
                Pièce d'identité
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUploadByType('cv')}>
                CV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUploadByType('diplome')}>
                Diplôme
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUploadByType('salaire')}>
                Bulletin de salaire
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUploadByType('autre')}>
                Autre
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Document types tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-5">
          <TabsTrigger value="tous" className="flex items-center">
            <FolderOpen className="h-4 w-4 mr-2" />
            Tous
          </TabsTrigger>
          {documentTypes.map(type => (
            <TabsTrigger key={type.id} value={type.id} className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Filtres:</span>
                  <Badge variant="outline" className="font-normal">
                    Tous
                  </Badge>
                </div>
                
                {/* Upload button specific to the current tab */}
                {activeTab !== 'tous' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleUploadByType(activeTab)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Uploader un {activeTab}
                  </Button>
                )}
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Employé</TableHead>
                      <TableHead>Date d'upload</TableHead>
                      <TableHead>Taille</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.length > 0 ? (
                      filteredDocuments.map((document) => (
                        <TableRow key={document.id}>
                          <TableCell className="font-medium">
                            {document.title}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{document.type}</Badge>
                          </TableCell>
                          <TableCell>
                            {document.employeeName ? (
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={document.employeePhoto} alt={document.employeeName} />
                                  <AvatarFallback>{document.employeeName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>{document.employeeName}</span>
                              </div>
                            ) : (
                              'Non assigné'
                            )}
                          </TableCell>
                          <TableCell>{document.uploadDate}</TableCell>
                          <TableCell>{document.fileSize || '-'}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (document.url) {
                                  window.open(document.url, '_blank');
                                } else {
                                  toast.error("URL du document non disponible");
                                }
                              }}
                            >
                              Ouvrir
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          Aucun document trouvé
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Upload Document Dialog with type preset */}
      <UploadDocumentDialog 
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onSuccess={handleUploadSuccess}
        defaultType={uploadDocumentType}
      />
    </div>
  );
};

export default EmployeesDocuments;
