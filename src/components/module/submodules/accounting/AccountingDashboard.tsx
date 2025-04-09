
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { formatCurrency } from './utils/formatting';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { ArrowRight, Plus, Calendar, Download } from 'lucide-react';
import RecentInvoicesTable from './components/RecentInvoicesTable';
import { Invoice } from './types/accounting-types';

// Exemples de données
const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2023-001',
    clientName: 'Entreprise ABC',
    issueDate: '2023-01-15',
    dueDate: '2023-02-15',
    total: 1250.00,
    status: 'paid',
    currency: 'EUR'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2023-002',
    clientName: 'Société XYZ',
    issueDate: '2023-01-20',
    dueDate: '2023-02-20',
    total: 850.00,
    status: 'pending',
    currency: 'EUR'
  },
  {
    id: '3',
    invoiceNumber: 'INV-2023-003',
    clientName: 'Client Particulier',
    issueDate: '2023-02-01',
    dueDate: '2023-03-01',
    total: 450.00,
    status: 'overdue',
    currency: 'EUR'
  }
];

const revenueData = [
  { name: 'Jan', value: 12500 },
  { name: 'Fév', value: 9800 },
  { name: 'Mar', value: 15000 },
  { name: 'Avr', value: 16700 },
  { name: 'Mai', value: 14300 },
  { name: 'Jui', value: 18200 }
];

const invoiceStatusData = [
  { name: 'Payées', value: 28, color: '#10b981' },
  { name: 'En attente', value: 45, color: '#f59e0b' },
  { name: 'En retard', value: 13, color: '#ef4444' },
  { name: 'Brouillons', value: 14, color: '#6b7280' }
];

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6b7280'];

const AccountingDashboard: React.FC = () => {
  const [selectedInvoice, setSelectedInvoice] = React.useState<Invoice | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord comptabilité</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Chiffre d'affaires (mois en cours)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(18200, 'EUR')}</div>
            <p className="text-xs text-muted-foreground">
              +12% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Factures impayées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(7850, 'EUR')}</div>
            <p className="text-xs text-muted-foreground">
              8 factures en attente
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dépenses (mois en cours)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(12100, 'EUR')}</div>
            <p className="text-xs text-muted-foreground">
              -5% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              TVA à déclarer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(3700, 'EUR')}</div>
            <p className="text-xs text-muted-foreground">
              Prochaine déclaration: T2 2023
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Évolution du chiffre d'affaires</CardTitle>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Période
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={revenueData}
                    margin={{
                      top: 5,
                      right: 10,
                      left: 10,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number, 'EUR')} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Chiffre d'affaires"
                      stroke="#4f46e5"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="invoices" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="invoices">Factures récentes</TabsTrigger>
              <TabsTrigger value="expenses">Dépenses récentes</TabsTrigger>
            </TabsList>
            <TabsContent value="invoices">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>Factures récentes</CardTitle>
                    <Button size="sm" variant="outline" asChild>
                      <a href="/modules/accounting/invoices">
                        Voir toutes <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <RecentInvoicesTable 
                    invoices={mockInvoices} 
                    onViewInvoice={handleViewInvoice}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="expenses">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>Dépenses récentes</CardTitle>
                    <Button size="sm" variant="outline">
                      Voir toutes <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    Le module de gestion des dépenses sera disponible prochainement
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Status and Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statut des factures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={invoiceStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {invoiceStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full justify-start" asChild>
                  <a href="/modules/accounting/invoices">
                    <Plus className="mr-2 h-4 w-4" /> Nouvelle facture
                  </a>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <a href="/modules/accounting/payments">
                    <Plus className="mr-2 h-4 w-4" /> Nouveau paiement
                  </a>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <a href="/modules/accounting/reports">
                    <Download className="mr-2 h-4 w-4" /> Rapport financier
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccountingDashboard;
