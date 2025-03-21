
import React from 'react';
import { FileText, Search, Plus, Filter, Download, Printer, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const FreightDocuments: React.FC = () => {
  // Sample data for documents
  const documents = [
    { id: 'DOC-1001', type: 'Connaissement', relatedTo: 'EXP-1030', date: '2023-10-15', status: 'Signé' },
    { id: 'DOC-1002', type: 'Facture', relatedTo: 'EXP-1029', date: '2023-10-14', status: 'En attente' },
    { id: 'DOC-1003', type: 'Déclaration douane', relatedTo: 'EXP-1028', date: '2023-10-14', status: 'Validé' },
    { id: 'DOC-1004', type: 'Lettre de transport', relatedTo: 'EXP-1027', date: '2023-10-13', status: 'Signé' },
    { id: 'DOC-1005', type: 'Certificat d\'origine', relatedTo: 'EXP-1026', date: '2023-10-12', status: 'Brouillon' },
  ];

  const templates = [
    { id: 'TPL-1', name: 'Connaissement standard', type: 'Connaissement', lastUsed: '2023-10-10' },
    { id: 'TPL-2', name: 'Facture commerciale', type: 'Facture', lastUsed: '2023-10-05' },
    { id: 'TPL-3', name: 'Déclaration UE', type: 'Déclaration douane', lastUsed: '2023-09-28' },
    { id: 'TPL-4', name: 'CMR International', type: 'Lettre de transport', lastUsed: '2023-10-08' },
    { id: 'TPL-5', name: 'Certificat EUR1', type: 'Certificat d\'origine', lastUsed: '2023-09-15' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Signé':
        return 'bg-green-100 text-green-800';
      case 'Validé':
        return 'bg-blue-100 text-blue-800';
      case 'En attente':
        return 'bg-amber-100 text-amber-800';
      case 'Brouillon':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="documents">
        <TabsList className="mb-4">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="templates">Modèles</TabsTrigger>
          <TabsTrigger value="archive">Archives</TabsTrigger>
        </TabsList>

        <TabsContent value="documents">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Documents d'expédition</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Exporter
                </Button>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau document
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtrer
                </Button>
                
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Rechercher un document..."
                    className="pl-8 w-[300px]"
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Référence</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Expédition</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.id}</TableCell>
                      <TableCell>{doc.type}</TableCell>
                      <TableCell>{doc.relatedTo}</TableCell>
                      <TableCell>{doc.date}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(doc.status)}>
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Printer className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Modèles de documents</CardTitle>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouveau modèle
              </Button>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Rechercher un modèle..."
                  className="pl-8"
                />
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Dernière utilisation</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.id}</TableCell>
                      <TableCell>{template.name}</TableCell>
                      <TableCell>{template.type}</TableCell>
                      <TableCell>{template.lastUsed}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Modifier</Button>
                        <Button variant="ghost" size="sm">Utiliser</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="archive">
          <Card>
            <CardHeader>
              <CardTitle>Archives de documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">Accéder aux archives de documents</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Les documents archivés sont conservés pendant 5 ans conformément à la réglementation.
                </p>
                <Button className="mt-4">
                  Consulter les archives
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FreightDocuments;
