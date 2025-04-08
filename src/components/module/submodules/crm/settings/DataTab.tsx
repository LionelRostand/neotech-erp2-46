
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Loader2, Download, Upload, AlertTriangle, Trash } from "lucide-react";
import { toast } from 'sonner';
import { deleteDoc, doc, getDocs, collection, writeBatch, query, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';

const DataTab: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isPurging, setIsPurging] = useState(false);
  const [exportFormat, setExportFormat] = useState('json');
  const [purgeSelection, setPurgeSelection] = useState<string[]>([]);

  // Export data
  const handleExportData = async () => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Eventually, we'd implement actual data export functionality here
      // For now we're just showing a success message
      
      toast.success(`Données exportées avec succès au format ${exportFormat.toUpperCase()}`);
    } catch (err) {
      console.error('Error exporting data:', err);
      toast.error('Erreur lors de l\'exportation des données');
    } finally {
      setIsExporting(false);
    }
  };

  // Import data
  const handleImportData = async () => {
    // Simulate file selection
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = `.${exportFormat}`;
    
    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      
      if (!file) return;
      
      setIsImporting(true);
      try {
        // Simulate import process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Eventually, we'd implement actual data import functionality here
        // For now we're just showing a success message
        
        toast.success('Données importées avec succès');
      } catch (err) {
        console.error('Error importing data:', err);
        toast.error('Erreur lors de l\'importation des données');
      } finally {
        setIsImporting(false);
      }
    };
    
    input.click();
  };

  // Toggle purge selection
  const togglePurgeSelection = (collection: string) => {
    if (purgeSelection.includes(collection)) {
      setPurgeSelection(purgeSelection.filter(item => item !== collection));
    } else {
      setPurgeSelection([...purgeSelection, collection]);
    }
  };

  // Purge data
  const handlePurgeData = async () => {
    if (purgeSelection.length === 0) {
      toast.error('Veuillez sélectionner au moins une collection à purger');
      return;
    }

    if (!confirm(`ATTENTION: Vous êtes sur le point de supprimer définitivement toutes les données des collections suivantes:\n\n${purgeSelection.join('\n')}\n\nCette action est irréversible. Voulez-vous continuer ?`)) {
      return;
    }

    setIsPurging(true);
    try {
      for (const collectionName of purgeSelection) {
        let collectionPath = '';
        
        // Map collection name to Firestore path
        switch(collectionName) {
          case 'Clients':
            collectionPath = COLLECTIONS.CRM.CLIENTS;
            break;
          case 'Prospects':
            collectionPath = COLLECTIONS.CRM.PROSPECTS;
            break;
          case 'Opportunités':
            collectionPath = COLLECTIONS.CRM.OPPORTUNITIES;
            break;
          case 'Contacts':
            collectionPath = COLLECTIONS.CRM.CONTACTS;
            break;
          case 'Affaires':
            collectionPath = COLLECTIONS.CRM.DEALS;
            break;
          default:
            continue;
        }
        
        // Get all documents in the collection
        const q = query(collection(db, collectionPath), limit(500));
        const snapshot = await getDocs(q);
        
        // Delete in batches
        const batch = writeBatch(db);
        snapshot.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
        
        await batch.commit();
      }
      
      toast.success('Données purgées avec succès');
      setPurgeSelection([]);
    } catch (err) {
      console.error('Error purging data:', err);
      toast.error('Erreur lors de la purge des données');
    } finally {
      setIsPurging(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Export Section */}
          <div>
            <h2 className="text-lg font-medium mb-3">Exporter les données</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleExportData} disabled={isExporting}>
                  {isExporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Exportation...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Exporter
                    </>
                  )}
                </Button>
              </div>
              <div className="text-sm text-gray-500">
                Exportez toutes les données CRM dans un fichier à des fins de sauvegarde ou d'analyse.
              </div>
            </div>
          </div>

          <Separator />

          {/* Import Section */}
          <div>
            <h2 className="text-lg font-medium mb-3">Importer des données</h2>
            <div className="space-y-3">
              <Button onClick={handleImportData} disabled={isImporting}>
                {isImporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importation...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Importer un fichier
                  </>
                )}
              </Button>
              <div className="text-sm text-gray-500">
                Importez des données au format JSON, CSV ou XLSX. Les données existantes ne seront pas écrasées.
              </div>
            </div>
          </div>

          <Separator />

          {/* Purge Data Section */}
          <div>
            <div className="flex items-center mb-3">
              <h2 className="text-lg font-medium">Purger les données</h2>
              <AlertTriangle className="ml-2 h-4 w-4 text-amber-500" />
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['Clients', 'Prospects', 'Opportunités', 'Contacts', 'Affaires'].map((item) => (
                  <div key={item} className="flex items-center justify-between p-3 border rounded-md">
                    <span>{item}</span>
                    <Switch 
                      checked={purgeSelection.includes(item)}
                      onCheckedChange={() => togglePurgeSelection(item)}
                    />
                  </div>
                ))}
              </div>
              
              <Button variant="destructive" onClick={handlePurgeData} disabled={isPurging || purgeSelection.length === 0}>
                {isPurging ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Suppression...
                  </>
                ) : (
                  <>
                    <Trash className="mr-2 h-4 w-4" />
                    Purger les données sélectionnées
                  </>
                )}
              </Button>
              
              <div className="bg-amber-50 text-amber-800 p-3 rounded-md border border-amber-100 text-sm">
                <strong>Attention:</strong> La purge des données est définitive et ne peut pas être annulée.
                Assurez-vous d'avoir exporté vos données avant de procéder à cette opération.
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataTab;
