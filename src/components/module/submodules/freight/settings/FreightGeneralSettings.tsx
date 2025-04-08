
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { collection, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { AlertCircle, Save } from 'lucide-react';

// Schema de validation des paramètres
const generalSettingsSchema = z.object({
  enableTracking: z.boolean().default(true),
  enableNotifications: z.boolean().default(true),
  alertThreshold: z.number().min(1).max(100).default(15),
  defaultCarrierId: z.string().optional(),
  companyName: z.string().min(2, "Le nom de l'entreprise doit comporter au moins 2 caractères"),
  contactEmail: z.string().email("Adresse email invalide"),
  contactPhone: z.string().optional(),
  defaultCurrency: z.string().default("EUR"),
  enableClientPortal: z.boolean().default(false),
});

type GeneralSettingsFormValues = z.infer<typeof generalSettingsSchema>;

interface FreightGeneralSettingsProps {
  isAdmin: boolean;
  canEdit: boolean;
}

const FreightGeneralSettings: React.FC<FreightGeneralSettingsProps> = ({ isAdmin, canEdit }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanged, setHasChanged] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Valeurs par défaut au cas où les paramètres n'existent pas encore
  const defaultValues: GeneralSettingsFormValues = {
    enableTracking: true,
    enableNotifications: true,
    alertThreshold: 15,
    defaultCarrierId: "",
    companyName: "Mon Entreprise de Fret",
    contactEmail: "contact@entreprise.com",
    contactPhone: "",
    defaultCurrency: "EUR",
    enableClientPortal: false
  };

  const form = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues
  });

  // Gérer l'événement en ligne/hors ligne
  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  // Charger les paramètres depuis Firestore
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const settingsRef = doc(db, COLLECTIONS.FREIGHT.SETTINGS, 'general');
        const settingsDoc = await getDoc(settingsRef);
        
        if (settingsDoc.exists()) {
          const settingsData = settingsDoc.data();
          // Mettre à jour le formulaire avec les données existantes
          form.reset({
            ...defaultValues,
            ...settingsData
          });
        } else {
          // Si les paramètres n'existent pas encore, utiliser les valeurs par défaut
          form.reset(defaultValues);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des paramètres:", err);
        setError("Impossible de charger les paramètres. Veuillez réessayer.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Détecter les changements dans le formulaire
  useEffect(() => {
    const subscription = form.watch(() => {
      setHasChanged(true);
    });
    
    return () => subscription.unsubscribe();
  }, [form.watch]);

  // Fonction pour sauvegarder les paramètres
  const onSubmit = async (data: GeneralSettingsFormValues) => {
    if (!canEdit && !isAdmin) {
      toast({
        title: "Permission refusée",
        description: "Vous n'avez pas les droits nécessaires pour modifier ces paramètres.",
        variant: "destructive"
      });
      return;
    }

    if (!isOnline) {
      toast({
        title: "Hors ligne",
        description: "Impossible de sauvegarder les paramètres en mode hors ligne.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSaving(true);
      
      // Référence au document des paramètres généraux
      const settingsRef = doc(db, COLLECTIONS.FREIGHT.SETTINGS, 'general');
      
      // Ajouter un timestamp de mise à jour
      const dataToSave = {
        ...data,
        updatedAt: serverTimestamp(),
        updatedBy: "currentUserId" // Idéalement, vous utiliseriez l'ID de l'utilisateur actuel
      };
      
      await setDoc(settingsRef, dataToSave, { merge: true });
      
      setHasChanged(false);
      toast({
        title: "Paramètres sauvegardés",
        description: "Les paramètres ont été mis à jour avec succès.",
      });
    } catch (err) {
      console.error("Erreur lors de la sauvegarde des paramètres:", err);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {!isOnline && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-3 text-amber-800 mb-4">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium">Mode hors ligne</h3>
            <p className="text-sm mt-1">
              Vous êtes actuellement hors ligne. Les modifications des paramètres ne seront pas sauvegardées.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-3 text-red-800 mb-4">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium">Erreur</h3>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres Généraux</CardTitle>
              <CardDescription>
                Configurez les paramètres généraux du module de gestion de fret.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de l'entreprise</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isLoading || (!canEdit && !isAdmin)} />
                      </FormControl>
                      <FormDescription>
                        Ce nom apparaîtra sur les documents générés.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email de contact</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} disabled={isLoading || (!canEdit && !isAdmin)} />
                      </FormControl>
                      <FormDescription>
                        Email utilisé pour les notifications et le contact client.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone de contact</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isLoading || (!canEdit && !isAdmin)} />
                      </FormControl>
                      <FormDescription>
                        Numéro de téléphone pour le service client (optionnel).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="defaultCurrency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Devise par défaut</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isLoading || (!canEdit && !isAdmin)} />
                      </FormControl>
                      <FormDescription>
                        Devise utilisée pour les tarifs et factures (ex: EUR, USD).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Options du système</h3>
                
                <FormField
                  control={form.control}
                  name="enableTracking"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Activer le suivi en temps réel
                        </FormLabel>
                        <FormDescription>
                          Permet le suivi des expéditions et conteneurs en temps réel.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading || (!canEdit && !isAdmin)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="enableNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Activer les notifications
                        </FormLabel>
                        <FormDescription>
                          Envoie des notifications par email lors des changements de statut.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading || (!canEdit && !isAdmin)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="enableClientPortal"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Activer le portail client
                        </FormLabel>
                        <FormDescription>
                          Permet aux clients d'accéder à leurs expéditions et documents.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading || (!canEdit && !isAdmin)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="alertThreshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seuil d'alerte (jours)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={e => field.onChange(parseInt(e.target.value))}
                          disabled={isLoading || (!canEdit && !isAdmin)} 
                        />
                      </FormControl>
                      <FormDescription>
                        Nombre de jours avant expédition pour déclencher les alertes.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="justify-between border-t p-4">
              <div className="text-sm text-gray-500">
                {hasChanged ? "Modifications non sauvegardées" : ""}
              </div>
              <Button 
                type="submit" 
                disabled={!hasChanged || isLoading || isSaving || !isOnline || (!canEdit && !isAdmin)}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Sauvegarde en cours..." : "Sauvegarder"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default FreightGeneralSettings;
