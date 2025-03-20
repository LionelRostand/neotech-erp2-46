
import React from 'react';
import { BookPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book } from '../types/library-types';
import { format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';

interface NewBooksCardProps {
  newBooks: Book[];
  onViewBook: (bookId: string) => void;
}

const NewBooksCard: React.FC<NewBooksCardProps> = ({ 
  newBooks, 
  onViewBook 
}) => {
  if (newBooks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookPlus className="h-5 w-5 text-blue-500" />
            <span>Nouveaux livres</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-muted-foreground">Aucun nouveau livre ajouté récemment.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookPlus className="h-5 w-5 text-blue-500" />
          <span>Nouveaux livres</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {newBooks.slice(0, 5).map((book) => (
            <div key={book.id} className="flex items-center justify-between border-b pb-3">
              <div>
                <p className="font-medium">{book.title}</p>
                <p className="text-sm text-muted-foreground">
                  {book.author}
                </p>
                <p className="text-xs text-muted-foreground">
                  Ajouté le {format(new Date(book.createdAt), 'dd MMM yyyy', { locale: fr })}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onViewBook(book.id!)}
              >
                Détails
              </Button>
            </div>
          ))}
          
          {newBooks.length > 5 && (
            <div className="text-center pt-2">
              <Button variant="link">Voir tous les {newBooks.length} nouveaux livres</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NewBooksCard;
