
import React, { useState } from 'react';
import { Plus, File, FileText, FilePlus, Folder, Download, Archive, ArrowUpDown, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  DocumentDialog, 
  ActionButtons,
  viewDocument,
  downloadDocument,
  printDocument,
  exportDocuments,
  viewArchives
} from './helpers/FreightActionHelpers';

const FreightDocuments: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("documents");
  const [showNewDocument, setShowNewDocument] = useState(false);
  const [showArchives, setShowArchives] = useState(false);
  
  // Sample shipping documents
  const documents = [
    { 
      id: 1, 
      name: "Facture EXP-1030", 
      type: "invoice", 
      format: "pdf", 
      size: "245 KB", 
      date: "2023-10-15", 
      shipment: "EXP-1030",
      creator: "Jean Dupont" 
    },
    { 
      id: 2, 
      name: "Connaissement #BL-4582", 
      type: "bol", 
      format: "pdf", 
      size: "512 KB", 
      date: "2023-10-14", 
      shipment: "EXP-1029",
      creator: "Marie Martin" 
    },
    { 
      id: 3, 
      name: "Documents douaniers", 
      type: "customs", 
      format: "pdf", 
      size: "1.2 MB", 
      date: "2023-10-14", 
      shipment: "EXP-1028",
      creator: "Pierre Dubois" 
    },
    { 
      id: 4, 
      name: "Contrat de transport", 
      type: "contract", 
      format: "docx", 
      size: "350 KB", 
      date: "2023-10-13", 
      shipment: "EXP-1030",
      creator: "Sophie Legrand" 
    },
    { 
      id: 5, 
      name: "Certificat d'assurance", 
      type: "certificate", 
      format: "pdf", 
      size: "180 KB", 
      date: "2023-10-12", 
      shipment: "EXP-1029",
      creator: "Jean Dupont" 
    }
  ];
  
  // Sample document templates
  const templates = [
    { 
      id: 1, 
      name: "Facture standard", 
      type: "invoice", 
      format: "docx", 
      version: "2.1",
      lastUpdated: "2023-09-15",
      creator: "Jean Dupont" 
    },
    { 
      id: 2, 
      name: "Connaissement maritime", 
      type: "bol", 
      format: "docx", 
      version: "1.3",
      lastUpdated: "2023-08-22",
      creator: "Marie Martin" 
    },
    { 
      id: 3, 
      name: "Déclaration douanière", 
      type: "customs", 
      format: "docx", 
      version: "3.0",
      lastUpdated: "2023-10-01",
      creator: "Pierre Dubois" 
    },
    { 
      id: 4, 
      name: "Contrat de transport", 
      type: "contract", 
      format: "docx", 
      version: "2.0",
      lastUpdated: "2023-07-10",
      creator: "Sophie Legrand" 
    }
  ];
  
  const handleSaveDocument = (document: any) => {
    toast({
      title: "Document ajouté",
      description: "Le document a été créé avec succès.",
    });
    setShowNewDocument(false);
  };
  
  const handleEditTemplate = (template: any) => {
    toast({
      title: "Modification du modèle",
      description: `Le modèle "${template.name}" est en cours de modification.`,
    });
  };
  
  const handleUseTemplate = (template: any) => {
    toast({
      title: "Utilisation du modèle",
      description: `Le modèle "${template.name}" a été utilisé pour créer un nouveau document.`,
    });
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'invoice':
        return <File className="h-4 w-4 text-blue-500 mr-2" />;
      case 'bol':
        return <FileText className="h-4 w-4 text-amber-500 mr-2" />;
      case 'customs':
        return <FileText className="h-4 w-4 text-green-500 mr-2" />;
      case 'contract':
        return <FileText className="h-4 w-4 text-red-500 mr-2" />;
      case 'certificate':
        return <FileText className="h-4 w-4 text-purple-500 mr-2" />;
      default:
        return <File className="h-4 w-4 text-gray-500 mr-2" />;
    }
  };
  
  const getTypeName = (type: string) => {
    switch (type) {
      case 'invoice':
        return 'Facture';
      case 'bol':
        return 'Connaissement';
      case 'customs':
        return 'Document douanier';
      case 'contract':
        return 'Contrat';
      case 'certificate':
        return 'Certificat';
      default:
        return 'Document';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Documents</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Documents d'expédition</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FilePlus className="h-4 w-4" />
            <span>Modèles de documents</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Documents d'expédition */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <CardTitle>Documents d'expédition</CardTitle>
                  <CardDescription>
                    Gérez tous les documents liés à vos expéditions
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => viewArchives({ toast })}>
                    <Archive className="mr-2 h-4 w-4" />
                    Consulter les archives
                  </Button>
                  <Button variant="outline" onClick={() => exportDocuments({ toast })}>
                    <Download className="mr-2 h-4 w-4" />
                    Exporter
                  </Button>
                  <Button onClick={() => setShowNewDocument(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nouveau document
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Rechercher un document..."
                    className="pl-9"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" className="h-8 gap-1">
                    <ArrowUpDown className="h-4 w-4" />
                    <span>Trier</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 gap-1">
                    <Archive className="h-4 w-4" />
                    <span>Archiver</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Taille</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Expédition</TableHead>
                    <TableHead>Créateur</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          {getTypeIcon(doc.type)}
                          {doc.name}
                        </div>
                      </TableCell>
                      <TableCell>{getTypeName(doc.type)}</TableCell>
                      <TableCell className="uppercase">{doc.format}</TableCell>
                      <TableCell>{doc.size}</TableCell>
                      <TableCell>{doc.date}</TableCell>
                      <TableCell>{doc.shipment}</TableCell>
                      <TableCell>{doc.creator}</TableCell>
                      <TableCell className="text-right">
                        <ActionButtons 
                          type="document"
                          onView={() => viewDocument(doc, { toast })}
                          onDownload={() => downloadDocument(doc, { toast })}
                          onPrint={() => printDocument(doc, { toast })}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Modèles de documents */}
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Modèles de documents</CardTitle>
                  <CardDescription>
                    Gérez les modèles utilisés pour générer vos documents
                  </CardDescription>
                </div>
                <Button onClick={() => setShowNewDocument(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau modèle
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Dernière mise à jour</TableHead>
                    <TableHead>Créateur</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          {getTypeIcon(template.type)}
                          {template.name}
                        </div>
                      </TableCell>
                      <TableCell>{getTypeName(template.type)}</TableCell>
                      <TableCell className="uppercase">{template.format}</TableCell>
                      <TableCell>{template.version}</TableCell>
                      <TableCell>{template.lastUpdated}</TableCell>
                      <TableCell>{template.creator}</TableCell>
                      <TableCell className="text-right">
                        <ActionButtons 
                          type="template"
                          onEdit={() => handleEditTemplate(template)}
                          onUse={() => handleUseTemplate(template)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialog for adding a new document */}
      {showNewDocument && (
        <DocumentDialog 
          isOpen={showNewDocument}
          onClose={() => setShowNewDocument(false)}
          onSave={handleSaveDocument}
        />
      )}
    </div>
  );
};

export default FreightDocuments;
