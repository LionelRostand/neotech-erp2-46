
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Loader2 } from "lucide-react";
import { useDataSettings } from "./hooks/useDataSettings";

const DataSettings: React.FC = () => {
  const { form, isSaving, onSubmit } = useDataSettings();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Gestion des données</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="automaticBackups"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <FormLabel>Sauvegardes automatiques</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Activer les sauvegardes automatiques des données
                      </p>
                    </div>
                    <FormControl>
                      <Switch 
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="backupFrequency"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Fréquence des sauvegardes</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez la fréquence" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="daily">Quotidienne</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                        <SelectItem value="monthly">Mensuelle</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="retentionPeriod"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Période de rétention (jours)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="exportFormat"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Format d'exportation par défaut</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez le format" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="enableDataSync"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <FormLabel>Synchronisation des données</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Activer la synchronisation avec d'autres systèmes
                      </p>
                    </div>
                    <FormControl>
                      <Switch 
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="archiveOldData"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <FormLabel>Archivage automatique</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Archiver automatiquement les anciennes données
                      </p>
                    </div>
                    <FormControl>
                      <Switch 
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Enregistrer les modifications
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default DataSettings;
