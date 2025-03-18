
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Search, Plus, Download, FileText, DollarSign, Printer, BarChart, Filter, ChevronUp, ChevronDown } from 'lucide-react';

const EmployeesSalaries: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Sample salaries data
  const salaries = [
    { 
      id: 1, 
      employee: 'Thomas Martin', 
      position: 'Responsable Marketing',
      department: 'Marketing',
      baseSalary: 4200,
      bonus: 450,
      benefits: 250,
      totalMonthly: 4900,
      totalAnnual: 58800,
      lastReview: '2024-12-10',
      nextReview: '2025-06-10'
    },
    { 
      id: 2, 
      employee: 'Sophie Dubois', 
      position: 'Développeuse Front-end',
      department: 'Développement',
      baseSalary: 3800,
      bonus: 400,
      benefits: 200,
      totalMonthly: 4400,
      totalAnnual: 52800,
      lastReview: '2024-11-15',
      nextReview: '2025-05-15'
    },
    { 
      id: 3, 
      employee: 'Jean Dupont', 
      position: 'Directeur Financier',
      department: 'Finance',
      baseSalary: 5500,
      bonus: 800,
      benefits: 300,
      totalMonthly: 6600,
      totalAnnual: 79200,
      lastReview: '2024-10-20',
      nextReview: '2025-04-20'
    },
    { 
      id: 4, 
      employee: 'Marie Lambert', 
      position: 'Responsable RH',
      department: 'Ressources Humaines',
      baseSalary: 4800,
      bonus: 500,
      benefits: 250,
      totalMonthly: 5550,
      totalAnnual: 66600,
      lastReview: '2024-12-05',
      nextReview: '2025-06-05'
    },
    { 
      id: 5, 
      employee: 'Pierre Durand', 
      position: 'Chef de projet technique',
      department: 'Développement',
      baseSalary: 4500,
      bonus: 500,
      benefits: 250,
      totalMonthly: 5250,
      totalAnnual: 63000,
      lastReview: '2024-11-25',
      nextReview: '2025-05-25'
    }
  ];
  
  // Sample payroll months
  const payrollMonths = [
    { month: 'Janvier 2025', status: 'En préparation', date: '2025-01-25' },
    { month: 'Décembre 2024', status: 'Complété', date: '2024-12-23' },
    { month: 'Novembre 2024', status: 'Complété', date: '2024-11-24' },
    { month: 'Octobre 2024', status: 'Complété', date: '2024-10-25' },
    { month: 'Septembre 2024', status: 'Complété', date: '2024-09-25' },
  ];
  
  // Filter salaries based on search query
  const filteredSalaries = salaries.filter(
    salary => 
      salary.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      salary.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      salary.department.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort salaries
  const sortedSalaries = [...filteredSalaries].sort((a, b) => {
    let comparison = 0;
    
    if (sortColumn === 'employee') {
      comparison = a.employee.localeCompare(b.employee);
    } else if (sortColumn === 'department') {
      comparison = a.department.localeCompare(b.department);
    } else if (sortColumn === 'base') {
      comparison = a.baseSalary - b.baseSalary;
    } else if (sortColumn === 'total') {
      comparison = a.totalMonthly - b.totalMonthly;
    } else if (sortColumn === 'annual') {
      comparison = a.totalAnnual - b.totalAnnual;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
  // Toggle sort
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  
  // Sort indicator
  const SortIndicator = ({ column }: { column: string }) => {
    if (sortColumn !== column) return null;
    
    return sortDirection === 'asc' 
      ? <ChevronUp className="inline h-4 w-4 ml-1" /> 
      : <ChevronDown className="inline h-4 w-4 ml-1" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Salaires</h2>
        
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtres
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Filtres avancés</DialogTitle>
                <DialogDescription>
                  Filtrer la liste des salaires selon différents critères.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Département</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les départements" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les départements</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="development">Développement</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="hr">Ressources Humaines</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fourchette de salaire</label>
                  <div className="flex items-center space-x-2">
                    <Input type="number" placeholder="Min" className="w-1/2" />
                    <span>-</span>
                    <Input type="number" placeholder="Max" className="w-1/2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date de révision</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les dates" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les dates</SelectItem>
                      <SelectItem value="past">Révisions passées</SelectItem>
                      <SelectItem value="upcoming">Révisions à venir</SelectItem>
                      <SelectItem value="month1">Prochain mois</SelectItem>
                      <SelectItem value="month3">3 prochains mois</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Réinitialiser</Button>
                <Button type="submit">Appliquer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Ajouter ou modifier un salaire</DialogTitle>
                <DialogDescription>
                  Définir ou mettre à jour les informations de rémunération d'un employé.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="employee" className="text-sm font-medium">Employé *</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un employé" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="thomas">Thomas Martin</SelectItem>
                        <SelectItem value="sophie">Sophie Dubois</SelectItem>
                        <SelectItem value="jean">Jean Dupont</SelectItem>
                        <SelectItem value="marie">Marie Lambert</SelectItem>
                        <SelectItem value="pierre">Pierre Durand</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="department" className="text-sm font-medium">Département</label>
                    <Input id="department" value="Marketing" disabled />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="baseSalary" className="text-sm font-medium">Salaire de base *</label>
                    <Input id="baseSalary" type="number" placeholder="Ex: 4200" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="currency" className="text-sm font-medium">Devise</label>
                    <Select defaultValue="eur">
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une devise" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eur">EUR (€)</SelectItem>
                        <SelectItem value="usd">USD ($)</SelectItem>
                        <SelectItem value="gbp">GBP (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="bonus" className="text-sm font-medium">Prime mensuelle</label>
                    <Input id="bonus" type="number" placeholder="Ex: 450" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="benefits" className="text-sm font-medium">Avantages</label>
                    <Input id="benefits" type="number" placeholder="Ex: 250" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="startDate" className="text-sm font-medium">Date d'effet *</label>
                    <Input id="startDate" type="date" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="nextReview" className="text-sm font-medium">Prochaine révision</label>
                    <Input id="nextReview" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium">Notes</label>
                  <textarea 
                    id="notes" 
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    rows={3}
                    placeholder="Notes concernant la rémunération..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Annuler</Button>
                <Button type="submit">Enregistrer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs defaultValue="salaries">
        <TabsList className="mb-4">
          <TabsTrigger value="salaries">Salaires</TabsTrigger>
          <TabsTrigger value="payroll">Paie</TabsTrigger>
          <TabsTrigger value="analysis">Analyse</TabsTrigger>
        </TabsList>
        
        <TabsContent value="salaries" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Liste des salaires</h3>
                
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Rechercher..."
                    className="w-[250px] pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('employee')}>
                        Employé <SortIndicator column="employee" />
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('department')}>
                        Département <SortIndicator column="department" />
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('base')}>
                        Salaire de base <SortIndicator column="base" />
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('total')}>
                        Total mensuel <SortIndicator column="total" />
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('annual')}>
                        Total annuel <SortIndicator column="annual" />
                      </TableHead>
                      <TableHead>Dernière révision</TableHead>
                      <TableHead>Prochaine révision</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedSalaries.length > 0 ? (
                      sortedSalaries.map((salary) => (
                        <TableRow key={salary.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarFallback>
                                  {salary.employee.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              {salary.employee}
                            </div>
                          </TableCell>
                          <TableCell>{salary.department}</TableCell>
                          <TableCell>{salary.baseSalary.toLocaleString('fr-FR')} €</TableCell>
                          <TableCell>{salary.totalMonthly.toLocaleString('fr-FR')} €</TableCell>
                          <TableCell>{salary.totalAnnual.toLocaleString('fr-FR')} €</TableCell>
                          <TableCell>{new Date(salary.lastReview).toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell>{new Date(salary.nextReview).toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Modifier</Button>
                            <Button variant="ghost" size="sm">Historique</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          Aucun salaire trouvé
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payroll" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-md font-medium">Préparation de la paie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mois</TableHead>
                        <TableHead>Date de paiement</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payrollMonths.map((payroll, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{payroll.month}</TableCell>
                          <TableCell>{new Date(payroll.date).toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              payroll.status === 'Complété' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-amber-100 text-amber-800'
                            }>
                              {payroll.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {payroll.status === 'En préparation' ? (
                              <>
                                <Button variant="ghost" size="sm">Préparer</Button>
                                <Button variant="ghost" size="sm">Simuler</Button>
                              </>
                            ) : (
                              <>
                                <Button variant="ghost" size="sm">
                                  <FileText className="h-4 w-4 mr-1" />
                                  Fiches
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4 mr-1" />
                                  Exporter
                                </Button>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-md font-medium">Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimer les fiches de paie
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="mr-2 h-4 w-4" />
                    Exporter les données
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Gestion des variables
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart className="mr-2 h-4 w-4" />
                    Rapport de paie
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-md font-medium">Récapitulatif de la paie - Janvier 2025</CardTitle>
              <CardDescription>Préparation en cours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="border rounded-md p-4">
                  <div className="text-sm text-muted-foreground">Salaires bruts</div>
                  <div className="text-xl font-bold mt-1">26 500,00 €</div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="text-sm text-muted-foreground">Charges patronales</div>
                  <div className="text-xl font-bold mt-1">10 600,00 €</div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="text-sm text-muted-foreground">Charges salariales</div>
                  <div className="text-xl font-bold mt-1">5 300,00 €</div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="text-sm text-muted-foreground">Coût total</div>
                  <div className="text-xl font-bold mt-1">37 100,00 €</div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium text-sm mb-3">Progression</h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Préparation de la paie</span>
                    <span>65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Masse salariale mensuelle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">26 700 €</div>
                <div className="flex items-center text-xs mt-1">
                  <span className="text-green-500 font-medium">+3.2%</span>
                  <span className="text-muted-foreground ml-1">vs le mois dernier</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Masse salariale annuelle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">320 400 €</div>
                <div className="flex items-center text-xs mt-1">
                  <span className="text-green-500 font-medium">+5.8%</span>
                  <span className="text-muted-foreground ml-1">vs l'année dernière</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Salaire moyen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4 530 €</div>
                <div className="flex items-center text-xs mt-1">
                  <span className="text-green-500 font-medium">+2.1%</span>
                  <span className="text-muted-foreground ml-1">vs le mois dernier</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Part des primes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12.3%</div>
                <div className="flex items-center text-xs mt-1">
                  <span className="text-muted-foreground">de la masse salariale</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-md font-medium">Évolution mensuelle</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <BarChart className="h-16 w-16 mx-auto mb-3 text-gray-300" />
                  <p>Graphique d'évolution de la masse salariale</p>
                  <p className="text-sm">Des données sur 12 mois seraient affichées ici</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-md font-medium">Répartition par département</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <DollarSign className="h-16 w-16 mx-auto mb-3 text-gray-300" />
                  <p>Graphique de répartition des salaires</p>
                  <p className="text-sm">Répartition par département serait affichée ici</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-md font-medium">Comparaison salariale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Développement</span>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        2 employés
                      </Badge>
                    </div>
                    <span className="font-medium">4 150 € (moyenne)</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Min: 3 800 €</span>
                    <span>Max: 4 500 €</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Finance</span>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        1 employé
                      </Badge>
                    </div>
                    <span className="font-medium">5 500 € (moyenne)</span>
                  </div>
                  <Progress value={100} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Min: 5 500 €</span>
                    <span>Max: 5 500 €</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Marketing</span>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        1 employé
                      </Badge>
                    </div>
                    <span className="font-medium">4 200 € (moyenne)</span>
                  </div>
                  <Progress value={76} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Min: 4 200 €</span>
                    <span>Max: 4 200 €</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Ressources Humaines</span>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        1 employé
                      </Badge>
                    </div>
                    <span className="font-medium">4 800 € (moyenne)</span>
                  </div>
                  <Progress value={87} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Min: 4 800 €</span>
                    <span>Max: 4 800 €</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeesSalaries;
