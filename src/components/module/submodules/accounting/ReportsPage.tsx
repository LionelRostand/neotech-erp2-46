
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTransactionsData } from './hooks/useTransactionsData';
import { BarChart, AreaChart, PieChart, Calendar, Download, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate } from './utils/formatting';

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("transactions");
  const { transactions, isLoading } = useTransactionsData();
  
  // Calculer quelques statistiques de base
  const totalIncomes = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const netAmount = totalIncomes - totalExpenses;

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Rapports financiers</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" /> Période
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Exporter
          </Button>
        </div>
      </div>
      
      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Revenus totaux</CardDescription>
            <CardTitle className="text-2xl text-green-500">
              {isLoading ? <Skeleton className="h-8 w-24" /> : formatCurrency(totalIncomes, 'EUR')}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Dépenses totales</CardDescription>
            <CardTitle className="text-2xl text-red-500">
              {isLoading ? <Skeleton className="h-8 w-24" /> : formatCurrency(totalExpenses, 'EUR')}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Résultat net</CardDescription>
            <CardTitle className={`text-2xl ${netAmount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {isLoading ? <Skeleton className="h-8 w-24" /> : formatCurrency(netAmount, 'EUR')}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span>Transactions</span>
            </TabsTrigger>
            <TabsTrigger value="incomes" className="flex items-center gap-2">
              <AreaChart className="h-4 w-4" />
              <span>Revenus</span>
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              <span>Dépenses</span>
            </TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" /> Filtrer
          </Button>
        </div>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transactions récentes</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Montant</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          Aucune transaction trouvée
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.slice(0, 10).map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{formatDate(transaction.date)}</TableCell>
                          <TableCell className="font-medium">{transaction.description}</TableCell>
                          <TableCell>{transaction.category}</TableCell>
                          <TableCell>
                            {transaction.type === 'income' ? 'Revenu' : 
                             transaction.type === 'expense' ? 'Dépense' : 'Transfert'}
                          </TableCell>
                          <TableCell className={`font-medium ${
                            transaction.type === 'income' ? 'text-green-500' : 
                            transaction.type === 'expense' ? 'text-red-500' : ''
                          }`}>
                            {formatCurrency(transaction.amount, transaction.currency)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incomes">
          <Card>
            <CardHeader>
              <CardTitle>Analyse des revenus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center text-muted-foreground">
                Graphique des revenus (À implémenter)
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Analyse des dépenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center text-muted-foreground">
                Graphique des dépenses (À implémenter)
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
