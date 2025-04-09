
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, BarChart4 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TaxRate } from './types/accounting-types';

const mockTaxRates: TaxRate[] = [
  {
    id: '1',
    name: 'TVA Standard',
    rate: 20,
    description: 'Taux de TVA standard en France',
    isDefault: true
  },
  {
    id: '2',
    name: 'TVA Intermédiaire',
    rate: 10,
    description: 'Taux intermédiaire applicable aux travaux de rénovation, etc.',
    isDefault: false
  },
  {
    id: '3',
    name: 'TVA Réduit',
    rate: 5.5,
    description: 'Taux réduit applicable aux produits de première nécessité',
    isDefault: false
  },
  {
    id: '4',
    name: 'Exonéré',
    rate: 0,
    description: 'Opérations exonérées de TVA',
    isDefault: false
  }
];

const mockTaxReports = [
  {
    id: '1',
    period: '2023-T1',
    startDate: '2023-01-01',
    endDate: '2023-03-31',
    totalHT: 15000,
    totalTVA: 3000,
    status: 'submitted',
    submissionDate: '2023-04-10'
  },
  {
    id: '2',
    period: '2023-T2',
    startDate: '2023-04-01',
    endDate: '2023-06-30',
    totalHT: 18500,
    totalTVA: 3700,
    status: 'draft',
    submissionDate: null
  }
];

const TaxesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("rates");

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Taxes & TVA</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <BarChart4 className="mr-2 h-4 w-4" /> Rapport
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nouveau taux
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="rates">Taux de TVA</TabsTrigger>
          <TabsTrigger value="reports">Déclarations</TabsTrigger>
        </TabsList>

        <TabsContent value="rates">
          <Card>
            <CardHeader>
              <CardTitle>Taux de TVA configurés</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Taux (%)</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Par défaut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTaxRates.map((taxRate) => (
                    <TableRow key={taxRate.id}>
                      <TableCell className="font-medium">{taxRate.name}</TableCell>
                      <TableCell>{taxRate.rate}%</TableCell>
                      <TableCell>{taxRate.description}</TableCell>
                      <TableCell>{taxRate.isDefault ? "Oui" : "Non"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" disabled={taxRate.isDefault}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Déclarations de TVA</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Période</TableHead>
                    <TableHead>Du</TableHead>
                    <TableHead>Au</TableHead>
                    <TableHead>Total HT</TableHead>
                    <TableHead>Total TVA</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTaxReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.period}</TableCell>
                      <TableCell>{formatDate(report.startDate)}</TableCell>
                      <TableCell>{formatDate(report.endDate)}</TableCell>
                      <TableCell>{formatCurrency(report.totalHT, 'EUR')}</TableCell>
                      <TableCell>{formatCurrency(report.totalTVA, 'EUR')}</TableCell>
                      <TableCell>{getStatusLabel(report.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          {report.status === 'draft' ? 'Compléter' : 'Voir'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Fonction utilitaire pour formater les dates
const formatDate = (dateString: string | null) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString();
};

// Fonction utilitaire pour formater la monnaie
const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Fonction utilitaire pour obtenir le libellé de statut
const getStatusLabel = (status: string) => {
  switch (status) {
    case 'draft': return 'Brouillon';
    case 'submitted': return 'Soumis';
    case 'accepted': return 'Accepté';
    case 'rejected': return 'Rejeté';
    default: return status;
  }
};

export default TaxesPage;
