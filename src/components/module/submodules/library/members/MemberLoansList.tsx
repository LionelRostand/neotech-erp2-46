
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Book, AlertCircle, CheckCircle2 } from "lucide-react";
import { format, isAfter } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BookLoan } from '../types/library-types';

interface MemberLoansListProps {
  loans: BookLoan[];
}

const MemberLoansList: React.FC<MemberLoansListProps> = ({ loans }) => {
  if (loans.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <Book className="h-8 w-8 text-slate-400" />
          <h3 className="font-semibold text-lg">Aucun emprunt</h3>
          <p className="text-sm text-muted-foreground">
            Cet adhérent n'a pas encore emprunté de livre.
          </p>
        </div>
      </div>
    );
  }

  const isLoanOverdue = (dueDate: string) => {
    return isAfter(new Date(), new Date(dueDate));
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Livre</TableHead>
            <TableHead>Date d'emprunt</TableHead>
            <TableHead>Date de retour prévue</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loans.map((loan) => (
            <TableRow key={loan.id}>
              <TableCell>{loan.bookTitle}</TableCell>
              <TableCell>
                {format(new Date(loan.borrowDate), 'dd MMM yyyy', { locale: fr })}
              </TableCell>
              <TableCell>
                {format(new Date(loan.dueDate), 'dd MMM yyyy', { locale: fr })}
              </TableCell>
              <TableCell>
                {loan.returned ? (
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-green-600">Retourné le {format(new Date(loan.returnDate!), 'dd/MM/yyyy', { locale: fr })}</span>
                  </div>
                ) : isLoanOverdue(loan.dueDate) ? (
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-red-600 mr-1" />
                    <Badge variant="destructive">En retard</Badge>
                  </div>
                ) : (
                  <Badge variant="outline">En cours</Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MemberLoansList;
