
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MostBorrowedBookData {
  title: string;
  borrowCount: number;
}

interface MostBorrowedBooksTableProps {
  books: MostBorrowedBookData[];
}

const MostBorrowedBooksTable: React.FC<MostBorrowedBooksTableProps> = ({ 
  books 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Livres les plus empruntés</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-3 font-medium">Titre</th>
                <th className="p-3 font-medium text-right">Nombre d'emprunts</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, index) => (
                <tr key={index} className="border-b">
                  <td className="p-3">{book.title}</td>
                  <td className="p-3 text-right font-mono">{book.borrowCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MostBorrowedBooksTable;
