
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Filter, Printer, Calendar } from "lucide-react";
import { formatCurrency } from './utils/formatting';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

const mockFinancialData = [
  { mois: 'Jan', revenus: 12400, depenses: 8200, profit: 4200 },
  { mois: 'Fév', revenus: 9800, depenses: 7500, profit: 2300 },
  { mois: 'Mar', revenus: 15000, depenses: 10200, profit: 4800 },
  { mois: 'Avr', revenus: 16700, depenses: 11800, profit: 4900 },
  { mois: 'Mai', revenus: 14300, depenses: 9400, profit: 4900 },
  { mois: 'Jui', revenus: 18200, depenses: 12100, profit: 6100 },
];

const mockQuarterlyData = [
  { trimestre: 'T1', revenus: 37200, depenses: 25900, profit: 11300 },
  { trimestre: 'T2', revenus: 49200, depenses: 33300, profit: 15900 },
];

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [reportPeriod, setReportPeriod] = useState("monthly");

  const currentData = reportPeriod === 'monthly' ? mockFinancialData : mockQuarterlyData;
  const xAxisDataKey = reportPeriod === 'monthly' ? 'mois' : 'trimestre';

  const totalRevenue = currentData.reduce((sum, item) => sum + item.revenus, 0);
  const totalExpenses = currentData.reduce((sum, item) => sum + item.depenses, 0);
  const totalProfit = currentData.reduce((sum, item) => sum + item.profit, 0);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Rapports financiers</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" /> Période
          </Button>
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" /> Imprimer
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" /> Exporter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Chiffre d'affaires total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue, 'EUR')}</div>
            <p className="text-xs text-muted-foreground">
              +15% par rapport à la période précédente
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dépenses totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses, 'EUR')}</div>
            <p className="text-xs text-muted-foreground">
              +8% par rapport à la période précédente
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Bénéfice net
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalProfit, 'EUR')}</div>
            <p className="text-xs text-muted-foreground">
              +22% par rapport à la période précédente
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="revenue">Revenus</TabsTrigger>
            <TabsTrigger value="expenses">Dépenses</TabsTrigger>
            <TabsTrigger value="profit">Rentabilité</TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-2">
            <Button
              variant={reportPeriod === 'monthly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setReportPeriod('monthly')}
            >
              Mensuel
            </Button>
            <Button
              variant={reportPeriod === 'quarterly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setReportPeriod('quarterly')}
            >
              Trimestriel
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" /> Filtrer
            </Button>
          </div>
        </div>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Vue d'ensemble financière</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={currentData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={xAxisDataKey} />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number, 'EUR')} />
                    <Legend />
                    <Bar dataKey="revenus" name="Revenus" fill="#4f46e5" />
                    <Bar dataKey="depenses" name="Dépenses" fill="#ef4444" />
                    <Bar dataKey="profit" name="Profit" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Analyse des revenus</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={currentData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={xAxisDataKey} />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number, 'EUR')} />
                    <Legend />
                    <Line type="monotone" dataKey="revenus" name="Revenus" stroke="#4f46e5" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Analyse des dépenses</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={currentData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={xAxisDataKey} />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number, 'EUR')} />
                    <Legend />
                    <Line type="monotone" dataKey="depenses" name="Dépenses" stroke="#ef4444" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profit">
          <Card>
            <CardHeader>
              <CardTitle>Analyse de la rentabilité</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={currentData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={xAxisDataKey} />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number, 'EUR')} />
                    <Legend />
                    <Line type="monotone" dataKey="profit" name="Profit" stroke="#10b981" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
