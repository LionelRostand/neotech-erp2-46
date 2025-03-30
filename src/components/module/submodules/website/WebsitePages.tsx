
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { 
  Search, 
  Plus, 
  FileText, 
  Copy, 
  Trash2, 
  ExternalLink, 
  Settings, 
  Eye,
  Globe,
  Home
} from 'lucide-react';

interface Page {
  id: string;
  title: string;
  slug: string;
  type: 'page' | 'blog' | 'product';
  status: 'published' | 'draft' | 'scheduled';
  lastUpdated: string;
  author: string;
}

const WebsitePages = () => {
  const { toast } = useToast();
  const [pages, setPages] = useState<Page[]>([
    { 
      id: '1', 
      title: 'Accueil', 
      slug: '/', 
      type: 'page', 
      status: 'published',
      lastUpdated: '2023-08-15 14:30',
      author: 'Admin'
    },
    { 
      id: '2', 
      title: 'À propos', 
      slug: '/a-propos', 
      type: 'page', 
      status: 'published',
      lastUpdated: '2023-07-25 09:45',
      author: 'Admin'
    },
    { 
      id: '3', 
      title: 'Services', 
      slug: '/services', 
      type: 'page', 
      status: 'published',
      lastUpdated: '2023-08-10 11:20',
      author: 'Admin'
    },
    { 
      id: '4', 
      title: 'Contact', 
      slug: '/contact', 
      type: 'page', 
      status: 'draft',
      lastUpdated: '2023-08-18 15:10',
      author: 'Admin'
    },
    { 
      id: '5', 
      title: 'Blog: Les dernières tendances', 
      slug: '/blog/dernieres-tendances', 
      type: 'blog', 
      status: 'published',
      lastUpdated: '2023-08-05 16:45',
      author: 'Rédacteur'
    },
    { 
      id: '6', 
      title: 'Blog: Nos conseils', 
      slug: '/blog/conseils', 
      type: 'blog', 
      status: 'scheduled',
      lastUpdated: '2023-08-20 08:30',
      author: 'Rédacteur'
    },
    { 
      id: '7', 
      title: 'Produit: Pack Premium', 
      slug: '/produits/pack-premium', 
      type: 'product', 
      status: 'published',
      lastUpdated: '2023-08-12 10:15',
      author: 'Marketing'
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [newPageType, setNewPageType] = useState<'page' | 'blog' | 'product'>('page');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  const handleCreatePage = () => {
    const newPage: Page = {
      id: Date.now().toString(),
      title: newPageTitle,
      slug: newPageSlug || `/${newPageTitle.toLowerCase().replace(/\s+/g, '-')}`,
      type: newPageType,
      status: 'draft',
      lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' '),
      author: 'Admin'
    };

    setPages([...pages, newPage]);
    setIsCreateDialogOpen(false);
    setNewPageTitle('');
    setNewPageSlug('');
    setNewPageType('page');

    toast({
      title: "Page créée",
      description: `La page "${newPage.title}" a été créée avec succès.`,
    });
  };

  const handleDuplicate = (page: Page) => {
    const duplicatedPage = {
      ...page,
      id: Date.now().toString(),
      title: `${page.title} (copie)`,
      slug: `${page.slug}-copie`,
      status: 'draft' as const,
      lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };

    setPages([...pages, duplicatedPage]);
    
    toast({
      title: "Page dupliquée",
      description: `La page "${page.title}" a été dupliquée avec succès.`,
    });
  };

  const handleDelete = (pageId: string, pageTitle: string) => {
    setPages(pages.filter(page => page.id !== pageId));
    
    toast({
      title: "Page supprimée",
      description: `La page "${pageTitle}" a été supprimée avec succès.`,
    });
  };

  const handleStatusChange = (pageId: string, newStatus: 'published' | 'draft' | 'scheduled') => {
    setPages(pages.map(page => 
      page.id === pageId ? { ...page, status: newStatus } : page
    ));
    
    const page = pages.find(p => p.id === pageId);
    
    toast({
      title: "Statut mis à jour",
      description: `La page "${page?.title}" est maintenant ${
        newStatus === 'published' ? 'publiée' : 
        newStatus === 'draft' ? 'en brouillon' : 'planifiée'
      }.`,
    });
  };

  const filterPages = (page: Page) => {
    // Filter by search query
    const matchesSearch = searchQuery.trim() === '' || 
                        page.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        page.slug.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by type
    const matchesFilter = filter === 'all' || page.type === filter;
    
    return matchesSearch && matchesFilter;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-500 hover:bg-green-600">Publié</Badge>;
      case 'draft':
        return <Badge variant="outline">Brouillon</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Planifié</Badge>;
      default:
        return null;
    }
  };

  const getPageIcon = (type: string) => {
    switch (type) {
      case 'page':
        return <FileText className="h-4 w-4 text-muted-foreground" />;
      case 'blog':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'product':
        return <FileText className="h-4 w-4 text-amber-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const typeOptions = [
    { value: 'page', label: 'Page standard' },
    { value: 'blog', label: 'Article de blog' },
    { value: 'product', label: 'Page produit' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Pages</h2>
          <p className="text-muted-foreground">Gérez les pages de votre site web</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle page
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une nouvelle page</DialogTitle>
              <DialogDescription>
                Définissez les propriétés de base pour votre nouvelle page.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="title">Titre de la page</Label>
                <Input 
                  id="title" 
                  placeholder="Ex: À propos de nous" 
                  value={newPageTitle}
                  onChange={(e) => setNewPageTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <div className="flex items-center">
                  <span className="bg-muted px-2 py-2 rounded-l-md border border-r-0">
                    yoursite.com/
                  </span>
                  <Input 
                    id="slug" 
                    className="rounded-l-none"
                    placeholder="a-propos-de-nous" 
                    value={newPageSlug}
                    onChange={(e) => setNewPageSlug(e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Laissez vide pour générer automatiquement depuis le titre
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type de page</Label>
                <div className="flex gap-4 pt-1">
                  {typeOptions.map(option => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        id={`type-${option.value}`} 
                        name="pageType"
                        value={option.value}
                        checked={newPageType === option.value}
                        onChange={() => setNewPageType(option.value as any)}
                        className="rounded-full h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor={`type-${option.value}`} className="text-sm cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleCreatePage} disabled={!newPageTitle}>Créer la page</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une page..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Tabs 
          defaultValue="all" 
          className="w-full sm:w-auto"
          value={filter}
          onValueChange={setFilter}
        >
          <TabsList>
            <TabsTrigger value="all">Tout</TabsTrigger>
            <TabsTrigger value="page">Pages</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="product">Produits</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card>
        <CardContent className="p-0 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Titre</TableHead>
                <TableHead className="hidden md:table-cell">URL</TableHead>
                <TableHead className="hidden lg:table-cell">Dernière modification</TableHead>
                <TableHead className="hidden sm:table-cell">Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.filter(filterPages).map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="w-12">
                    <div className="flex items-center justify-center">
                      {getPageIcon(page.type)}
                      {page.slug === '/' && <Home className="h-3 w-3 absolute text-primary" />}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{page.title}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {page.slug}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                    <div>{page.lastUpdated}</div>
                    <div className="text-xs">par {page.author}</div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {getStatusBadge(page.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDuplicate(page)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(page.id, page.title)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {pages.filter(filterPages).length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Aucune page ne correspond à votre recherche.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebsitePages;
