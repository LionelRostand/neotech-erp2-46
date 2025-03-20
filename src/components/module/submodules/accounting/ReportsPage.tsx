import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  FileText, 
  BarChart2, 
  TrendingUp, 
  CreditCard, 
  Wallet,
  Calendar
} from 'lucide-react';
import { formatCurrency } from './utils/formatting';

// Données mockées pour les graphiques
const incomeExpenseData = [
  { month: 'Jan', income: 15000, expenses: 8000 },
  { month: 'Fév', income: 18000, expenses: 9500 },
  { month: 'Mar', income: 16000, expenses: 8800 },
  { month: 'Avr', income: 20000, expenses: 10200 },
  { month: 'Mai', income: 22000, expenses: 11000 },
  { month: 'Juin', income: 19000, expenses: 9800 },
];

const profitMarginData = [
  { month: 'Jan', margin: 46.7 },
  { month: 'Fév', margin: 47.2 },
  { month: 'Mar', margin: 45.0 },
  { month: 'Avr', margin: 49.0 },
  { month: 'Mai', margin: 50.0 },
  { month: 'Juin', margin: 48.4 },
];

const expenseCategoryData = [
  { name: 'Achats', value: 35000 },
  { name: 'Loyer', value: 18000 },
  { name: 'Salaires', value: 45000 },
  { name: 'Marketing', value: 12000 },
  { name: 'Utilities', value: 6000 },
  { name: 'Autres', value: 8000 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

interface ReportConfig {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  format: 'pdf' | 'excel';
}

const reportsList: ReportConfig[] = [
  {
    id: 'balance-sheet',
    name: 'Bilan comptable',
    description: 'État de la situation financière, actifs et passifs',
    icon: <FileText className="h-5 w-5" />,
    format: 'pdf'
  },
  {
    id: 'income-statement',
    name: 'Compte de résultat',
    description: 'Revenus, dépenses et résultats sur une période',
    icon: <BarChart2 className="h-5 w-5" />,
    format: 'pdf'
  },
  {
    id: 'cash-flow',
    name: 'Flux de trésorerie',
    description: 'Entrées et sorties de trésorerie',
    icon: <TrendingUp className="h-5 w-5" />,
    format: 'pdf'
  },
  {
    id: 'sales-report',
    name: 'Rapport des ventes',
    description: 'Analyse détaillée des ventes par client, produit',
    icon: <CreditCard className="h-5 w-5" />,
    format: 'excel'
  },
  {
    id: 'expense-report',
    name: 'Rapport des dépenses',
    description: 'Analyse des dépenses par catégorie',
    icon: <Wallet className="h-5 w-5" />,
    format: 'excel'
  },
  {
    id: 'tax-report',
    name: 'Rapport de TVA',
    description: 'Récapitulatif de la TVA collectée et déductible',
    icon: <FileText className="h-5 w-5" />,
    format: 'pdf'
  }
];

const ReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('this-quarter');
  const [comparePeriod, setComparePeriod] = useState<string>('last-year');
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Rapports financiers</h1>
        <div className="flex items-center gap-2">
          <Select defaultValue={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">Ce mois</SelectItem>
              <SelectItem value="this-quarter">Ce trimestre</SelectItem>
              <SelectItem value="this-year">Cette année</SelectItem>
              <SelectItem value="last-year">Année précédente</SelectItem>
              <SelectItem value="custom">Période personnalisée</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue={comparePeriod} onValueChange={setComparePeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Comparer avec" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="previous-period">Période précédente</SelectItem>
              <SelectItem value="last-year">Même période année précédente</SelectItem>
              <SelectItem value="none">Aucune comparaison</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance financière</CardTitle>
            <CardDescription>Revenus et dépenses pour {selectedPeriod === 'this-quarter' ? 'ce trimestre' : selectedPeriod === 'this-month' ? 'ce mois' : 'cette année'}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-80" config={{}}>
              <BarChart data={incomeExpenseData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis 
                  tickFormatter={(value) => `${Math.round(value / 1000)}k€`}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-md shadow-sm p-2 text-sm">
                          <p className="font-semibold">{payload[0].payload.month}</p>
                          <p className="text-blue-600">
                            Revenus: {Number(payload[0].value)?.toLocaleString()} €
                          </p>
                          <p className="text-red-600">
                            Dépenses: {Number(payload[1].value)?.toLocaleString()} €
                          </p>
                          <p className="font-medium pt-1 border-t mt-1">
                            Marge: {(Number(payload[0].value) - Number(payload[1].value)).toLocaleString()} €
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="income" 
                  name="Revenus" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="expenses" 
                  name="Dépenses" 
                  fill="#ef4444" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Marge bénéficiaire</CardTitle>
            <CardDescription>Évolution mensuelle (%)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-60" config={{}}>
              <LineChart data={profitMarginData}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis dataKey="month" />
                <YAxis 
                  domain={[40, 55]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-md shadow-sm p-2 text-sm">
                          <p className="font-semibold">{payload[0].payload.month}</p>
                          <p className="text-emerald-600 font-medium">
                            {typeof payload[0].value === 'number' ? payload[0].value.toFixed(1) : '0'}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="margin" 
                  name="Marge (%)" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
            
            <div className="mt-4 text-center">
              <div className="text-lg font-bold">47.7%</div>
              <div className="text-sm text-muted-foreground">Marge moyenne</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Répartition des dépenses</CardTitle>
            <CardDescription>Par catégorie</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-64" config={{}}>
              <PieChart>
                <Pie
                  data={expenseCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {expenseCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-md shadow-sm p-2 text-sm">
                          <p className="font-semibold">{payload[0].name}</p>
                          <p className="font-medium">{formatCurrency(Number(payload[0].value))}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Générer des rapports</CardTitle>
            <CardDescription>
              Rapports financiers disponibles pour exportation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportsList.map((report) => (
                <div 
                  key={report.id} 
                  className="p-4 border rounded flex items-start space-x-4 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="p-2 bg-primary/10 rounded text-primary">
                    {report.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{report.name}</h3>
                      <Badge variant={report.format === 'pdf' ? 'default' : 'secondary'}>
                        {report.format.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Download className="h-3.5 w-3.5 mr-1" /> Télécharger
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Comparaison par période</CardTitle>
          <CardDescription>
            Ce {selectedPeriod === 'this-quarter' ? 'trimestre' : selectedPeriod === 'this-month' ? 'mois' : 'année'} vs {comparePeriod === 'last-year' ? 'même période année précédente' : 'période précédente'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Revenus</h3>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold mr-2">110 000 €</span>
                <Badge className="bg-green-500">+12.5%</Badge>
              </div>
              <div className="text-sm text-muted-foreground mt-1">98 000 € période précédente</div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Dépenses</h3>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold mr-2">57 300 €</span>
                <Badge className="bg-amber-500">+8.2%</Badge>
              </div>
              <div className="text-sm text-muted-foreground mt-1">53 000 € période précédente</div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Résultat net</h3>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold mr-2">52 700 €</span>
                <Badge className="bg-green-500">+17.1%</Badge>
              </div>
              <div className="text-sm text-muted-foreground mt-1">45 000 € période précédente</div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-between">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" /> Période personnalisée
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" /> Exporter la comparaison
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;
