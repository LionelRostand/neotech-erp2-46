
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  FilePlus, 
  Search, 
  Settings, 
  LayoutGrid, 
  Trash2, 
  Copy, 
  Eye, 
  LucideIcon
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';

interface Page {
  id: string;
  title: string;
  url: string;
  type: 'standard' | 'blog' | 'ecommerce' | 'landing';
  status: 'published' | 'draft' | 'scheduled';
  lastModified: string;
}

const WebsitePages: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  
  const mockPages: Page[] = [
    {
      id: '1',
      title: 'Accueil',
      url: '/',
      type: 'standard',
      status: 'published',
      lastModified: '2023-11-15'
    },
    {
      id: '2',
      title: 'À propos',
      url: '/a-propos',
      type: 'standard',
      status: 'published',
      lastModified: '2023-10-22'
    },
    {
      id: '3',
      title: 'Services',
      url: '/services',
      type: 'standard',
      status: 'published',
      lastModified: '2023-09-30'
    },
    {
      id: '4',
      title: 'Blog',
      url: '/blog',
      type: 'blog',
      status: 'published',
      lastModified: '2023-11-10'
    },
    {
      id: '5',
      title: 'Promotion d'été',
      url: '/promo-ete',
      type: 'landing',
      status: 'draft',
      lastModified: '2023-11-12'
    },
    {
      id: '6',
      title: 'Produits',
      url: '/produits',
      type: 'ecommerce',
      status: 'published',
      lastModified: '2023-11-08'
    },
    {
      id: '7',
      title: 'Contact',
      url: '/contact',
      type: 'standard',
      status: 'published',
      lastModified: '2023-10-05'
    },
    {
      id: '8',
      title: 'Lancement nouveau produit',
      url: '/nouveau-produit',
      type: 'landing',
      status: 'scheduled',
      lastModified: '2023-11-14'
    }
  ];

  // Filter pages based on search term and selected tab
  const filteredPages = mockPages
    .filter(page => 
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      page.url.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(page => {
      if (selectedTab === 'all') return true;
      if (selectedTab === 'published') return page.status === 'published';
      if (selectedTab === 'drafts') return page.status === 'draft';
      if (selectedTab === 'scheduled') return page.status === 'scheduled';
      return true;
    });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'published':
        return <Badge className="bg-green-500">Publié</Badge>;
      case 'draft':
        return <Badge variant="outline" className="text-gray-500 border-gray-300">Brouillon</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-500">Programmé</Badge>;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string): LucideIcon => {
    switch(type) {
      case 'blog':
        return FileText;
      case 'ecommerce':
        return LayoutGrid;
      case 'landing':
        return Eye;
      default:
        return FileText;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestion des pages</h1>
          <p className="text-sm text-muted-foreground">
            Créez, modifiez et organisez les pages de votre site web
          </p>
        </div>
        <Button>
          <FilePlus className="h-4 w-4 mr-2" />
          Nouvelle page
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pages du site</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="published">Publiées</TabsTrigger>
              <TabsTrigger value="drafts">Brouillons</TabsTrigger>
              <TabsTrigger value="scheduled">Programmées</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-0">
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <th className="h-12 px-4 text-left align-middle font-medium">Page</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">URL</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Statut</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Dernière modification</th>
                        <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPages.map((page) => {
                        const TypeIcon = getTypeIcon(page.type);
                        return (
                          <tr 
                            key={page.id}
                            className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
                          >
                            <td className="p-4 align-middle font-medium">
                              <div className="flex items-center space-x-2">
                                <TypeIcon className="h-4 w-4 text-muted-foreground" />
                                <span>{page.title}</span>
                              </div>
                            </td>
                            <td className="p-4 align-middle text-muted-foreground">{page.url}</td>
                            <td className="p-4 align-middle capitalize">{page.type}</td>
                            <td className="p-4 align-middle">{getStatusBadge(page.status)}</td>
                            <td className="p-4 align-middle text-muted-foreground">{page.lastModified}</td>
                            <td className="p-4 align-middle text-right">
                              <div className="flex justify-end space-x-1">
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {filteredPages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucune page trouvée</h3>
                  <p className="text-muted-foreground mb-4">
                    Aucune page ne correspond à votre recherche ou filtre actuel.
                  </p>
                  <Button onClick={() => {setSearchTerm(''); setSelectedTab('all');}}>
                    Réinitialiser les filtres
                  </Button>
                </div>
              )}

              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationLink>Précédent</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink isActive>1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink>2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink>3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink>Suivant</PaginationLink>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebsitePages;
