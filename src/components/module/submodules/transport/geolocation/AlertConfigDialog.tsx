
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { AlertTriangle, Clock, MapPin, Gauge, Bell } from "lucide-react";

interface AlertConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void;
}

const AlertConfigDialog: React.FC<AlertConfigDialogProps> = ({
  open,
  onOpenChange,
  onSave
}) => {
  const [activeTab, setActiveTab] = React.useState("general");
  
  const form = useForm({
    defaultValues: {
      enableSpeedAlerts: true,
      speedThreshold: "90",
      enableGeofenceAlerts: true,
      enableUnauthorizedUseAlerts: true,
      unauthorizedStartHour: "22",
      unauthorizedEndHour: "6",
      enableEmailNotifications: true,
      enableSmsNotifications: false,
      emailRecipients: "transport@example.com",
      autoResolveAfterHours: "24",
      alertPriority: "high"
    }
  });
  
  const handleSubmit = (data: any) => {
    onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <span>Configuration des alertes</span>
          </DialogTitle>
          <DialogDescription>
            Personnalisez les paramètres d'alerte pour votre flotte de véhicules
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="types">Types d'alertes</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <TabsContent value="general" className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="alertPriority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priorité par défaut des alertes</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une priorité" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Basse</SelectItem>
                          <SelectItem value="medium">Moyenne</SelectItem>
                          <SelectItem value="high">Haute</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="autoResolveAfterHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Résolution automatique après (heures)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Les alertes non résolues seront automatiquement marquées comme résolues après ce délai
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="types" className="space-y-4 py-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="enableSpeedAlerts" className="font-medium flex items-center gap-2">
                        <Gauge className="h-4 w-4" />
                        <span>Alertes de vitesse</span>
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Recevoir une alerte lorsqu'un véhicule dépasse la limite de vitesse configurée
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="enableSpeedAlerts"
                      render={({ field }) => (
                        <FormItem>
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
                  
                  <FormField
                    control={form.control}
                    name="speedThreshold"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Seuil de vitesse (km/h)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <div className="border-t my-4"></div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="enableGeofenceAlerts" className="font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>Alertes de sortie de zone</span>
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Recevoir une alerte lorsqu'un véhicule sort de sa zone autorisée
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="enableGeofenceAlerts"
                      render={({ field }) => (
                        <FormItem>
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
                  
                  <div className="border-t my-4"></div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="enableUnauthorizedUseAlerts" className="font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Alertes d'utilisation non autorisée</span>
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Recevoir une alerte lorsqu'un véhicule est utilisé en dehors des heures autorisées
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="enableUnauthorizedUseAlerts"
                      render={({ field }) => (
                        <FormItem>
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
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="unauthorizedStartHour"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Début (heure)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" max="23" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="unauthorizedEndHour"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fin (heure)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" max="23" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="notifications" className="space-y-4 py-4">
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="enableEmailNotifications" className="font-medium">
                      Notifications par email
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir les alertes par email
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="enableEmailNotifications"
                    render={({ field }) => (
                      <FormItem>
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
                
                <FormField
                  control={form.control}
                  name="emailRecipients"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destinataires des emails</FormLabel>
                      <FormControl>
                        <Input placeholder="email@exemple.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Séparez les adresses email par des virgules
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <div className="border-t my-4"></div>
                
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="enableSmsNotifications" className="font-medium">
                      Notifications par SMS
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir les alertes par SMS
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="enableSmsNotifications"
                    render={({ field }) => (
                      <FormItem>
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
              </TabsContent>
              
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Annuler
                </Button>
                <Button type="submit">Enregistrer</Button>
              </DialogFooter>
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AlertConfigDialog;
