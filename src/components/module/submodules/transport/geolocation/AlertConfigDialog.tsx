
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertCircle, MapPin, Timer, Share2, AlertOctagon, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AlertConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (config: any) => void;
}

const AlertConfigDialog: React.FC<AlertConfigDialogProps> = ({
  open,
  onOpenChange,
  onSave = () => {} // Default empty function if not provided
}) => {
  const { toast } = useToast();
  const [config, setConfig] = useState({
    speedAlerts: true,
    maxSpeed: "130",
    zoneAlerts: true,
    idleAlerts: true,
    maxIdleTime: "30",
    maintenanceAlerts: true,
    notificationEmail: "admin@example.com",
    notificationSMS: "+1234567890",
    emergencyAlerts: true
  });

  const handleChange = (key: string, value: string | boolean) => {
    setConfig({
      ...config,
      [key]: value
    });
  };

  const handleSubmit = () => {
    onSave(config);
    toast({
      title: "Configuration sauvegardée",
      description: "Les paramètres d'alerte ont été mis à jour."
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Configuration des alertes</DialogTitle>
          <DialogDescription>
            Personnalisez les alertes pour votre flotte de véhicules
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="speed">
              <AccordionTrigger className="flex items-center">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>Alertes de vitesse</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="speedAlerts">Activer les alertes de vitesse</Label>
                    <Switch 
                      id="speedAlerts" 
                      checked={config.speedAlerts}
                      onCheckedChange={(checked) => handleChange("speedAlerts", checked)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="maxSpeed">Vitesse maximale (km/h)</Label>
                    <Input 
                      id="maxSpeed" 
                      value={config.maxSpeed}
                      onChange={(e) => handleChange("maxSpeed", e.target.value)}
                      disabled={!config.speedAlerts}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="zone">
              <AccordionTrigger className="flex items-center">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Alertes de zone</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="zoneAlerts">Activer les alertes de zone</Label>
                    <Switch 
                      id="zoneAlerts" 
                      checked={config.zoneAlerts}
                      onCheckedChange={(checked) => handleChange("zoneAlerts", checked)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Les alertes de zone vous informent lorsqu'un véhicule entre ou sort des zones géographiques définies.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="idle">
              <AccordionTrigger className="flex items-center">
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4" />
                  <span>Alertes d'inactivité</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="idleAlerts">Activer les alertes d'inactivité</Label>
                    <Switch 
                      id="idleAlerts" 
                      checked={config.idleAlerts}
                      onCheckedChange={(checked) => handleChange("idleAlerts", checked)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="maxIdleTime">Temps maximum d'inactivité (minutes)</Label>
                    <Input 
                      id="maxIdleTime" 
                      value={config.maxIdleTime}
                      onChange={(e) => handleChange("maxIdleTime", e.target.value)}
                      disabled={!config.idleAlerts}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="maintenance">
              <AccordionTrigger className="flex items-center">
                <div className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  <span>Alertes de maintenance</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="maintenanceAlerts">Activer les alertes de maintenance</Label>
                    <Switch 
                      id="maintenanceAlerts" 
                      checked={config.maintenanceAlerts}
                      onCheckedChange={(checked) => handleChange("maintenanceAlerts", checked)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Recevez des alertes lorsqu'un véhicule approche d'une échéance de maintenance.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="notifications">
              <AccordionTrigger className="flex items-center">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="notificationEmail">Email de notification</Label>
                    <Input 
                      id="notificationEmail" 
                      value={config.notificationEmail}
                      onChange={(e) => handleChange("notificationEmail", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="notificationSMS">Numéro SMS pour notifications</Label>
                    <Input 
                      id="notificationSMS" 
                      value={config.notificationSMS}
                      onChange={(e) => handleChange("notificationSMS", e.target.value)}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="emergency">
              <AccordionTrigger className="flex items-center">
                <div className="flex items-center gap-2">
                  <AlertOctagon className="h-4 w-4" />
                  <span>Alertes d'urgence</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emergencyAlerts">Activer les alertes d'urgence</Label>
                    <Switch 
                      id="emergencyAlerts" 
                      checked={config.emergencyAlerts}
                      onCheckedChange={(checked) => handleChange("emergencyAlerts", checked)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Recevez des notifications immédiates en cas d'événements critiques comme les accidents.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            Sauvegarder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AlertConfigDialog;
