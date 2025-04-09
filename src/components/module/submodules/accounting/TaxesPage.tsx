
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTaxesCollection } from './hooks/useAccountingCollection';
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const TaxesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("taux");
  const { data: taxes, isLoading } = useTaxesCollection();

  // Données mock pour les déclarations car probablement pas dans la collection taxes
  const declarations = [
    { id: '1', period: 'T1 2023', dateFiled: '30/04/2023', amount: 1250.50, status: 'filed' },
    { id: '2', period: 'T2 2023', dateFiled: '31/07/2023', amount: 1380.75, status: 'filed' },
    { id: '3', period: 'T3 2023', dateFiled: '31/10/2023', amount: 1420.30, status: 'filed' },
    { id: '4', period: 'T4 2023', dueDate: '31/01/2024', estimatedAmount: 1500.00, status: 'upcoming' },
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Taxes & TVA</h1>
        <p className="text-muted-foreground mt-2">
          Gérez vos taux de TVA et vos déclarations fiscales
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="taux">Taux de TVA</TabsTrigger>
          <TabsTrigger value="declarations">Déclarations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="taux">
          <Card>
            <CardHeader>
              <CardTitle>Taux de TVA</CardTitle>
              <CardDescription>
                Configuration des différents taux de TVA applicables à vos transactions
              </CardDescription>
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
                      <TableHead>Nom</TableHead>
                      <TableHead>Taux (%)</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Par défaut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taxes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          Aucun taux de TVA configuré
                        </TableCell>
                      </TableRow>
                    ) : (
                      taxes.map((tax) => (
                        <TableRow key={tax.id}>
                          <TableCell className="font-medium">{tax.name || 'N/A'}</TableCell>
                          <TableCell>{tax.rate || 0}%</TableCell>
                          <TableCell>{tax.description || '-'}</TableCell>
                          <TableCell>{tax.isDefault ? '✓' : '-'}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="declarations">
          <Card>
            <CardHeader>
              <CardTitle>Déclarations de TVA</CardTitle>
              <CardDescription>
                Historique et planification de vos déclarations de TVA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Période</TableHead>
                    <TableHead>Date de déclaration</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {declarations.map((declaration) => (
                    <TableRow key={declaration.id}>
                      <TableCell className="font-medium">{declaration.period}</TableCell>
                      <TableCell>
                        {declaration.status === 'filed' 
                          ? declaration.dateFiled 
                          : `À déposer avant le ${declaration.dueDate}`}
                      </TableCell>
                      <TableCell>
                        {declaration.status === 'filed' 
                          ? `${declaration.amount.toFixed(2)} €` 
                          : `${declaration.estimatedAmount.toFixed(2)} € (estimé)`}
                      </TableCell>
                      <TableCell>
                        {declaration.status === 'filed' 
                          ? <span className="text-green-600">Déposée</span> 
                          : <span className="text-amber-600">À venir</span>}
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

export default TaxesPage;
