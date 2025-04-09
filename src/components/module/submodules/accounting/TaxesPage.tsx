
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTaxesCollection } from './hooks/useAccountingCollection';
import { useTaxDeclarations } from './hooks/useTaxDeclarations';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Download, PlusCircle } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import * as XLSX from 'xlsx';

const TaxesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("taux");
  const { data: taxes, isLoading: isTaxesLoading } = useTaxesCollection();
  const { declarations, isLoading: isDeclarationsLoading, reload: reloadDeclarations } = useTaxDeclarations();

  const handleExportToExcel = () => {
    let dataToExport = [];
    
    if (activeTab === "taux") {
      dataToExport = taxes.map(tax => ({
        'Nom': tax.name || 'N/A',
        'Taux (%)': tax.rate || 0,
        'Description': tax.description || '-',
        'Par défaut': tax.isDefault ? 'Oui' : 'Non',
      }));
    } else {
      dataToExport = declarations.map(declaration => ({
        'Période': declaration.period,
        'Date de déclaration': declaration.status === 'filed' ? declaration.dateFiled : `À déposer avant le ${declaration.dueDate}`,
        'Montant': declaration.status === 'filed' ? declaration.amount : declaration.estimatedAmount,
        'Statut': declaration.status === 'filed' ? 'Déposée' : 'À venir',
      }));
    }
    
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, activeTab === "taux" ? "Taux de TVA" : "Déclarations TVA");
    XLSX.writeFile(workbook, activeTab === "taux" ? "Taux_TVA.xlsx" : "Declarations_TVA.xlsx");
    
    toast.success(`Export ${activeTab === "taux" ? "des taux de TVA" : "des déclarations"} réussi`);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Taxes & TVA</h1>
          <p className="text-muted-foreground mt-2">
            Gérez vos taux de TVA et vos déclarations fiscales
          </p>
        </div>
        <Button variant="outline" onClick={handleExportToExcel}>
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
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
              {isTaxesLoading ? (
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
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Déclarations de TVA</CardTitle>
                <CardDescription>
                  Historique et planification de vos déclarations de TVA
                </CardDescription>
              </div>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Nouvelle déclaration
              </Button>
            </CardHeader>
            <CardContent>
              {isDeclarationsLoading ? (
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
                      <TableHead>Date de déclaration</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {declarations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          Aucune déclaration de TVA enregistrée
                        </TableCell>
                      </TableRow>
                    ) : (
                      declarations.map((declaration) => (
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

export default TaxesPage;
