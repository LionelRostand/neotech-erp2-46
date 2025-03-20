
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { formatCurrency } from './utils/formatting';
import { 
  CalendarDays, 
  FileDown, 
  FileUp, 
  Percent, 
  Download,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface TaxPeriod {
  id: string;
  year: number;
  quarter?: number;
  month?: number;
  startDate: string;
  endDate: string;
  dueDate: string;
  status: 'draft' | 'submitted' | 'paid' | 'late';
  salesTotal: number;
  taxCollected: number;
  purchasesTotal: number;
  taxDeductible: number;
  taxDue: number;
  declarationUrl?: string;
}

// Données mockées pour le prototype
const mockTaxPeriods: TaxPeriod[] = [
  {
    id: '1',
    year: 2023,
    quarter: 2,
    startDate: '2023-04-01',
    endDate: '2023-06-30',
    dueDate: '2023-07-31',
    status: 'draft',
    salesTotal: 48500,
    taxCollected: 9700,
    purchasesTotal: 15200,
    taxDeductible: 3040,
    taxDue: 6660
  },
  {
    id: '2',
    year: 2023,
    quarter: 1,
    startDate: '2023-01-01',
    endDate: '2023-03-31',
    dueDate: '2023-04-30',
    status: 'submitted',
    salesTotal: 42000,
    taxCollected: 8400,
    purchasesTotal: 13500,
    taxDeductible: 2700,
    taxDue: 5700,
    declarationUrl: '#'
  },
  {
    id: '3',
    year: 2022,
    quarter: 4,
    startDate: '2022-10-01',
    endDate: '2022-12-31',
    dueDate: '2023-01-31',
    status: 'paid',
    salesTotal: 53000,
    taxCollected: 10600,
    purchasesTotal: 18000,
    taxDeductible: 3600,
    taxDue: 7000,
    declarationUrl: '#'
  },
  {
    id: '4',
    year: 2022,
    quarter: 3,
    startDate: '2022-07-01',
    endDate: '2022-09-30',
    dueDate: '2022-10-31',
    status: 'paid',
    salesTotal: 45500,
    taxCollected: 9100,
    purchasesTotal: 16200,
    taxDeductible: 3240,
    taxDue: 5860,
    declarationUrl: '#'
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'draft':
      return <Badge variant="outline">Brouillon</Badge>;
    case 'submitted':
      return <Badge variant="secondary">Déclarée</Badge>;
    case 'paid':
      return <Badge variant="success">Payée</Badge>;
    case 'late':
      return <Badge variant="destructive">En retard</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const formatPeriodName = (period: TaxPeriod) => {
  if (period.month) {
    const monthName = new Date(period.startDate).toLocaleDateString('fr-FR', { month: 'long' });
    return `${monthName} ${period.year}`;
  } else if (period.quarter) {
    return `T${period.quarter} ${period.year}`;
  }
  return `${period.year}`;
};

const TaxesPage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<string>('2023');
  const [activePeriod, setActivePeriod] = useState<TaxPeriod>(mockTaxPeriods[0]);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Taxes & TVA</h1>
        <div className="flex items-center gap-2">
          <Select defaultValue={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Année" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2021">2021</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <FileDown className="mr-2 h-4 w-4" /> Générer la déclaration
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Solde TVA à payer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6 660,00 €</div>
            <p className="text-xs text-muted-foreground mt-1">Ce trimestre</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              TVA sur ventes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9 700,00 €</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <Percent className="h-3 w-3 mr-1" />
              <span>20% standard</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              TVA déductible
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 040,00 €</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <FileUp className="h-3 w-3 mr-1" />
              <span>Sur achats et services</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Périodes de déclaration</CardTitle>
          <CardDescription>
            Historique des déclarations de TVA par période
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Période</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Date limite</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>TVA collectée</TableHead>
                <TableHead>TVA déductible</TableHead>
                <TableHead>Solde à payer</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTaxPeriods
                .filter(period => period.year.toString() === selectedYear)
                .map((period) => (
                <TableRow 
                  key={period.id} 
                  onClick={() => setActivePeriod(period)}
                  className="cursor-pointer hover:bg-muted"
                >
                  <TableCell className="font-medium">{formatPeriodName(period)}</TableCell>
                  <TableCell>
                    {new Date(period.startDate).toLocaleDateString()} - {new Date(period.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <CalendarDays className="h-3 w-3 mr-1" />
                      {new Date(period.dueDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(period.status)}</TableCell>
                  <TableCell>{formatCurrency(period.taxCollected)}</TableCell>
                  <TableCell>{formatCurrency(period.taxDeductible)}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(period.taxDue)}</TableCell>
                  <TableCell className="text-right">
                    {period.declarationUrl && (
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {mockTaxPeriods.filter(period => period.year.toString() === selectedYear).length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                    Aucune période trouvée pour cette année
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Détails de la période : {formatPeriodName(activePeriod)}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary">
              <TabsList className="mb-4">
                <TabsTrigger value="summary">Résumé</TabsTrigger>
                <TabsTrigger value="sales">Ventes</TabsTrigger>
                <TabsTrigger value="purchases">Achats</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium mb-1">TVA collectée (ventes)</h3>
                      <div className="text-xl font-semibold">{formatCurrency(activePeriod.taxCollected)}</div>
                      <div className="text-sm text-muted-foreground">
                        Calculée sur {formatCurrency(activePeriod.salesTotal)} de ventes
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-1">TVA déductible (achats)</h3>
                      <div className="text-xl font-semibold">{formatCurrency(activePeriod.taxDeductible)}</div>
                      <div className="text-sm text-muted-foreground">
                        Calculée sur {formatCurrency(activePeriod.purchasesTotal)} d'achats
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <h3 className="text-base font-medium">Solde TVA à payer</h3>
                      <div className="text-xl font-bold">{formatCurrency(activePeriod.taxDue)}</div>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-sm text-muted-foreground">Date limite de paiement</div>
                      <div className="text-sm font-medium">{new Date(activePeriod.dueDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4">
                    <div className="flex items-center">
                      {activePeriod.status === 'draft' && (
                        <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                      )}
                      {activePeriod.status === 'submitted' && (
                        <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                      )}
                      {activePeriod.status === 'paid' && (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      )}
                      <span className="text-sm">
                        {activePeriod.status === 'draft' && "Cette déclaration est en attente de soumission"}
                        {activePeriod.status === 'submitted' && "Cette déclaration a été soumise"}
                        {activePeriod.status === 'paid' && "Cette déclaration a été payée"}
                      </span>
                    </div>
                    {(activePeriod.status === 'draft' || activePeriod.status === 'submitted') && (
                      <Button variant={activePeriod.status === 'draft' ? 'default' : 'outline'}>
                        {activePeriod.status === 'draft' ? 'Soumettre la déclaration' : 'Marquer comme payée'}
                      </Button>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="sales">
                <div className="text-muted-foreground text-center py-6">
                  Détail des ventes soumises à TVA pour cette période
                </div>
              </TabsContent>
              
              <TabsContent value="purchases">
                <div className="text-muted-foreground text-center py-6">
                  Détail des achats avec TVA déductible pour cette période
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Taux de TVA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded">
                <div className="flex justify-between items-center">
                  <div className="font-medium">Standard</div>
                  <Badge className="bg-primary">20%</Badge>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Taux normal applicable à la plupart des biens et services
                </div>
              </div>
              
              <div className="p-4 border rounded">
                <div className="flex justify-between items-center">
                  <div className="font-medium">Intermédiaire</div>
                  <Badge variant="secondary">10%</Badge>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Restauration, transport, rénovation...
                </div>
              </div>
              
              <div className="p-4 border rounded">
                <div className="flex justify-between items-center">
                  <div className="font-medium">Réduit</div>
                  <Badge variant="outline">5.5%</Badge>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Produits alimentaires, livres, médicaments...
                </div>
              </div>
              
              <Button variant="outline" className="w-full">
                Configurer les taux de TVA
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaxesPage;
