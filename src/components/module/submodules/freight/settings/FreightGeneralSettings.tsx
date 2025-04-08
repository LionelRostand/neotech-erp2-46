
import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FormItem, FormLabel, FormControl, FormDescription, Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { isNetworkError } from '@/hooks/firestore/network-handler';

// Schéma de validation des paramètres généraux
const generalSettingsSchema = z.object({
  companyName: z.string().min(2, "Le nom de l'entreprise est requis").max(100),
  defaultCurrency: z.string().min(1, "La devise par défaut est requise"),
  contactEmail: z.string().email("Email invalide"),
  supportPhone: z.string().optional(),
  enableNotifications: z.boolean().default(true),
  weightUnit: z.string().min(1, "L'unité de poids est requise"),
  distanceUnit: z.string().min(1, "L'unité de distance est requise"),
  defaultLanguage: z.string().min(1, "La langue par défaut est requise"),
  systemMessage: z.string().optional(),
  autoSaveEnabled: z.boolean().default(true),
});

type GeneralSettingsFormValues = z.infer<typeof generalSettingsSchema>;

interface FreightGeneralSettingsProps {
  isAdmin: boolean;
  canEdit: boolean;
}

const FreightGeneralSettings: React.FC<FreightGeneralSettingsProps> = ({ isAdmin, canEdit }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Formulaire avec React Hook Form et validation Zod
  const form = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      companyName: '',
      defaultCurrency: 'EUR',
      contactEmail: '',
      supportPhone: '',
      enableNotifications: true,
      weightUnit: 'kg',
      distanceUnit: 'km',
      defaultLanguage: 'fr',
      systemMessage: '',
      autoSaveEnabled: true,
    },
  });

  // Charger les paramètres au montage du composant
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setIsOffline(false);

        // Essayer de récupérer le document des paramètres
        const settingsRef = doc(db, COLLECTIONS.FREIGHT.SETTINGS);
        const settingsDoc = await getDoc(settingsRef);

        if (settingsDoc.exists()) {
          const data = settingsDoc.data();
          setSettingsId(settingsDoc.id);
          
          // Mettre à jour le formulaire avec les données existantes
          form.reset({
            companyName: data.companyName || '',
            defaultCurrency: data.defaultCurrency || 'EUR',
            contactEmail: data.contactEmail || '',
            supportPhone: data.supportPhone || '',
            enableNotifications: data.enableNotifications !== undefined ? data.enableNotifications : true,
            weightUnit: data.weightUnit || 'kg',
            distanceUnit: data.distanceUnit || 'km',
            defaultLanguage: data.defaultLanguage || 'fr',
            systemMessage: data.systemMessage || '',
            autoSaveEnabled: data.autoSaveEnabled !== undefined ? data.autoSaveEnabled : true,
          });
        } else {
          // Si le document n'existe pas encore, on utilise les valeurs par défaut
          console.log("Aucun paramètre existant, utilisation des valeurs par défaut");
        }
      } catch (err: any) {
        console.error("Erreur lors du chargement des paramètres:", err);
        
        if (isNetworkError(err)) {
          setIsOffline(true);
          // En mode hors ligne, on continue avec les valeurs par défaut ou celles dans le formulaire
          toast({
            title: "Mode hors ligne",
            description: "Vous êtes en mode hors ligne. Les modifications seront enregistrées localement.",
            variant: "default",
          });
        } else {
          setError(`Erreur lors du chargement des paramètres: ${err.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [form]);

  const onSubmit = async (data: GeneralSettingsFormValues) => {
    if (!canEdit && !isAdmin) {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les droits nécessaires pour modifier ces paramètres.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      const settingsRef = doc(db, COLLECTIONS.FREIGHT.SETTINGS);
      
      if (settingsId) {
        // Mise à jour d'un document existant
        await updateDoc(settingsRef, {
          ...data,
          updatedAt: new Date(),
          updatedBy: 'current-user', // Idéalement, utiliser l'ID de l'utilisateur actuel
        });
      } else {
        // Création d'un nouveau document
        await setDoc(settingsRef, {
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'current-user', // Idéalement, utiliser l'ID de l'utilisateur actuel
        });
        setSettingsId(settingsRef.id);
      }

      setSuccessMessage("Paramètres enregistrés avec succès");
      toast({
        title: "Succès",
        description: "Les paramètres ont été enregistrés.",
        variant: "default",
      });
    } catch (err: any) {
      console.error("Erreur lors de l'enregistrement des paramètres:", err);
      
      if (isNetworkError(err)) {
        setIsOffline(true);
        toast({
          title: "Mode hors ligne",
          description: "Vous êtes en mode hors ligne. Les modifications seront enregistrées localement.",
          variant: "default",
        });
      } else {
        setError(`Erreur lors de l'enregistrement: ${err.message}`);
        toast({
          title: "Erreur",
          description: `Impossible d'enregistrer les paramètres: ${err.message}`,
          variant: "destructive",
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p>Chargement des paramètres du module...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {isOffline && (
        <Alert variant="default">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Vous êtes actuellement en mode hors ligne. Les modifications seront enregistrées localement
            jusqu'à ce que la connexion soit rétablie.
          </AlertDescription>
        </Alert>
      )}

      {!canEdit && !isAdmin && (
        <Alert variant="default">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Vous êtes en mode lecture seule. Vous pouvez consulter les paramètres mais ne pouvez pas les modifier.
          </AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert variant="default">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-600">{successMessage}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Paramètres généraux du module Fret</CardTitle>
          <CardDescription>
            Configuration des paramètres de base pour les opérations de fret et d'expédition
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem>
                  <FormLabel>Nom de l'entreprise</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nom de l'entreprise"
                      {...form.register("companyName")}
                      disabled={!canEdit && !isAdmin}
                    />
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel>Email de contact</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="contact@example.com"
                      {...form.register("contactEmail")}
                      disabled={!canEdit && !isAdmin}
                    />
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel>Téléphone de support</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+33 1 23 45 67 89"
                      {...form.register("supportPhone")}
                      disabled={!canEdit && !isAdmin}
                    />
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel>Devise par défaut</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="EUR"
                      {...form.register("defaultCurrency")}
                      disabled={!canEdit && !isAdmin}
                    />
                  </FormControl>
                  <FormDescription>Utilisée pour tous les prix et factures</FormDescription>
                </FormItem>

                <FormItem>
                  <FormLabel>Unité de poids</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="kg"
                      {...form.register("weightUnit")}
                      disabled={!canEdit && !isAdmin}
                    />
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel>Unité de distance</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="km"
                      {...form.register("distanceUnit")}
                      disabled={!canEdit && !isAdmin}
                    />
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel>Langue par défaut</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="fr"
                      {...form.register("defaultLanguage")}
                      disabled={!canEdit && !isAdmin}
                    />
                  </FormControl>
                </FormItem>
                
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Notifications automatiques</FormLabel>
                    <FormDescription>
                      Activer les notifications pour les changements de statut
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={form.watch("enableNotifications")}
                      onCheckedChange={(checked) => form.setValue("enableNotifications", checked)}
                      disabled={!canEdit && !isAdmin}
                    />
                  </FormControl>
                </FormItem>
                
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Sauvegarde automatique</FormLabel>
                    <FormDescription>
                      Sauvegarde automatique des brouillons d'expédition
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={form.watch("autoSaveEnabled")}
                      onCheckedChange={(checked) => form.setValue("autoSaveEnabled", checked)}
                      disabled={!canEdit && !isAdmin}
                    />
                  </FormControl>
                </FormItem>
              </div>

              <FormItem>
                <FormLabel>Message système</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Message affiché aux utilisateurs du module fret..."
                    {...form.register("systemMessage")}
                    rows={3}
                    disabled={!canEdit && !isAdmin}
                  />
                </FormControl>
                <FormDescription>Ce message sera affiché à tous les utilisateurs du module</FormDescription>
              </FormItem>

              {(canEdit || isAdmin) && (
                <Button 
                  type="submit" 
                  className="w-full mt-4"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    'Enregistrer les paramètres'
                  )}
                </Button>
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            <Badge variant="outline" className="mr-2">
              {isOffline ? 'Mode hors ligne' : 'Connecté'}
            </Badge>
            {settingsId && (
              <Badge variant="outline">
                ID: {settingsId.substring(0, 8)}...
              </Badge>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FreightGeneralSettings;
