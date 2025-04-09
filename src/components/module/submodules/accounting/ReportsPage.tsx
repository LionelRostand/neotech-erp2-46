
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useReportsCollection, useTransactionsCollection } from './hooks/useAccountingCollection';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileDown } from 'lucide-react';

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("revenu");
  const [periodFilter, setPeriodFilter] = useState("year");
  const { data: reportsData, isLoading: reportsLoading } = useReportsCollection();
  const { data: transactions, isLoading: transactionsLoading } = useTransactionsCollection();

  // Données mock pour les graphiques en attendant l'implémentation réelle
  const revenueData = [
    { month: 'Jan', income: 10500, expenses: 8000 },
    { month: 'Fév', income: 12000, expenses: 8500 },
    { month: 'Mar', income: 9800, expenses: 7800 },
    { month: 'Avr', income: 15000, expenses: 9000 },
    { month: 'Mai', income: 14000, expenses: 8200 },
    { month: 'Juin', income: 17000, expenses: 9500 },
  ];

  const taxData = [
    { name: 'TVA Collectée', value: 5800, fill: '#4f46e5' },
    { name: 'TVA Déductible', value: 3200, fill: '#10b981' },
    { name: 'TVA à Payer', value: 2600, fill: '#f59e0b' },
  ];

  const clientsData = [
    { name: 'Tech Solutions', value: 28000, fill: '#4f46e5' },
    { name: 'Eco Consulting', value: 22000, fill: '#10b981' },
    { name: 'Global Finance', value: 18000, fill: '#f59e0b' },
    { name: 'Digital Media', value: 15000, fill: '#ef4444' },
    { name: 'Autres', value: 17000, fill: '#a3a3a3' },
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Rapports Financiers</h1>
        <div className="flex space-x-4">
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
              <SelectItem value="custom">Personnalisé</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <FileDown className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="revenu">Revenu & Dépenses</TabsTrigger>
          <TabsTrigger value="tva">TVA</TabsTrigger>
          <TabsTrigger value="clients">Par Client</TabsTrigger>
          <TabsTrigger value="balance">Bilan</TabsTrigger>
        </TabsList>
        
        <TabsContent value="revenu">
          <Card>
            <CardHeader>
              <CardTitle>Revenu et Dépenses</CardTitle>
              <CardDescription>
                Vue d'ensemble des revenus et dépenses pour la période sélectionnée
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={revenueData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value} €`} />
                    <Legend />
                    <Bar dataKey="income" name="Revenu" fill="#4f46e5" />
                    <Bar dataKey="expenses" name="Dépenses" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Revenu Total</p>
                    <h3 className="text-2xl font-bold text-green-600">78 300 €</h3>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Dépenses Totales</p>
                    <h3 className="text-2xl font-bold text-red-600">51 000 €</h3>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Bénéfice Net</p>
                    <h3 className="text-2xl font-bold">27 300 €</h3>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tva">
          <Card>
            <CardHeader>
              <CardTitle>Rapport de TVA</CardTitle>
              <CardDescription>
                Résumé de la TVA collectée, déductible et à payer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={taxData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value} €`}
                      >
                        {taxData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value} €`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground">TVA Collectée</p>
                      <h3 className="text-2xl font-bold">5 800 €</h3>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground">TVA Déductible</p>
                      <h3 className="text-2xl font-bold">3 200 €</h3>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground">TVA à Payer</p>
                      <h3 className="text-2xl font-bold">2 600 €</h3>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Répartition par Client</CardTitle>
              <CardDescription>
                Analyse des revenus par client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={clientsData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value} €`}
                    >
                      {clientsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} €`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="balance">
          <Card>
            <CardHeader>
              <CardTitle>Bilan Comptable</CardTitle>
              <CardDescription>
                Résumé des actifs et passifs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Actifs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Trésorerie</TableCell>
                          <TableCell className="text-right">45 000 €</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Créances clients</TableCell>
                          <TableCell className="text-right">32 500 €</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Immobilisations</TableCell>
                          <TableCell className="text-right">78 000 €</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Stocks</TableCell>
                          <TableCell className="text-right">12 000 €</TableCell>
                        </TableRow>
                        <TableRow className="border-t-2">
                          <TableCell className="font-bold">Total Actifs</TableCell>
                          <TableCell className="text-right font-bold">167 500 €</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Passifs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Dettes fournisseurs</TableCell>
                          <TableCell className="text-right">18 000 €</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Emprunts</TableCell>
                          <TableCell className="text-right">50 000 €</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Dettes fiscales</TableCell>
                          <TableCell className="text-right">12 500 €</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Capitaux propres</TableCell>
                          <TableCell className="text-right">87 000 €</TableCell>
                        </TableRow>
                        <TableRow className="border-t-2">
                          <TableCell className="font-bold">Total Passifs</TableCell>
                          <TableCell className="text-right font-bold">167 500 €</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;

// Component de table interne pour éviter les erreurs d'import
const Table = ({ children }: { children: React.ReactNode }) => (
  <table className="w-full">{children}</table>
);

const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody>{children}</tbody>
);

const TableRow = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <tr className={className}>{children}</tr>
);

const TableCell = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <td className={`py-2 ${className}`}>{children}</td>
);
