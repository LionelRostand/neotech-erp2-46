
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
import { formatCurrency } from '../utils/formatting';
import { ArrowUpRight, ArrowDownRight, ArrowLeftRight } from 'lucide-react';
import { Transaction } from '../types/accounting-types';

interface RecentTransactionsTableProps {
  transactions: Transaction[];
}

const RecentTransactionsTable: React.FC<RecentTransactionsTableProps> = ({ transactions }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Catégorie</TableHead>
          <TableHead>Montant</TableHead>
          <TableHead>Statut</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4">
              Aucune transaction récente
            </TableCell>
          </TableRow>
        ) : (
          transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">{new Date(transaction.date).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  {transaction.type === 'income' && <ArrowUpRight className="mr-2 h-4 w-4 text-green-500" />}
                  {transaction.type === 'expense' && <ArrowDownRight className="mr-2 h-4 w-4 text-red-500" />}
                  {transaction.type === 'transfer' && <ArrowLeftRight className="mr-2 h-4 w-4 text-blue-500" />}
                  {transaction.description}
                </div>
              </TableCell>
              <TableCell>{transaction.category}</TableCell>
              <TableCell className={`font-medium ${
                transaction.type === 'income' 
                  ? 'text-green-600' 
                  : transaction.type === 'expense' 
                    ? 'text-red-600' 
                    : ''
              }`}>
                {transaction.type === 'income' ? '+ ' : transaction.type === 'expense' ? '- ' : ''}
                {formatCurrency(transaction.amount, transaction.currency)}
              </TableCell>
              <TableCell>
                <Badge variant={transaction.isReconciled ? "success" : "outline"}>
                  {transaction.isReconciled ? 'Rapproché' : 'En attente'}
                </Badge>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default RecentTransactionsTable;
