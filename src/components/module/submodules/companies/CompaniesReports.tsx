import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { FileText, Download, Printer, BarChart, FileSpreadsheet, PieChart, Calendar, Search } from 'lucide-react';

const CompaniesReports: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('companies');
  
  const handleGenerateReport = (format: 'pdf' | 'excel') => {
    setLoading(true);
    
    // Simuler la génération d'un rapport
    setTimeout(() => {
      setLoading(false);
      toast.success(`Rapport généré avec succès au format ${format.toUpperCase()}`);
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="generator" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generator">Générateur de rapports</TabsTrigger>
          <TabsTrigger value="saved">Rapports sauvegardés</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generator" className="space-y-6 pt-4">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-medium">Générateur de rapports</h3>
              </div>
              <Separator />
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <Label>Type de rapport</Label>
                  <Select defaultValue={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un type de rapport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="companies">Liste des entreprises</SelectItem>
                      <SelectItem value="contacts">Liste des contacts</SelectItem>
                      <SelectItem value="documents">Documents des entreprises</SelectItem>
                      <SelectItem value="activity">Activité des entreprises</SelectItem>
                      <SelectItem value="stats">Statistiques globales</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="space-y-4 pt-4">
                    <Label>Période</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate" className="text-xs">Date de début</Label>
                        <Input type="date" id="startDate" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate" className="text-xs">Date de fin</Label>
                        <Input type="date" id="endDate" />
                      </div>
                    </div>
                  </div>
                  
                  {reportType === 'companies' && (
                    <div className="space-y-4 pt-4">
                      <Label>Statut des entreprises</Label>
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les statuts</SelectItem>
                          <SelectItem value="active">Actif</SelectItem>
                          <SelectItem value="inactive">Inactif</SelectItem>
                          <SelectItem value="pending">En attente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <Label>Colonnes à inclure</Label>
                  <div className="space-y-2 border rounded-md p-4 max-h-64 overflow-y-auto">
                    {reportType === 'companies' && (
                      <>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="name" defaultChecked />
                          <label htmlFor="name" className="text-sm">Nom</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="siret" defaultChecked />
                          <label htmlFor="siret" className="text-sm">SIRET</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="registrationNumber" />
                          <label htmlFor="registrationNumber" className="text-sm">N° d'enregistrement</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="status" defaultChecked />
                          <label htmlFor="status" className="text-sm">Statut</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="type" />
                          <label htmlFor="type" className="text-sm">Type</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="contactEmail" defaultChecked />
                          <label htmlFor="contactEmail" className="text-sm">Email de contact</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="contactPhone" />
                          <label htmlFor="contactPhone" className="text-sm">Téléphone de contact</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="website" />
                          <label htmlFor="website" className="text-sm">Site web</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="address" />
                          <label htmlFor="address" className="text-sm">Adresse complète</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="createdAt" defaultChecked />
                          <label htmlFor="createdAt" className="text-sm">Date de création</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="updatedAt" />
                          <label htmlFor="updatedAt" className="text-sm">Date de mise à jour</label>
                        </div>
                      </>
                    )}
                    
                    {reportType === 'contacts' && (
                      <>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="firstName" defaultChecked />
                          <label htmlFor="firstName" className="text-sm">Prénom</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="lastName" defaultChecked />
                          <label htmlFor="lastName" className="text-sm">Nom</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="companyName" defaultChecked />
                          <label htmlFor="companyName" className="text-sm">Entreprise</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="position" />
                          <label htmlFor="position" className="text-sm">Poste</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="email" defaultChecked />
                          <label htmlFor="email" className="text-sm">Email</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="phone" defaultChecked />
                          <label htmlFor="phone" className="text-sm">Téléphone</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="isMain" />
                          <label htmlFor="isMain" className="text-sm">Contact principal</label>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="space-y-2 pt-4">
                    <Label>Format du rapport</Label>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        className="flex-1" 
                        onClick={() => handleGenerateReport('pdf')}
                        disabled={loading}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Générer PDF
                      </Button>
                      <Button 
                        className="flex-1"
                        variant="outline"
                        onClick={() => handleGenerateReport('excel')}
                        disabled={loading}
                      >
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Générer Excel
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <BarChart className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Rapport d'activité</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Générez des rapports sur l'activité mensuelle ou trimestrielle des entreprises.
                  </p>
                </div>
                <Button className="w-full">
                  Générer
                </Button>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <PieChart className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Rapport statistique</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Analysez la distribution des entreprises par type, statut et localisation.
                  </p>
                </div>
                <Button className="w-full" variant="outline">
                  Générer
                </Button>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Rapport périodique</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Planifiez des rapports récurrents envoyés automatiquement par email.
                  </p>
                </div>
                <Button className="w-full" variant="outline">
                  Planifier
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="saved" className="pt-4">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-medium">Rapports sauvegardés</h3>
              </div>
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input placeholder="Rechercher un rapport..." className="flex-1" />
                  <Button variant="outline">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 text-left text-gray-600 text-xs">
                        <th className="px-4 py-3 font-medium">Nom du rapport</th>
                        <th className="px-4 py-3 font-medium">Type</th>
                        <th className="px-4 py-3 font-medium">Format</th>
                        <th className="px-4 py-3 font-medium">Date</th>
                        <th className="px-4 py-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium">Liste des entreprises - Avril 2023</td>
                        <td className="px-4 py-3 text-sm">Entreprises</td>
                        <td className="px-4 py-3 text-sm">PDF</td>
                        <td className="px-4 py-3 text-sm">23/04/2023</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex space-x-2">
                            <Button size="icon" variant="ghost">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost">
                              <Printer className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium">Contacts clients - T1 2023</td>
                        <td className="px-4 py-3 text-sm">Contacts</td>
                        <td className="px-4 py-3 text-sm">Excel</td>
                        <td className="px-4 py-3 text-sm">15/03/2023</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex space-x-2">
                            <Button size="icon" variant="ghost">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost">
                              <Printer className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium">Statistiques annuelles - 2022</td>
                        <td className="px-4 py-3 text-sm">Statistiques</td>
                        <td className="px-4 py-3 text-sm">PDF</td>
                        <td className="px-4 py-3 text-sm">10/01/2023</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex space-x-2">
                            <Button size="icon" variant="ghost">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost">
                              <Printer className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompaniesReports;
