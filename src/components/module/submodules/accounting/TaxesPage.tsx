
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, BarChart4 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useTaxRatesData } from './hooks/useTaxRatesData';
import { useTaxDeclarationsData } from './hooks/useTaxDeclarationsData';
import { formatCurrency, formatDate } from './utils/formatting';

const TaxesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("rates");
  
  // Récupération des données de taux de TVA
  const { taxRates, isLoading: taxRatesLoading } = useTaxRatesData();
  
  // Récupération des données de déclarations de TVA
  const { taxDeclarations, isLoading: taxDeclarationsLoading } = useTaxDeclarationsData();

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
              {taxRatesLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
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
                    {taxRates.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          Aucun taux de TVA trouvé
                        </TableCell>
                      </TableRow>
                    ) : (
                      taxRates.map((taxRate) => (
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
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Déclarations de TVA</CardTitle>
            </CardHeader>
            <CardContent>
              {taxDeclarationsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Période</TableHead>
                      <TableHead>Date limite</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taxDeclarations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          Aucune déclaration de TVA trouvée
                        </TableCell>
                      </TableRow>
                    ) : (
                      taxDeclarations.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.period}</TableCell>
                          <TableCell>{formatDate(report.dueDate)}</TableCell>
                          <TableCell>{formatCurrency(report.amount, 'EUR')}</TableCell>
                          <TableCell>{getStatusLabel(report.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              {report.status === 'upcoming' ? 'Préparer' : 'Voir'}
                            </Button>
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
      </Tabs>
    </div>
  );
};

// Fonction utilitaire pour obtenir le libellé de statut
const getStatusLabel = (status: string) => {
  switch (status) {
    case 'upcoming': return 'À venir';
    case 'filed': return 'Soumis';
    case 'paid': return 'Payé';
    case 'late': return 'En retard';
    default: return status;
  }
};

export default TaxesPage;
