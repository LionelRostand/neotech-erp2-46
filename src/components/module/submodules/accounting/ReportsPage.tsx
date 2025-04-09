
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, FileDown, BarChart3, PieChart, LineChart as LineChartIcon, ArrowUpDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useReportsData } from './hooks/useReportsData';
import { formatCurrency } from './utils/formatting';
import { toast } from 'sonner';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#F0E68C'];

const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState('revenue');
  const [dateRange, setDateRange] = useState('year');
  const [chartType, setChartType] = useState('bar');
  
  const { 
    monthlyRevenueData, 
    paymentMethodsData, 
    invoiceStatusData,
    quarterlyComparisonData,
    financialStats,
    isLoading 
  } = useReportsData();

  const handleExport = (format: 'pdf' | 'excel') => {
    toast.success(`Rapport exporté en format ${format.toUpperCase()}`);
  };

  const getReportTitle = () => {
    switch (reportType) {
      case 'revenue':
        return 'Revenus mensuels';
      case 'payment-methods':
        return 'Répartition des méthodes de paiement';
      case 'invoice-status':
        return 'Statut des factures';
      case 'quarterly':
        return 'Comparaison trimestrielle';
      default:
        return 'Rapport financier';
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Rapports Financiers</h1>
          <p className="text-muted-foreground">Analyse et visualisation de vos données financières</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('excel')}>
            <FileDown className="h-4 w-4 mr-2" />
            Excel
          </Button>
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="h-7 w-24" />
              ) : (
                formatCurrency(financialStats.totalRevenue, 'EUR')
              )}
            </div>
            <p className="text-muted-foreground">Chiffre d'affaires total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="h-7 w-24" />
              ) : (
                formatCurrency(financialStats.totalPaid, 'EUR')
              )}
            </div>
            <p className="text-muted-foreground">Total encaissé</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="h-7 w-24" />
              ) : (
                formatCurrency(financialStats.totalDue, 'EUR')
              )}
            </div>
            <p className="text-muted-foreground">Montant à encaisser</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="h-7 w-24" />
              ) : (
                formatCurrency(financialStats.averageInvoice, 'EUR')
              )}
            </div>
            <p className="text-muted-foreground">Montant moyen/facture</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reportType">Type de rapport</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenus mensuels</SelectItem>
                  <SelectItem value="payment-methods">Méthodes de paiement</SelectItem>
                  <SelectItem value="invoice-status">Statut des factures</SelectItem>
                  <SelectItem value="quarterly">Comparaison trimestrielle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateRange">Période</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Dernier mois</SelectItem>
                  <SelectItem value="quarter">Dernier trimestre</SelectItem>
                  <SelectItem value="year">Dernière année</SelectItem>
                  <SelectItem value="custom">Personnalisée</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {reportType === 'revenue' && (
              <div className="space-y-2">
                <Label htmlFor="chartType">Type de graphique</Label>
                <Tabs defaultValue="bar" value={chartType} onValueChange={setChartType}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="bar">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Barres
                    </TabsTrigger>
                    <TabsTrigger value="line">
                      <LineChartIcon className="h-4 w-4 mr-2" />
                      Ligne
                    </TabsTrigger>
                    <TabsTrigger value="area">
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      Aires
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            )}
            
            <Button className="w-full">Générer le rapport</Button>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>{getReportTitle()}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-[400px]">
                <Skeleton className="h-[400px] w-full rounded-md" />
              </div>
            ) : (
              <>
                {reportType === 'revenue' && (
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === 'bar' && (
                        <BarChart data={monthlyRevenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => [formatCurrency(value, 'EUR'), 'Revenu']} />
                          <Legend />
                          <Bar dataKey="revenue" name="Revenu" fill="#3b82f6" />
                        </BarChart>
                      )}
                      {chartType === 'line' && (
                        <LineChart data={monthlyRevenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => [formatCurrency(value, 'EUR'), 'Revenu']} />
                          <Legend />
                          <Line type="monotone" dataKey="revenue" name="Revenu" stroke="#3b82f6" activeDot={{ r: 8 }} />
                        </LineChart>
                      )}
                      {chartType === 'area' && (
                        <LineChart data={monthlyRevenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => [formatCurrency(value, 'EUR'), 'Revenu']} />
                          <Legend />
                          <Line type="monotone" dataKey="revenue" name="Revenu" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} activeDot={{ r: 8 }} />
                        </LineChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                )}
                
                {reportType === 'payment-methods' && (
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={paymentMethodsData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {paymentMethodsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [formatCurrency(value, 'EUR'), 'Montant']} />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                )}
                
                {reportType === 'invoice-status' && (
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={invoiceStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {invoiceStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} factures`, 'Nombre']} />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                )}
                
                {reportType === 'quarterly' && (
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={quarterlyComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [formatCurrency(value, 'EUR'), 'Revenu']} />
                        <Legend />
                        <Bar dataKey="current" name="Cette année" fill="#3b82f6" />
                        <Bar dataKey="previous" name="Année précédente" fill="#9ca3af" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;
