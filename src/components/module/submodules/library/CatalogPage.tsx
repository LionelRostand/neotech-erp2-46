
import React, { useEffect, useState } from 'react';
import { Search, Filter, Book, Download, BookOpen, Clock, FileText, Tag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { getAllDocuments } from '@/hooks/firestore/firestore-utils';
import { Book as BookType } from './BooksPage';
import { toast } from 'sonner';

// Extended book type to include loan history
interface CatalogBook extends BookType {
  popularity?: number; // Number of times the book was borrowed
  lastBorrowed?: Date;
  qrCode?: string;
  barcodeId?: string;
}

// Filter options
interface FilterOptions {
  genres: string[];
  years: number[];
  availability: 'all' | 'available' | 'ebook';
  popularity: [number, number]; // Min and max popularity
}

const CatalogPage: React.FC = () => {
  const [books, setBooks] = useState<CatalogBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<CatalogBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBook, setSelectedBook] = useState<CatalogBook | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    genres: [],
    years: [],
    availability: 'all',
    popularity: [0, 100],
  });
  const [selectedEbook, setSelectedEbook] = useState<CatalogBook | null>(null);
  const [recommendations, setRecommendations] = useState<CatalogBook[]>([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, activeFilters, books, filterOptions]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      // In a real app, fetch from Firestore
      // For now, use mock data with extended properties
      const mockBooks: CatalogBook[] = [
        {
          id: '1',
          title: "L'étranger",
          author: "Albert Camus",
          isbn: "9782070360024",
          publishYear: 1942,
          publisher: "Gallimard",
          genre: "Roman",
          summary: "L'histoire d'un homme qui commet un meurtre et fait face à l'absurdité de la vie et de la mort.",
          coverImage: "https://example.com/covers/etranger.jpg",
          tags: ["Philosophie", "Absurde", "Existentialisme"],
          availableCopies: 3,
          totalCopies: 5,
          isEbook: true,
          fileFormats: ["PDF", "EPUB"],
          popularity: 85,
          qrCode: "QR12345",
          barcodeId: "BAR12345"
        },
        {
          id: '2',
          title: "Le Petit Prince",
          author: "Antoine de Saint-Exupéry",
          isbn: "9782070612758",
          publishYear: 1943,
          publisher: "Gallimard",
          genre: "Conte",
          summary: "Un pilote échoué dans le désert rencontre un jeune prince venu d'une autre planète.",
          coverImage: "https://example.com/covers/petit-prince.jpg",
          tags: ["Jeunesse", "Philosophie", "Poésie"],
          availableCopies: 2,
          totalCopies: 4,
          isEbook: true,
          fileFormats: ["PDF", "EPUB", "MOBI"],
          popularity: 92,
          qrCode: "QR67890",
          barcodeId: "BAR67890"
        },
        {
          id: '3',
          title: "1984",
          author: "George Orwell",
          isbn: "9782070368228",
          publishYear: 1949,
          publisher: "Gallimard",
          genre: "Science-Fiction",
          summary: "Dans un monde dystopique, Winston Smith tente de résister au régime totalitaire qui l'oppresse.",
          coverImage: "https://example.com/covers/1984.jpg",
          tags: ["Dystopie", "Politique", "Totalitarisme"],
          availableCopies: 0,
          totalCopies: 2,
          isEbook: false,
          popularity: 78,
          qrCode: "QR24680",
          barcodeId: "BAR24680"
        },
        {
          id: '4',
          title: "Madame Bovary",
          author: "Gustave Flaubert",
          isbn: "9782070413119",
          publishYear: 1857,
          publisher: "Gallimard",
          genre: "Roman",
          summary: "Emma Bovary, déçue par son mariage, cherche à échapper à la banalité de sa vie à travers des aventures amoureuses et des dépenses extravagantes.",
          coverImage: "https://example.com/covers/bovary.jpg",
          tags: ["Réalisme", "Tragédie", "Littérature française"],
          availableCopies: 1,
          totalCopies: 3,
          isEbook: true,
          fileFormats: ["PDF"],
          popularity: 72,
          qrCode: "QR13579",
          barcodeId: "BAR13579"
        },
        {
          id: '5',
          title: "Les Misérables",
          author: "Victor Hugo",
          isbn: "9782070409228",
          publishYear: 1862,
          publisher: "Gallimard",
          genre: "Roman",
          summary: "L'histoire de Jean Valjean, ancien forçat qui tente de se racheter, croise celle de nombreux personnages dans la France du 19e siècle.",
          coverImage: "https://example.com/covers/miserables.jpg",
          tags: ["Histoire", "Justice", "Rédemption"],
          availableCopies: 2,
          totalCopies: 4,
          isEbook: false,
          popularity: 80,
          qrCode: "QR97531",
          barcodeId: "BAR97531"
        }
      ];

      try {
        // Try to get real data
        const booksData = await getAllDocuments(COLLECTIONS.LIBRARY.BOOKS);
        
        if (booksData.length > 0) {
          const enhancedBooks = booksData.map(book => ({
            ...book,
            popularity: Math.floor(Math.random() * 100), // Simulated popularity
            qrCode: `QR${Math.floor(Math.random() * 100000)}`,
            barcodeId: `BAR${Math.floor(Math.random() * 100000)}`
          })) as CatalogBook[];
          
          setBooks(enhancedBooks);
          generateRecommendations(enhancedBooks);
        } else {
          setBooks(mockBooks);
          generateRecommendations(mockBooks);
        }
      } catch (error) {
        console.log('Fallback to mock books:', error);
        setBooks(mockBooks);
        generateRecommendations(mockBooks);
      }

      // Extract unique filter options
      const uniqueGenres = Array.from(new Set(mockBooks.map(book => book.genre)));
      const uniqueYears = Array.from(new Set(mockBooks.map(book => book.publishYear))).sort();
      
      setFilterOptions(prev => ({
        ...prev,
        genres: uniqueGenres,
        years: uniqueYears,
        popularity: [0, 100]
      }));
      
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error("Erreur lors du chargement du catalogue");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...books];
    
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(book => 
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.isbn.includes(query) ||
        book.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Active genre filters
    if (activeFilters.length > 0) {
      result = result.filter(book => activeFilters.includes(book.genre));
    }
    
    // Availability filter
    if (filterOptions.availability === 'available') {
      result = result.filter(book => book.availableCopies > 0);
    } else if (filterOptions.availability === 'ebook') {
      result = result.filter(book => book.isEbook);
    }
    
    // Popularity filter
    if (filterOptions.popularity) {
      const [min, max] = filterOptions.popularity;
      result = result.filter(book => 
        book.popularity !== undefined && 
        book.popularity >= min && 
        book.popularity <= max
      );
    }
    
    setFilteredBooks(result);
  };

  const generateRecommendations = (booksList: CatalogBook[]) => {
    // In a real app, this would use user history and preferences
    // For now, just select the most popular books
    const sortedByPopularity = [...booksList].sort((a, b) => 
      (b.popularity || 0) - (a.popularity || 0)
    );
    
    setRecommendations(sortedByPopularity.slice(0, 3));
  };

  const toggleFilter = (genre: string) => {
    if (activeFilters.includes(genre)) {
      setActiveFilters(activeFilters.filter(g => g !== genre));
    } else {
      setActiveFilters([...activeFilters, genre]);
    }
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setSearchQuery('');
    setFilterOptions({
      genres: filterOptions.genres,
      years: filterOptions.years,
      availability: 'all',
      popularity: [0, 100]
    });
  };

  const openEbookViewer = (book: CatalogBook) => {
    if (!book.isEbook) {
      toast.error("Ce livre n'est pas disponible en format numérique");
      return;
    }
    setSelectedEbook(book);
  };

  const downloadEbook = (book: CatalogBook, format: string) => {
    // In a real app, this would initiate a download
    toast.success(`Téléchargement du livre "${book.title}" au format ${format}`);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Catalogue</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? 'Vue liste' : 'Vue grille'}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filtres
          </Button>
        </div>
      </div>

      {/* Search and quick filters */}
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher par titre, auteur, ISBN ou tag..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filterOptions.genres.slice(0, 5).map((genre) => (
            <Badge 
              key={genre}
              variant={activeFilters.includes(genre) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleFilter(genre)}
            >
              {genre}
            </Badge>
          ))}
          {activeFilters.length > 0 && (
            <Badge 
              variant="outline" 
              className="cursor-pointer border-dashed"
              onClick={clearFilters}
            >
              <X className="mr-1 h-3 w-3" />
              Effacer
            </Badge>
          )}
        </div>
      </div>

      {/* Advanced filters dialog */}
      <Dialog open={showFilters} onOpenChange={setShowFilters}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Filtres avancés</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Genres</h4>
              <div className="flex flex-wrap gap-2">
                {filterOptions.genres.map((genre) => (
                  <Badge 
                    key={genre}
                    variant={activeFilters.includes(genre) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleFilter(genre)}
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Disponibilité</h4>
              <Select 
                value={filterOptions.availability} 
                onValueChange={(value: 'all' | 'available' | 'ebook') => 
                  setFilterOptions({...filterOptions, availability: value})
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les livres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les livres</SelectItem>
                  <SelectItem value="available">Disponibles à l'emprunt</SelectItem>
                  <SelectItem value="ebook">E-books uniquement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">
                Popularité: {filterOptions.popularity[0]} - {filterOptions.popularity[1]}
              </h4>
              <Slider 
                defaultValue={[0, 100]}
                min={0}
                max={100}
                step={1}
                value={filterOptions.popularity}
                onValueChange={(value: [number, number]) => 
                  setFilterOptions({...filterOptions, popularity: value})
                }
              />
            </div>
            
            <div className="pt-4">
              <Button onClick={clearFilters} variant="outline" className="w-full">
                Réinitialiser les filtres
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Recommandations</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((book) => (
              <Card key={`rec-${book.id}`} className="overflow-hidden hover:shadow-md">
                <CardHeader className="bg-slate-50 pb-2">
                  <CardTitle className="line-clamp-1 text-sm">{book.title}</CardTitle>
                  <p className="text-xs text-muted-foreground">{book.author}</p>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span>
                      <Badge variant="outline" className="mr-1">
                        Popularité: {book.popularity}%
                      </Badge>
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSelectedBook(book)}
                    >
                      Détails
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Books catalog */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Résultats ({filteredBooks.length} livres)</h2>
        
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Card key={n} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                  <div className="mt-4 h-3 w-1/2 rounded bg-gray-200"></div>
                  <div className="mt-8 h-24 rounded bg-gray-200"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredBooks.length === 0 ? (
          <Card className="p-8 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Aucun livre trouvé</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Essayez de modifier vos critères de recherche.
            </p>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="bg-slate-50 pb-4">
                  <CardTitle className="line-clamp-2 text-lg">{book.title}</CardTitle>
                  <div className="text-sm text-muted-foreground">{book.author}</div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{book.genre}</span>
                    </div>
                    <div>
                      <Badge className="cursor-default">
                        {book.availableCopies > 0 ? `${book.availableCopies} dispo.` : 'Indisponible'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {book.summary}
                    </p>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-1">
                    {book.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {book.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{book.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between bg-slate-50 p-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedBook(book)}
                  >
                    <Book className="mr-2 h-4 w-4" />
                    Détails
                  </Button>
                  {book.isEbook && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEbookViewer(book)}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Lire en ligne
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="overflow-hidden transition-all hover:shadow-md">
                <div className="flex flex-col sm:flex-row">
                  <div className="border-r p-4 sm:w-1/3">
                    <h3 className="font-semibold">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <Badge variant="outline">{book.genre}</Badge>
                      {book.isEbook && <Badge>E-book</Badge>}
                    </div>
                    <p className="mt-2 text-sm">
                      ISBN: <span className="font-mono">{book.isbn}</span>
                    </p>
                  </div>
                  <div className="p-4 sm:w-2/3">
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {book.summary}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <Badge className={book.availableCopies > 0 ? "bg-green-500" : "bg-red-500"}>
                          {book.availableCopies > 0 
                            ? `${book.availableCopies}/${book.totalCopies} disponibles` 
                            : 'Indisponible'}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedBook(book)}
                        >
                          Détails
                        </Button>
                        {book.isEbook && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => openEbookViewer(book)}
                          >
                            Lire
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Book details dialog */}
      <Dialog open={selectedBook !== null} onOpenChange={(open) => !open && setSelectedBook(null)}>
        {selectedBook && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedBook.title}</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Détails</TabsTrigger>
                <TabsTrigger value="copies">Exemplaires</TabsTrigger>
                <TabsTrigger value="history">Historique</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold">Informations générales</h4>
                    <div className="mt-2 space-y-2 text-sm">
                      <p><span className="font-medium">Auteur:</span> {selectedBook.author}</p>
                      <p><span className="font-medium">ISBN:</span> {selectedBook.isbn}</p>
                      <p><span className="font-medium">Éditeur:</span> {selectedBook.publisher}</p>
                      <p><span className="font-medium">Année:</span> {selectedBook.publishYear}</p>
                      <p><span className="font-medium">Genre:</span> {selectedBook.genre}</p>
                    </div>
                    
                    <h4 className="mt-4 font-semibold">Tags</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedBook.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">Résumé</h4>
                    <p className="mt-2 text-sm text-muted-foreground">{selectedBook.summary}</p>
                    
                    <h4 className="mt-4 font-semibold">Disponibilité</h4>
                    <div className="mt-2 space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Exemplaires physiques:</span> {selectedBook.availableCopies}/{selectedBook.totalCopies} disponibles
                      </p>
                      
                      {selectedBook.isEbook && (
                        <>
                          <p className="text-sm font-medium">Disponible en format numérique:</p>
                          <div className="flex gap-2">
                            {selectedBook.fileFormats?.map(format => (
                              <Button 
                                key={format} 
                                variant="outline" 
                                size="sm"
                                onClick={() => downloadEbook(selectedBook, format)}
                              >
                                <Download className="mr-2 h-3 w-3" />
                                {format}
                              </Button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="copies" className="space-y-4 pt-4">
                <h4 className="font-semibold">Codes d'identification</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Code QR:</span> {selectedBook.qrCode}
                    <Button variant="ghost" size="sm" className="ml-2">
                      <FileText className="h-3 w-3" />
                    </Button>
                  </p>
                  <p>
                    <span className="font-medium">Code-barres:</span> {selectedBook.barcodeId}
                    <Button variant="ghost" size="sm" className="ml-2">
                      <FileText className="h-3 w-3" />
                    </Button>
                  </p>
                </div>
                
                <h4 className="font-semibold">État des exemplaires</h4>
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-slate-50">
                        <th className="px-4 py-2 text-left">ID</th>
                        <th className="px-4 py-2 text-left">État</th>
                        <th className="px-4 py-2 text-left">Emplacement</th>
                        <th className="px-4 py-2 text-left">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({length: selectedBook.totalCopies}).map((_, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-4 py-2 font-mono">COPY-{selectedBook.id}-{index+1}</td>
                          <td className="px-4 py-2">
                            {index < selectedBook.totalCopies - selectedBook.availableCopies 
                              ? "En bon état" 
                              : "Excellent"}
                          </td>
                          <td className="px-4 py-2">Étagère {String.fromCharCode(65 + (index % 26))}-{Math.floor(Math.random() * 20) + 1}</td>
                          <td className="px-4 py-2">
                            <Badge 
                              variant={index < selectedBook.availableCopies ? "default" : "secondary"}
                            >
                              {index < selectedBook.availableCopies ? "Disponible" : "Emprunté"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="space-y-4 pt-4">
                <h4 className="font-semibold">Historique des emprunts</h4>
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-slate-50">
                        <th className="px-4 py-2 text-left">Date d'emprunt</th>
                        <th className="px-4 py-2 text-left">Date de retour</th>
                        <th className="px-4 py-2 text-left">Adhérent</th>
                        <th className="px-4 py-2 text-left">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({length: 5}).map((_, index) => {
                        const isLate = index === 1;
                        const isOngoing = index === 0;
                        const borrowDate = new Date();
                        borrowDate.setDate(borrowDate.getDate() - (isOngoing ? 10 : 20 + index * 30));
                        
                        const returnDate = new Date(borrowDate);
                        returnDate.setDate(returnDate.getDate() + 14);
                        
                        const actualReturnDate = isOngoing 
                          ? null 
                          : new Date(returnDate);
                        
                        if (!isOngoing && !isLate) {
                          actualReturnDate?.setDate(actualReturnDate.getDate() - Math.floor(Math.random() * 5));
                        } else if (isLate) {
                          actualReturnDate?.setDate(actualReturnDate.getDate() + 7);
                        }
                        
                        return (
                          <tr key={index} className="border-b">
                            <td className="px-4 py-2">{borrowDate.toLocaleDateString()}</td>
                            <td className="px-4 py-2">
                              {isOngoing ? "En cours" : actualReturnDate?.toLocaleDateString()}
                            </td>
                            <td className="px-4 py-2">Adhérent #{Math.floor(Math.random() * 1000) + 1000}</td>
                            <td className="px-4 py-2">
                              <Badge 
                                variant={
                                  isOngoing 
                                    ? "default" 
                                    : isLate 
                                    ? "destructive" 
                                    : "success"
                                }
                              >
                                {isOngoing 
                                  ? "En cours" 
                                  : isLate 
                                  ? "Retard" 
                                  : "Retourné"}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                <h4 className="font-semibold">Réservations</h4>
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-slate-50">
                        <th className="px-4 py-2 text-left">Date de réservation</th>
                        <th className="px-4 py-2 text-left">Adhérent</th>
                        <th className="px-4 py-2 text-left">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedBook.availableCopies === 0 ? (
                        Array.from({length: 2}).map((_, index) => {
                          const reservationDate = new Date();
                          reservationDate.setDate(reservationDate.getDate() - index * 2);
                          
                          return (
                            <tr key={index} className="border-b">
                              <td className="px-4 py-2">{reservationDate.toLocaleDateString()}</td>
                              <td className="px-4 py-2">Adhérent #{Math.floor(Math.random() * 1000) + 1000}</td>
                              <td className="px-4 py-2">
                                <Badge variant="secondary">En attente</Badge>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={3} className="px-4 py-4 text-center text-muted-foreground">
                            Aucune réservation en cours
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setSelectedBook(null)}>
                Fermer
              </Button>
              {selectedBook.isEbook && (
                <Button onClick={() => openEbookViewer(selectedBook)}>
                  <FileText className="mr-2 h-4 w-4" />
                  Lire en ligne
                </Button>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
      
      {/* E-book viewer dialog */}
      <Dialog open={selectedEbook !== null} onOpenChange={(open) => !open && setSelectedEbook(null)}>
        {selectedEbook && (
          <DialogContent className="max-h-[90vh] max-w-4xl overflow-auto">
            <DialogHeader>
              <DialogTitle>{selectedEbook.title}</DialogTitle>
            </DialogHeader>
            
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {selectedEbook.author} • {selectedEbook.publishYear}
                  </p>
                </div>
                <div className="flex gap-2">
                  {selectedEbook.fileFormats?.map(format => (
                    <Button 
                      key={format} 
                      variant="outline" 
                      size="sm"
                      onClick={() => downloadEbook(selectedEbook, format)}
                    >
                      <Download className="mr-2 h-3 w-3" />
                      {format}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="min-h-[50vh] rounded-md border border-dashed p-8 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Lecteur de livre numérique</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Dans une application réelle, le contenu du livre serait affiché ici.
                </p>
                <div className="mt-8">
                  <p className="text-sm">
                    Début du texte de "{selectedEbook.title}" par {selectedEbook.author}:
                  </p>
                  <div className="mx-auto mt-4 max-w-md text-justify text-sm">
                    <p className="mb-4">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. 
                      Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. 
                      Cras elementum ultrices diam.
                    </p>
                    <p>
                      Maecenas ligula massa, varius a, semper congue, euismod non, mi. 
                      Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, 
                      non fermentum diam nisl sit amet erat.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between border-t pt-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    <Clock className="mr-2 h-4 w-4" />
                    30 minutes de lecture restantes
                  </Button>
                </div>
                <Button variant="outline" onClick={() => setSelectedEbook(null)}>
                  Fermer
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default CatalogPage;
