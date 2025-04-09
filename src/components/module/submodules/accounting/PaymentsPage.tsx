
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Filter, Calendar } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from './utils/formatting';

const mockPayments = [
  {
    id: '1',
    invoiceNumber: 'INV-2023-001',
    clientName: 'Entreprise ABC',
    date: '2023-02-10',
    amount: 1250.00,
    method: 'Carte bancaire',
    status: 'completed'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2023-005',
    clientName: 'Société XYZ',
    date: '2023-02-15',
    amount: 750.00,
    method: 'Virement bancaire',
    status: 'pending'
  },
  {
    id: '3',
    invoiceNumber: 'INV-2023-008',
    clientName: 'Client Particulier',
    date: '2023-02-18',
    amount: 450.00,
    method: 'PayPal',
    status: 'completed'
  }
];

const PaymentsPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Paiements</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" /> Planifier
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nouveau Paiement
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="completed">Complétés</TabsTrigger>
            <TabsTrigger value="pending">En attente</TabsTrigger>
            <TabsTrigger value="failed">Échoués</TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" /> Filtrer
          </Button>
        </div>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Tous les paiements</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentsTable payments={mockPayments} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Paiements complétés</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentsTable payments={mockPayments.filter(p => p.status === 'completed')} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Paiements en attente</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentsTable payments={mockPayments.filter(p => p.status === 'pending')} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="failed">
          <Card>
            <CardHeader>
              <CardTitle>Paiements échoués</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentsTable payments={mockPayments.filter(p => p.status === 'failed')} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface PaymentsTableProps {
  payments: {
    id: string;
    invoiceNumber: string;
    clientName: string;
    date: string;
    amount: number;
    method: string;
    status: string;
  }[];
}

const PaymentsTable: React.FC<PaymentsTableProps> = ({ payments }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Complété</Badge>;
      case 'pending':
        return <Badge variant="secondary">En attente</Badge>;
      case 'failed':
        return <Badge variant="destructive">Échoué</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Numéro de facture</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Montant</TableHead>
          <TableHead>Méthode</TableHead>
          <TableHead>Statut</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4">
              Aucun paiement trouvé
            </TableCell>
          </TableRow>
        ) : (
          payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="font-medium">{payment.invoiceNumber}</TableCell>
              <TableCell>{payment.clientName}</TableCell>
              <TableCell>{formatDate(payment.date)}</TableCell>
              <TableCell>{formatCurrency(payment.amount, 'EUR')}</TableCell>
              <TableCell>{payment.method}</TableCell>
              <TableCell>{getStatusBadge(payment.status)}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default PaymentsPage;
