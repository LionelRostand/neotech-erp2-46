
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/StatCard";
import { TrendingUp, Users, DollarSign, CheckCircle, Award } from "lucide-react";

const CrmAnalytics: React.FC = () => {
  const [period, setPeriod] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  const conversionData = [
    { name: 'Janvier', prospects: 120, clients: 20, taux: 16.7 },
    { name: 'Février', prospects: 150, clients: 30, taux: 20 },
    { name: 'Mars', prospects: 180, clients: 45, taux: 25 },
    { name: 'Avril', prospects: 210, clients: 55, taux: 26.2 },
    { name: 'Mai', prospects: 190, clients: 60, taux: 31.6 },
    { name: 'Juin', prospects: 230, clients: 75, taux: 32.6 },
  ];

  const salesData = [
    { name: 'Jean Dupont', deals: 12, amount: 65000, region: 'Paris' },
    { name: 'Marie Martin', deals: 8, amount: 48000, region: 'Lyon' },
    { name: 'Thomas Bernard', deals: 15, amount: 72000, region: 'Marseille' },
    { name: 'Sophie Petit', deals: 10, amount: 53000, region: 'Bordeaux' },
    { name: 'Philippe Durand', deals: 7, amount: 42000, region: 'Lille' },
  ];

  const lostOpportunityReasons = [
    { name: 'Prix trop élevé', value: 35 },
    { name: 'Concurrent', value: 25 },
    { name: 'Pas de besoin', value: 15 },
    { name: 'Budget', value: 18 },
    { name: 'Autre', value: 7 },
  ];

  const productRevenueData = [
    { name: 'Solution CRM', revenue: 120000 },
    { name: 'ERP', revenue: 80000 },
    { name: 'Site e-commerce', revenue: 65000 },
    { name: 'Maintenance', revenue: 45000 },
    { name: 'Formation', revenue: 30000 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Analytiques</h2>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sélectionner une période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Taux de conversion"
          value="24.8%"
          icon={<TrendingUp className="h-8 w-8 text-blue-500" />}
          description="Prospects → Clients"
        />
        <StatCard
          title="Prospects qualifiés"
          value="215"
          icon={<Users className="h-8 w-8 text-orange-500" />}
          description="Ce mois"
        />
        <StatCard
          title="Chiffre d'affaires"
          value="280 000 €"
          icon={<DollarSign className="h-8 w-8 text-emerald-500" />}
          description="Ce trimestre"
        />
        <StatCard
          title="Opportunités gagnées"
          value="42"
          icon={<CheckCircle className="h-8 w-8 text-purple-500" />}
          description="Ce trimestre"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="sales">Performance commerciale</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
          <TabsTrigger value="products">Produits</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance des commerciaux</CardTitle>
                <CardDescription>Chiffre d'affaires par commercial</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer 
                    config={{
                      amount: { theme: { dark: '#4f46e5', light: '#4f46e5' } }
                    }}
                  >
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="amount" name="Montant (€)" fill="var(--color-amount)" />
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Raisons d'opportunités perdues</CardTitle>
                <CardDescription>Pourcentage par motif</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={lostOpportunityReasons}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {lostOpportunityReasons.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Pourcentage']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Taux de conversion dans le temps</CardTitle>
                <CardDescription>Évolution du taux de conversion prospects → clients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer 
                    config={{
                      prospects: { theme: { dark: '#3b82f6', light: '#3b82f6' } },
                      clients: { theme: { dark: '#10b981', light: '#10b981' } },
                      taux: { theme: { dark: '#f59e0b', light: '#f59e0b' } }
                    }}
                  >
                    <LineChart data={conversionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="prospects" name="Prospects" stroke="var(--color-prospects)" />
                      <Line yAxisId="left" type="monotone" dataKey="clients" name="Clients" stroke="var(--color-clients)" />
                      <Line yAxisId="right" type="monotone" dataKey="taux" name="Taux (%)" stroke="var(--color-taux)" />
                    </LineChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Performance détaillée des commerciaux</CardTitle>
              <CardDescription>Par nombre de deals et montant</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Detailed sales performance content */}
              <div className="h-96">
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="p-3 text-left font-medium">Commercial</th>
                        <th className="p-3 text-left font-medium">Région</th>
                        <th className="p-3 text-right font-medium">Opportunités gagnées</th>
                        <th className="p-3 text-right font-medium">Montant</th>
                        <th className="p-3 text-right font-medium">Taux de réussite</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesData.map((seller, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-3 flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 font-medium">
                              {seller.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            {seller.name}
                          </td>
                          <td className="p-3">{seller.region}</td>
                          <td className="p-3 text-right">{seller.deals}</td>
                          <td className="p-3 text-right font-medium">{seller.amount.toLocaleString('fr-FR')} €</td>
                          <td className="p-3 text-right">
                            <span className="inline-block bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs">
                              {Math.round(65 + Math.random() * 20)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversion">
          {/* Conversion analysis content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Entonnoir de conversion</CardTitle>
                <CardDescription>Du prospect à la vente</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={[
                      { name: 'Leads', value: 400 },
                      { name: 'Prospects qualifiés', value: 280 },
                      { name: 'Opportunités', value: 150 },
                      { name: 'Négociations', value: 90 },
                      { name: 'Clients', value: 65 },
                    ]}
                    margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sources de prospects</CardTitle>
                <CardDescription>Répartition par origine</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Site web', value: 35 },
                        { name: 'Réseaux sociaux', value: 25 },
                        { name: 'Recommandations', value: 18 },
                        { name: 'Salons', value: 12 },
                        { name: 'Partenaires', value: 10 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {lostOpportunityReasons.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Revenus par produit / service</CardTitle>
              <CardDescription>Chiffre d'affaires généré par offre</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ChartContainer 
                  config={{
                    revenue: { theme: { dark: '#8b5cf6', light: '#8b5cf6' } }
                  }}
                >
                  <BarChart data={productRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="revenue" name="Revenu (€)" fill="var(--color-revenue)" />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CrmAnalytics;
