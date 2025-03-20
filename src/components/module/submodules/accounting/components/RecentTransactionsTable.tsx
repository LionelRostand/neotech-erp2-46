
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

// Données mockées pour le prototype
const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2023-07-10',
    description: 'Paiement client Entreprise ABC',
    amount: 3500,
    type: 'income',
    category: 'Ventes',
    accountId: 'acc1',
    invoiceId: 'inv123',
    isReconciled: true,
    currency: 'EUR',
    createdAt: '2023-07-10T10:23:45',
    updatedAt: '2023-07-10T10:23:45'
  },
  {
    id: '2',
    date: '2023-07-08',
    description: 'Achat fournitures de bureau',
    amount: 450,
    type: 'expense',
    category: 'Fournitures',
    accountId: 'acc1',
    isReconciled: true,
    currency: 'EUR',
    createdAt: '2023-07-08T14:30:00',
    updatedAt: '2023-07-08T14:30:00'
  },
  {
    id: '3',
    date: '2023-07-05',
    description: 'Transfert vers compte épargne',
    amount: 2000,
    type: 'transfer',
    category: 'Transfert interne',
    accountId: 'acc1',
    isReconciled: true,
    currency: 'EUR',
    createdAt: '2023-07-05T16:45:22',
    updatedAt: '2023-07-05T16:45:22'
  },
  {
    id: '4',
    date: '2023-07-01',
    description: 'Facture consultant IT',
    amount: 1200,
    type: 'expense',
    category: 'Services',
    accountId: 'acc1',
    isReconciled: false,
    currency: 'EUR',
    createdAt: '2023-07-01T09:15:33',
    updatedAt: '2023-07-01T09:15:33'
  },
  {
    id: '5',
    date: '2023-06-28',
    description: 'Paiement client XYZ Corp',
    amount: 5750,
    type: 'income',
    category: 'Ventes',
    accountId: 'acc1',
    invoiceId: 'inv121',
    isReconciled: true,
    currency: 'EUR',
    createdAt: '2023-06-28T11:05:12',
    updatedAt: '2023-06-28T11:05:12'
  }
];

const RecentTransactionsTable: React.FC = () => {
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
        {mockTransactions.map((transaction) => (
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
        ))}
      </TableBody>
    </Table>
  );
};

export default RecentTransactionsTable;
