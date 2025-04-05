
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, FileInput, FileOutput, FileText, RefreshCw, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { exportToExcel } from '@/utils/exportUtils';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

// Données fictives pour l'interface
const mockDataStats = {
  clients: 127,
  prospects: 86,
  opportunities: 53,
  contacts: 214,
  lastImport: "2025-02-15T14:30:00",
  lastExport: "2025-04-01T09:15:00",
};

// Types de données pour l'export
type ExportType = 'clients' | 'prospects' | 'opportunities' | 'contacts' | 'all';

const DataTab: React.FC = () => {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isDataCleanupOpen, setIsDataCleanupOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [exportType, setExportType] = useState<ExportType>('all');
  
  // Gestion de l'import de fichier
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleImport = () => {
    if (!selectedFile) {
      toast.error("Veuillez sélectionner un fichier à importer");
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulation d'un upload avec progression
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setIsImportDialogOpen(false);
            setSelectedFile(null);
            toast.success("Données importées avec succès");
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };
  
  // Gestion de l'export de données
  const handleExport = () => {
    // Données fictives pour l'export
    const mockDataForExport = [
      { id: 1, name: "Entreprise A", email: "contact@entreprisea.com", type: "Client", created: "2025-01-10" },
      { id: 2, name: "Entreprise B", email: "contact@entrepriseb.com", type: "Prospect", created: "2025-02-15" },
      { id: 3, name: "Entreprise C", email: "contact@entreprisec.com", type: "Client", created: "2025-03-02" },
    ];
    
    const fileName = `crm-export-${exportType}-${new Date().toISOString().split('T')[0]}`;
    const result = exportToExcel(mockDataForExport, exportType, fileName);
    
    if (result) {
      toast.success(`Données ${exportType} exportées avec succès`);
    } else {
      toast.error("Erreur lors de l'export des données");
    }
    
    setIsExportDialogOpen(false);
  };
  
  // Statistiques des données
  const DataStatsCard = () => (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-base font-medium mb-4">Statistiques des données</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{mockDataStats.clients}</div>
            <div className="text-sm text-muted-foreground">Clients</div>
          </div>
          
          <div className="border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{mockDataStats.prospects}</div>
            <div className="text-sm text-muted-foreground">Prospects</div>
          </div>
          
          <div className="border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{mockDataStats.opportunities}</div>
            <div className="text-sm text-muted-foreground">Opportunités</div>
          </div>
          
          <div className="border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{mockDataStats.contacts}</div>
            <div className="text-sm text-muted-foreground">Contacts</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Dernier import</div>
            <div className="font-medium">
              {new Date(mockDataStats.lastImport).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Dernier export</div>
            <div className="font-medium">
              {new Date(mockDataStats.lastExport).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Database className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium">Gestion des données</h3>
        </div>
      </div>
      
      <DataStatsCard />
      
      <Tabs defaultValue="import-export">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="import-export">Import / Export</TabsTrigger>
          <TabsTrigger value="data-cleanup">Nettoyage des données</TabsTrigger>
        </TabsList>
        
        <TabsContent value="import-export" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center space-x-2 mb-2">
                  <FileInput className="h-5 w-5 text-blue-600" />
                  <h4 className="font-medium">Import de données</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Importez des clients, prospects ou opportunités depuis un fichier CSV ou Excel.
                </p>
                <Button 
                  className="mt-auto" 
                  onClick={() => setIsImportDialogOpen(true)}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Importer des données
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center space-x-2 mb-2">
                  <FileOutput className="h-5 w-5 text-blue-600" />
                  <h4 className="font-medium">Export de données</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Exportez vos données CRM dans différents formats pour les utiliser dans d'autres applications.
                </p>
                <Button 
                  className="mt-auto" 
                  onClick={() => setIsExportDialogOpen(true)}
                >
                  <FileOutput className="mr-2 h-4 w-4" />
                  Exporter des données
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <RefreshCw className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium">Historique des imports/exports</h4>
              </div>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <FileInput className="h-4 w-4" />
                    <div className="font-medium">Import de clients</div>
                    <div className="ml-auto text-sm text-muted-foreground">
                      15 février 2025, 14:30
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    42 clients importés
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <FileOutput className="h-4 w-4" />
                    <div className="font-medium">Export complet</div>
                    <div className="ml-auto text-sm text-muted-foreground">
                      1 avril 2025, 09:15
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    235 enregistrements exportés
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <FileInput className="h-4 w-4" />
                    <div className="font-medium">Import de prospects</div>
                    <div className="ml-auto text-sm text-muted-foreground">
                      12 janvier 2025, 10:45
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    28 prospects importés
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data-cleanup" className="space-y-4 pt-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Trash2 className="h-5 w-5 text-destructive" />
                <h4 className="font-medium">Nettoyage des données</h4>
              </div>
              
              <p className="text-sm text-muted-foreground mb-6">
                Supprimez les données obsolètes ou en double pour maintenir votre CRM propre et efficace.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full">
                      Doublons
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Gestion des doublons</SheetTitle>
                      <SheetDescription>
                        Détectez et fusionnez les contacts ou entreprises en double dans votre CRM.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="py-4">
                      <div className="border rounded-lg p-4 mb-3">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium">Entreprise ABC</div>
                          <Button size="sm" variant="outline">Fusionner</Button>
                        </div>
                        <div className="text-sm text-muted-foreground">2 enregistrements similaires</div>
                      </div>
                      
                      <div className="border rounded-lg p-4 mb-3">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium">Jean Dupont</div>
                          <Button size="sm" variant="outline">Fusionner</Button>
                        </div>
                        <div className="text-sm text-muted-foreground">3 enregistrements similaires</div>
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button>Analyser les doublons</Button>
                    </div>
                  </SheetContent>
                </Sheet>
                
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full">
                      Données obsolètes
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Données obsolètes</SheetTitle>
                      <SheetDescription>
                        Identifiez et supprimez les données qui n'ont pas été mises à jour depuis longtemps.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="py-4">
                      <div className="mb-4">
                        <Label className="mb-2 block">Période d'inactivité</Label>
                        <select className="w-full border rounded-md p-2">
                          <option value="6">Plus de 6 mois</option>
                          <option value="12">Plus de 12 mois</option>
                          <option value="24">Plus de 2 ans</option>
                        </select>
                      </div>
                      
                      <div className="border rounded-lg p-4 mb-3">
                        <div className="font-medium mb-1">Prospects inactifs</div>
                        <div className="text-sm text-muted-foreground">23 prospects sans activité</div>
                      </div>
                      
                      <div className="border rounded-lg p-4 mb-3">
                        <div className="font-medium mb-1">Opportunités abandonnées</div>
                        <div className="text-sm text-muted-foreground">12 opportunités sans suivi</div>
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Nettoyer les données
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setIsDataCleanupOpen(true)}
                >
                  Optimisation de la base
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium">Qualité des données</h4>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Clients</span>
                    <span className="text-sm text-muted-foreground">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Prospects</span>
                    <span className="text-sm text-muted-foreground">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Opportunités</span>
                    <span className="text-sm text-muted-foreground">86%</span>
                  </div>
                  <Progress value={86} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Contacts</span>
                    <span className="text-sm text-muted-foreground">65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
              </div>
              
              <div className="mt-6">
                <Button variant="outline" className="w-full">
                  Améliorer la qualité des données
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialog d'import de données */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Importer des données</DialogTitle>
            <DialogDescription>
              Importez des données clients, prospects ou opportunités à partir d'un fichier CSV ou Excel.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="import-type">Type de données</Label>
              <select 
                id="import-type" 
                className="w-full border rounded-md p-2"
              >
                <option value="clients">Clients</option>
                <option value="prospects">Prospects</option>
                <option value="opportunities">Opportunités</option>
                <option value="contacts">Contacts</option>
              </select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="file-upload">Fichier</Label>
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                {selectedFile ? (
                  <div className="text-sm">{selectedFile.name}</div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Glissez-déposez un fichier ici ou cliquez pour parcourir
                  </div>
                )}
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                />
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Parcourir
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Formats acceptés: .csv, .xlsx, .xls
              </p>
            </div>
            
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Progression</span>
                  <span className="text-sm">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsImportDialogOpen(false)}
              disabled={isUploading}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleImport} 
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Importation...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Importer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog d'export de données */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Exporter des données</DialogTitle>
            <DialogDescription>
              Sélectionnez le type de données que vous souhaitez exporter.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="export-type">Type de données</Label>
              <select 
                id="export-type" 
                className="w-full border rounded-md p-2"
                value={exportType}
                onChange={(e) => setExportType(e.target.value as ExportType)}
              >
                <option value="all">Toutes les données</option>
                <option value="clients">Clients</option>
                <option value="prospects">Prospects</option>
                <option value="opportunities">Opportunités</option>
                <option value="contacts">Contacts</option>
              </select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="export-format">Format</Label>
              <select 
                id="export-format" 
                className="w-full border rounded-md p-2"
              >
                <option value="xlsx">Excel (.xlsx)</option>
                <option value="csv">CSV (.csv)</option>
                <option value="pdf">PDF (.pdf)</option>
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsExportDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleExport}>
              <FileOutput className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Fenêtre de dialogue pour l'optimisation de la base */}
      <Dialog open={isDataCleanupOpen} onOpenChange={setIsDataCleanupOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Optimisation de la base de données</DialogTitle>
            <DialogDescription>
              Optimisez votre base de données CRM pour améliorer les performances.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="border rounded-lg p-4">
              <div className="font-medium mb-1">Dernière optimisation</div>
              <div className="text-sm text-muted-foreground">Il y a 32 jours</div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="font-medium mb-1">Taille actuelle de la base</div>
              <div className="text-sm text-muted-foreground">14.8 Mo</div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="font-medium mb-1">Gain potentiel</div>
              <div className="text-sm text-muted-foreground">Environ 2.3 Mo (15.5%)</div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDataCleanupOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={() => {
              toast.success("Base de données optimisée avec succès");
              setIsDataCleanupOpen(false);
            }}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Optimiser
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataTab;
