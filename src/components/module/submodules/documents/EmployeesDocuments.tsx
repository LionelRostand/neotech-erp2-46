
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
  Filter,
  FileUp,
  Calendar,
  ClipboardList
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useDocumentsData } from '@/hooks/useDocumentsData';
import UploadDocumentDialog from './components/UploadDocumentDialog';
import { exportToExcel } from '@/utils/exportUtils';
import { exportToPdf } from '@/utils/pdfUtils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const EmployeesDocuments: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tous');
  const { documents, stats, isLoading, error } = useDocumentsData();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadDocumentType, setUploadDocumentType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Define document types for upload and for tabs
  const documentTypes = [
    { id: 'contrat', label: 'Contrats', icon: <FileText className="h-4 w-4" /> },
    { id: 'attestation', label: 'Attestations', icon: <ClipboardList className="h-4 w-4" /> },
    { id: 'formulaire', label: 'Formulaires', icon: <ClipboardList className="h-4 w-4" /> },
    { id: 'identite', label: 'Pièces d\'identité', icon: <FileText className="h-4 w-4" /> },
    { id: 'cv', label: 'CVs', icon: <FileText className="h-4 w-4" /> },
    { id: 'diplome', label: 'Diplômes', icon: <FileText className="h-4 w-4" /> },
    { id: 'salaire', label: 'Bulletins de salaire', icon: <FileText className="h-4 w-4" /> },
    { id: 'autre', label: 'Autres', icon: <FileText className="h-4 w-4" /> }
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

  // Filter documents by search query and active tab
  const filteredDocuments = documents
    .filter(doc => 
      // Filter by search query
      (doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.employeeName && doc.employeeName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase())) &&
      // Filter by active tab
      (activeTab === 'tous' || doc.type.toLowerCase() === activeTab)
    );

  // Group documents by month
  const groupedDocuments = filteredDocuments.reduce((acc, document) => {
    const date = new Date(document.uploadDate);
    const month = format(date, 'MMMM yyyy', { locale: fr });
    
    if (!acc[month]) {
      acc[month] = [];
    }
    
    acc[month].push(document);
    return acc;
  }, {} as Record<string, typeof filteredDocuments>);
  
  // Sort months in descending order (newest first)
  const sortedMonths = Object.keys(groupedDocuments).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Documents RH</h2>
          <p className="text-gray-500">Gestion des documents du personnel</p>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher des documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
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
              <DropdownMenuSeparator />
              {documentTypes.map(type => (
                <DropdownMenuItem key={type.id} onClick={() => handleUploadByType(type.id)}>
                  {type.icon}
                  <span className="ml-2">{type.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Document types tabs with badges showing counts */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-9">
          <TabsTrigger value="tous" className="flex items-center">
            <FolderOpen className="h-4 w-4 mr-2" />
            Tous
            <Badge variant="secondary" className="ml-2 h-5 px-1.5">
              {documents.length}
            </Badge>
          </TabsTrigger>
          {documentTypes.map(type => {
            const count = documents.filter(doc => doc.type.toLowerCase() === type.id).length;
            return (
              <TabsTrigger key={type.id} value={type.id} className="flex items-center">
                {type.icon}
                <span className="mx-1">{type.label}</span>
                <Badge variant="secondary" className="h-5 px-1.5">
                  {count}
                </Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Filtres:</span>
                  <Badge variant="outline" className="font-normal">
                    {activeTab === 'tous' ? 'Tous les documents' : documentTypes.find(t => t.id === activeTab)?.label}
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
                    Uploader un {documentTypes.find(t => t.id === activeTab)?.label.slice(0, -1) || 'document'}
                  </Button>
                )}
              </div>
              
              {filteredDocuments.length === 0 ? (
                <div className="text-center p-12">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium mb-2">Aucun document trouvé</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {searchQuery 
                      ? "Aucun document ne correspond à votre recherche."
                      : "Commencez par ajouter des documents pour les voir apparaître ici."}
                  </p>
                  <Button onClick={() => handleUploadByType(activeTab !== 'tous' ? activeTab : '')}>
                    <Upload className="h-4 w-4 mr-2" />
                    Uploader un document
                  </Button>
                </div>
              ) : (
                <div className="space-y-8">
                  {sortedMonths.map(month => (
                    <div key={month} className="space-y-4">
                      <h3 className="font-medium text-lg flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        {month.charAt(0).toUpperCase() + month.slice(1)}
                      </h3>
                      <div className="overflow-x-auto rounded-md border">
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
                            {groupedDocuments[month].map((document) => (
                              <TableRow key={document.id} className="hover:bg-gray-50">
                                <TableCell className="font-medium">
                                  <div className="flex items-center">
                                    <div className="bg-primary-50 p-2 rounded mr-3">
                                      <FileText className="h-5 w-5 text-primary" />
                                    </div>
                                    <span>{document.title}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="bg-primary-50 text-primary border-primary-100">
                                    {document.type}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {document.employeeName ? (
                                    <div className="flex items-center space-x-2">
                                      <Avatar className="h-6 w-6 border">
                                        <AvatarImage src={document.employeePhoto} alt={document.employeeName} />
                                        <AvatarFallback className="bg-primary-100 text-primary">
                                          {document.employeeName.charAt(0)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span>{document.employeeName}</span>
                                    </div>
                                  ) : (
                                    <span className="text-gray-500">Non assigné</span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <Calendar className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
                                    {document.uploadDate}
                                  </div>
                                </TableCell>
                                <TableCell>{document.fileSize || '-'}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end space-x-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() => {
                                        if (document.url) {
                                          window.open(document.url, '_blank');
                                        } else {
                                          toast.error("URL du document non disponible");
                                        }
                                      }}
                                    >
                                      <FileText className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() => {
                                        toast.success("Téléchargement démarré");
                                      }}
                                    >
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
