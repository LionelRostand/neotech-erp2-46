
import React, { useState, useEffect } from 'react';
import { useDocumentService } from '../../documents/services/documentService';
import { DocumentSettings } from '../../documents/types/document-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Settings, 
  Save, 
  Shield, 
  BellRing, 
  HardDrive, 
  FileWarning,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

// Form schema
const settingsSchema = z.object({
  autoArchiveDays: z.number().min(1).max(365),
  maxStoragePerUser: z.number().min(1024 * 1024), // Minimum 1MB
  allowedFormats: z.string(),
  encryptionEnabled: z.boolean(),
  emailNotifications: z.boolean()
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const DocumentsSettings: React.FC = () => {
  const { getDocumentSettings, updateDocumentSettings } = useDocumentService();
  
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("general");
  
  // Create form
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      autoArchiveDays: 90,
      maxStoragePerUser: 1024 * 1024 * 1024, // 1GB
      allowedFormats: "pdf,docx,xlsx,jpg,png",
      encryptionEnabled: true,
      emailNotifications: true
    }
  });
  
  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const settings = await getDocumentSettings();
        if (settings) {
          form.reset({
            autoArchiveDays: settings.autoArchiveDays,
            maxStoragePerUser: settings.maxStoragePerUser,
            allowedFormats: settings.allowedFormats.join(','),
            encryptionEnabled: settings.encryptionEnabled,
            emailNotifications: settings.emailNotifications
          });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast.error('Erreur lors de la récupération des paramètres');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, [getDocumentSettings, form]);
  
  // Handle form submission
  const onSubmit = async (data: SettingsFormValues) => {
    setIsLoading(true);
    try {
      const updatedSettings: Partial<DocumentSettings> = {
        autoArchiveDays: data.autoArchiveDays,
        maxStoragePerUser: data.maxStoragePerUser,
        allowedFormats: data.allowedFormats.split(',').map(format => format.trim()),
        encryptionEnabled: data.encryptionEnabled,
        emailNotifications: data.emailNotifications
      };
      
      await updateDocumentSettings(updatedSettings);
      toast.success('Paramètres mis à jour avec succès');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Erreur lors de la mise à jour des paramètres');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format file size for display
  const formatStorageSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
  };
  
  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="general">
            <Settings className="h-4 w-4 mr-2" />
            Général
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="storage">
            <HardDrive className="h-4 w-4 mr-2" />
            Stockage
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <BellRing className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>
        
        {/* Form wrapper */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            {/* General Tab */}
            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres généraux</CardTitle>
                  <CardDescription>
                    Configurez les paramètres généraux du module Documents
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="autoArchiveDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Archivage automatique (jours)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={e => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Les documents inactifs seront archivés automatiquement après cette période
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="allowedFormats"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Formats de fichiers autorisés</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Liste des formats autorisés, séparés par des virgules (sans point)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Security Tab */}
            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sécurité des documents</CardTitle>
                  <CardDescription>
                    Configurez les paramètres de sécurité pour vos documents
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="encryptionEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Chiffrement AES-256</FormLabel>
                          <FormDescription>
                            Activer le chiffrement AES-256 pour les fichiers sensibles
                          </FormDescription>
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
                  
                  <div className="rounded-lg border p-4 bg-amber-50 border-amber-200">
                    <div className="flex items-start">
                      <FileWarning className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-amber-800">Authentification multifactorielle</h4>
                        <p className="text-sm text-amber-700 mt-1">
                          L'authentification multifactorielle est gérée dans les paramètres généraux de sécurité du système.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Storage Tab */}
            <TabsContent value="storage" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres de stockage</CardTitle>
                  <CardDescription>
                    Configurez les quotas et limites de stockage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="maxStoragePerUser"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quota de stockage par utilisateur</FormLabel>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={e => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <Badge variant="outline">{formatStorageSize(field.value)}</Badge>
                        </div>
                        <FormDescription>
                          Espace de stockage maximum alloué à chaque utilisateur (en octets)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="rounded-lg border p-4">
                    <h4 className="text-sm font-medium mb-2">Lieux de stockage</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Documents actifs:</span>
                        <Badge variant="outline">AWS S3 Standard</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Documents archivés:</span>
                        <Badge variant="outline">AWS S3 Glacier</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Métadonnées:</span>
                        <Badge variant="outline">PostgreSQL</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres de notification</CardTitle>
                  <CardDescription>
                    Configurez les notifications par email pour les documents
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="emailNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Notifications par email</FormLabel>
                          <FormDescription>
                            Recevoir des notifications par email lors de l'ajout ou de la modification de documents
                          </FormDescription>
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
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Submit button - fixed at bottom for all tabs */}
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Chargement...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer les paramètres
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
};

export default DocumentsSettings;
