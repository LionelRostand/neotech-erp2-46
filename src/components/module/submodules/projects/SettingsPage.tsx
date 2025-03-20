
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Workflow, ShieldCheck, Plug } from "lucide-react";
import { 
  Form, FormControl, FormDescription, FormField, 
  FormItem, FormLabel, FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const workflowsSchema = z.object({
  taskNotifications: z.boolean().default(true),
  deadlineReminders: z.boolean().default(true),
  statusChangeAlerts: z.boolean().default(true),
  automaticProgress: z.boolean().default(true),
});

const permissionsSchema = z.object({
  projectCreationRole: z.string().default("admin"),
  taskAssignmentRole: z.string().default("manager"),
  reportAccessRole: z.string().default("user"),
});

const integrationsSchema = z.object({
  slackWebhook: z.string().optional(),
  jiraApiKey: z.string().optional(),
  googleCalendarIntegration: z.boolean().default(false),
});

const SettingsPage = () => {
  const workflowsForm = useForm<z.infer<typeof workflowsSchema>>({
    resolver: zodResolver(workflowsSchema),
    defaultValues: {
      taskNotifications: true,
      deadlineReminders: true,
      statusChangeAlerts: true,
      automaticProgress: true,
    },
  });
  
  const permissionsForm = useForm<z.infer<typeof permissionsSchema>>({
    resolver: zodResolver(permissionsSchema),
    defaultValues: {
      projectCreationRole: "admin",
      taskAssignmentRole: "manager",
      reportAccessRole: "user",
    },
  });
  
  const integrationsForm = useForm<z.infer<typeof integrationsSchema>>({
    resolver: zodResolver(integrationsSchema),
    defaultValues: {
      slackWebhook: "",
      jiraApiKey: "",
      googleCalendarIntegration: false,
    },
  });
  
  const onWorkflowsSubmit = (values: z.infer<typeof workflowsSchema>) => {
    console.log(values);
    toast.success("Paramètres de workflow enregistrés");
  };
  
  const onPermissionsSubmit = (values: z.infer<typeof permissionsSchema>) => {
    console.log(values);
    toast.success("Paramètres de permissions enregistrés");
  };
  
  const onIntegrationsSubmit = (values: z.infer<typeof integrationsSchema>) => {
    console.log(values);
    toast.success("Paramètres d'intégration enregistrés");
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Paramètres</CardTitle>
          <CardDescription>Configurez le module de gestion de projets</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="workflows">
            <TabsList className="w-full grid grid-cols-3 mb-6">
              <TabsTrigger value="workflows" className="flex items-center gap-1">
                <Workflow className="h-4 w-4" />
                <span>Workflows</span>
              </TabsTrigger>
              <TabsTrigger value="permissions" className="flex items-center gap-1">
                <ShieldCheck className="h-4 w-4" />
                <span>Permissions</span>
              </TabsTrigger>
              <TabsTrigger value="integrations" className="flex items-center gap-1">
                <Plug className="h-4 w-4" />
                <span>Intégrations</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="workflows" className="mt-0">
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-medium mb-2">Configuration des Workflows</h3>
                <p className="text-sm text-gray-500">
                  Configurez les automatisations et les notifications pour la gestion des projets et des tâches.
                </p>
              </div>
              
              <Form {...workflowsForm}>
                <form onSubmit={workflowsForm.handleSubmit(onWorkflowsSubmit)} className="space-y-6">
                  <FormField
                    control={workflowsForm.control}
                    name="taskNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Notifications de tâches</FormLabel>
                          <FormDescription>
                            Envoyer des notifications lors de l'assignation d'une tâche
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
                  
                  <FormField
                    control={workflowsForm.control}
                    name="deadlineReminders"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Rappels d'échéance</FormLabel>
                          <FormDescription>
                            Envoyer des rappels pour les tâches dont l'échéance approche
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
                  
                  <FormField
                    control={workflowsForm.control}
                    name="statusChangeAlerts"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Alertes de changement de statut</FormLabel>
                          <FormDescription>
                            Notification quand le statut d'une tâche ou d'un projet change
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
                  
                  <FormField
                    control={workflowsForm.control}
                    name="automaticProgress"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Progression automatique</FormLabel>
                          <FormDescription>
                            Mettre à jour automatiquement la progression du projet en fonction des tâches terminées
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
                  
                  <Button type="submit">Enregistrer les paramètres</Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="permissions" className="mt-0">
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-medium mb-2">Configuration des Permissions</h3>
                <p className="text-sm text-gray-500">
                  Définissez qui peut créer, modifier ou supprimer des projets et des tâches.
                </p>
              </div>
              
              <Form {...permissionsForm}>
                <form onSubmit={permissionsForm.handleSubmit(onPermissionsSubmit)} className="space-y-6">
                  <FormField
                    control={permissionsForm.control}
                    name="projectCreationRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Création de projet</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Rôle requis"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Rôle minimal requis pour créer des projets
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={permissionsForm.control}
                    name="taskAssignmentRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assignation de tâches</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Rôle requis"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Rôle minimal requis pour assigner des tâches aux membres
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={permissionsForm.control}
                    name="reportAccessRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Accès aux rapports</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Rôle requis"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Rôle minimal requis pour accéder aux rapports
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit">Enregistrer les permissions</Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="integrations" className="mt-0">
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-medium mb-2">Configuration des Intégrations</h3>
                <p className="text-sm text-gray-500">
                  Connectez le module de projets à d'autres outils comme Slack, Jira ou Google Calendar.
                </p>
              </div>
              
              <Form {...integrationsForm}>
                <form onSubmit={integrationsForm.handleSubmit(onIntegrationsSubmit)} className="space-y-6">
                  <FormField
                    control={integrationsForm.control}
                    name="slackWebhook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Webhook Slack</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://hooks.slack.com/services/..."
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormDescription>
                          URL du webhook pour envoyer des notifications à Slack
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={integrationsForm.control}
                    name="jiraApiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Clé API Jira</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Entrez votre clé API Jira"
                            type="password"
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormDescription>
                          Clé API pour synchroniser les tâches avec Jira
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={integrationsForm.control}
                    name="googleCalendarIntegration"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Intégration Google Calendar</FormLabel>
                          <FormDescription>
                            Ajouter automatiquement les dates d'échéance au calendrier
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
                  
                  <Button type="submit">Enregistrer les intégrations</Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
