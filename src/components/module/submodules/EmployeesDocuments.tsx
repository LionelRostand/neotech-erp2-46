
import React, { useState, useEffect } from 'react';
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
  Calendar,
  FilePen,
  FileArchive,
  FilePlus,
  FileImage,
  File
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
    { id: 'contrat', label: 'Contrats', icon: <FilePen className="h-4 w-4 mr-2" /> },
    { id: 'attestation', label: 'Attestations', icon: <FileText className="h-4 w-4 mr-2" /> },
    { id: 'formulaire', label: 'Formulaires', icon: <FileArchive className="h-4 w-4 mr-2" /> },
    { id: 'identite', label: 'Pièces d\'identité', icon: <FileImage className="h-4 w-4 mr-2" /> },
    { id: 'diplome', label: 'Diplômes', icon: <File className="h-4 w-4 mr-2" /> },
    { id: 'autre', label: 'Autres', icon: <FilePlus className="h-4 w-4 mr-2" /> }
  ];

  // Filtered documents based on search and active tab
  const getFilteredDocuments = () => {
    let filtered = documents;
    
    // Filter by tab
    if (activeTab !== 'tous') {
      filtered = filtered.filter(doc => doc.type.toLowerCase() === activeTab);
    }
    
    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(query) || 
        (doc.employeeName && doc.employeeName.toLowerCase().includes(query)) ||
        (doc.type && doc.type.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  };

  // Group documents by month
  const getGroupedDocuments = () => {
    const filteredDocs = getFilteredDocuments();
    
    return filteredDocs.reduce((acc, doc) => {
      try {
        const date = new Date(doc.uploadDate || doc.createdAt || doc.date);
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
    }, {} as Record<string, any[]>);
  };
  
  // Sort months in descending order (newest first)
  const getSortedMonths = () => {
    const groupedDocs = getGroupedDocuments();
    return Object.keys(groupedDocs).sort((a, b) => {
      if (a === "Non daté") return 1;
      if (b === "Non daté") return -1;
      
      try {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateB.getTime() - dateA.getTime();
      } catch (e) {
        return 0;
      }
    });
  };

  const handleExportData = (format: 'excel' | 'pdf') => {
    const filteredDocuments = getFilteredDocuments();
      
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

  // Get appropriate icon for document type
  const getDocumentTypeIcon = (type: string) => {
    const docType = documentTypes.find(dt => dt.id === type.toLowerCase());
    return docType?.icon || <FileText className="h-4 w-4" />;
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

  const groupedDocuments = getGroupedDocuments();
  const sortedMonths = getSortedMonths();

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Documents RH</h2>
          <p className="text-gray-500">Gestion des documents du personnel</p>
        </div>
        <div className="flex gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Rechercher un document..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
              {documentTypes.map(type => (
                <DropdownMenuItem key={type.id} onClick={() => handleUploadByType(type.id)}>
                  {type.icon}
                  {type.label.replace(/s$/, '')}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Document types tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7">
          <TabsTrigger value="tous" className="flex items-center">
            <FolderOpen className="h-4 w-4 mr-2" />
            Tous
          </TabsTrigger>
          {documentTypes.map(type => (
            <TabsTrigger key={type.id} value={type.id} className="flex items-center">
              {type.icon}
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
                  <span className="text-sm text-gray-500">
                    {getFilteredDocuments().length} document{getFilteredDocuments().length > 1 ? 's' : ''} trouvé{getFilteredDocuments().length > 1 ? 's' : ''}
                  </span>
                </div>
                
                {/* Upload button specific to the current tab */}
                {activeTab !== 'tous' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleUploadByType(activeTab)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Uploader un {documentTypes.find(dt => dt.id === activeTab)?.label.replace(/s$/, '') || activeTab}
                  </Button>
                )}
              </div>
              
              {getFilteredDocuments().length === 0 ? (
                <div className="text-center p-12 border border-dashed rounded-lg">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium mb-1">Aucun document trouvé</h3>
                  <p className="text-gray-500 mb-4">Importez des documents pour les voir ici</p>
                  <Button variant="outline" onClick={() => handleUploadByType(activeTab !== 'tous' ? activeTab : '')}>
                    <Upload className="h-4 w-4 mr-2" />
                    Importer un document
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {sortedMonths.map(month => (
                    <div key={month} className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-500 flex items-center border-b pb-2">
                        <Calendar className="h-3.5 w-3.5 mr-1.5" />
                        {month.charAt(0).toUpperCase() + month.slice(1)}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                                <p className="font-medium line-clamp-1" title={doc.title}>
                                  {doc.title}
                                </p>
                                <div className="flex items-center text-xs text-gray-500">
                                  <Badge variant="outline" className="mr-2 text-xs">
                                    {doc.type}
                                  </Badge>
                                  {doc.employeeName && (
                                    <div className="flex items-center">
                                      <span className="mr-1">•</span>
                                      <Avatar className="h-4 w-4 mr-1">
                                        <AvatarImage src={doc.employeePhoto} alt={doc.employeeName} />
                                        <AvatarFallback className="text-[8px]">{doc.employeeName.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <span className="line-clamp-1">{doc.employeeName}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span className="text-xs text-gray-500 mr-3 hidden md:block">
                                {doc.fileSize || (doc.size ? `${Math.round(doc.size / 1024)} KB` : '-')}
                              </span>
                              <Button variant="ghost" size="sm" onClick={() => {
                                if (doc.url) {
                                  window.open(doc.url, '_blank');
                                } else {
                                  toast.error("URL du document non disponible");
                                }
                              }}>
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
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
