
import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Download, BookOpen, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { getAllDocuments, addDocument, updateDocument, deleteDocument } from '@/hooks/firestore/firestore-utils';
import BookForm from './components/BookForm';
import { toast } from 'sonner';

// Types
export interface Book {
  id?: string;
  title: string;
  author: string;
  isbn: string;
  publishYear: number;
  publisher: string;
  genre: string;
  summary: string;
  coverImage?: string;
  tags: string[];
  availableCopies: number;
  totalCopies: number;
  isEbook: boolean;
  fileFormats?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const BooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      // In a real app, fetch from Firestore
      // For now, use mock data
      const mockBooks: Book[] = [
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
          fileFormats: ["PDF", "EPUB"]
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
          fileFormats: ["PDF", "EPUB", "MOBI"]
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
          isEbook: false
        }
      ];

      try {
        // Try to get real data from Firestore
        const booksData = await getAllDocuments(COLLECTIONS.LIBRARY.BOOKS);
        if (booksData.length > 0) {
          setBooks(booksData as Book[]);
        } else {
          setBooks(mockBooks);
        }
      } catch (error) {
        console.log('Fallback to mock books:', error);
        setBooks(mockBooks);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error("Erreur lors du chargement des livres");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (book: Book) => {
    try {
      // Add the book to Firestore
      const newBook = await addDocument(COLLECTIONS.LIBRARY.BOOKS, {
        ...book,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      setBooks([...books, newBook as unknown as Book]);
      setIsAddDialogOpen(false);
      toast.success("Livre ajouté avec succès");
    } catch (error) {
      console.error('Error adding book:', error);
      toast.error("Erreur lors de l'ajout du livre");
    }
  };

  const handleUpdateBook = async (book: Book) => {
    if (!book.id) return;
    
    try {
      // Update the book in Firestore
      await updateDocument(COLLECTIONS.LIBRARY.BOOKS, book.id, {
        ...book,
        updatedAt: new Date()
      });
      
      setBooks(books.map(b => b.id === book.id ? book : b));
      setIsEditDialogOpen(false);
      toast.success("Livre mis à jour avec succès");
    } catch (error) {
      console.error('Error updating book:', error);
      toast.error("Erreur lors de la mise à jour du livre");
    }
  };

  const handleDeleteBook = async () => {
    if (!selectedBook?.id) return;
    
    try {
      // Delete the book from Firestore
      await deleteDocument(COLLECTIONS.LIBRARY.BOOKS, selectedBook.id);
      
      setBooks(books.filter(b => b.id !== selectedBook.id));
      setIsDeleteDialogOpen(false);
      toast.success("Livre supprimé avec succès");
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error("Erreur lors de la suppression du livre");
    }
  };

  // Filter books based on search query and active tab
  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.includes(searchQuery);
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'available') return matchesSearch && book.availableCopies > 0;
    if (activeTab === 'ebooks') return matchesSearch && book.isEbook;
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Livres</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un livre
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher par titre, auteur ou ISBN..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="available">Disponibles</TabsTrigger>
              <TabsTrigger value="ebooks">E-books</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Books list */}
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
            Essayez de modifier vos critères de recherche ou ajoutez un nouveau livre.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBooks.map((book) => (
            <Card key={book.id} className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="bg-slate-50 pb-4">
                <div className="flex justify-between">
                  <CardTitle className="line-clamp-2 text-lg">{book.title}</CardTitle>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => {
                        setSelectedBook(book);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => {
                        setSelectedBook(book);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">{book.author}</div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center text-sm">
                  <span className="font-medium">ISBN:</span>
                  <span className="ml-2 font-mono">{book.isbn}</span>
                </div>
                <div className="mb-4 flex items-center text-sm">
                  <span className="font-medium">Publication:</span>
                  <span className="ml-2">{book.publishYear} • {book.publisher}</span>
                </div>
                <div className="mb-4 line-clamp-3 text-sm text-muted-foreground">
                  {book.summary}
                </div>
                <div className="mb-4 flex flex-wrap gap-2">
                  {book.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">{tag}</Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Badge variant={book.availableCopies > 0 ? "success" : "destructive"} className="rounded-sm">
                      {book.availableCopies > 0 ? 'Disponible' : 'Indisponible'}
                    </Badge>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {book.availableCopies}/{book.totalCopies} exemplaires
                    </span>
                  </div>
                  {book.isEbook && (
                    <Button variant="outline" size="sm">
                      <Download className="mr-1 h-3 w-3" /> E-book
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Book Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau livre</DialogTitle>
          </DialogHeader>
          <BookForm onSubmit={handleAddBook} onCancel={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Book Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Modifier le livre</DialogTitle>
          </DialogHeader>
          {selectedBook && (
            <BookForm 
              book={selectedBook} 
              onSubmit={handleUpdateBook} 
              onCancel={() => setIsEditDialogOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Êtes-vous sûr de vouloir supprimer le livre "{selectedBook?.title}" ?</p>
            <p className="mt-2 text-sm text-muted-foreground">Cette action est irréversible.</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={handleDeleteBook}>Supprimer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BooksPage;
