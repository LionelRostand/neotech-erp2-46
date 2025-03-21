
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Toggle } from '@/components/ui/toggle';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BellRing, Clock, Mail, MessageSquare, Phone, Send } from 'lucide-react';

const NotificationsSettings = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Notifications automatiques</CardTitle>
              <CardDescription>Configuration des notifications et rappels</CardDescription>
            </div>
            <Toggle defaultPressed aria-label="Activer les notifications">Activé</Toggle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Notifications par email
              </h3>
              
              <div className="space-y-3 pl-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Confirmation de réservation</p>
                    <p className="text-xs text-muted-foreground">Email lors de la création du rendez-vous</p>
                  </div>
                  <Toggle defaultPressed aria-label="Activer la confirmation par email" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Rappel de rendez-vous</p>
                    <p className="text-xs text-muted-foreground">Rappel envoyé la veille</p>
                  </div>
                  <Toggle defaultPressed aria-label="Activer le rappel par email" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Confirmation de modification</p>
                    <p className="text-xs text-muted-foreground">Email lors d'un changement de rendez-vous</p>
                  </div>
                  <Toggle defaultPressed aria-label="Activer la confirmation de modification" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Confirmation d'annulation</p>
                    <p className="text-xs text-muted-foreground">Email lors de l'annulation d'un rendez-vous</p>
                  </div>
                  <Toggle defaultPressed aria-label="Activer la confirmation d'annulation" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Notifications par SMS
              </h3>
              
              <div className="space-y-3 pl-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Confirmation de réservation</p>
                    <p className="text-xs text-muted-foreground">SMS lors de la création du rendez-vous</p>
                  </div>
                  <Toggle aria-label="Activer la confirmation par SMS" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Rappel de rendez-vous</p>
                    <p className="text-xs text-muted-foreground">SMS envoyé 24h avant</p>
                  </div>
                  <Toggle defaultPressed aria-label="Activer le rappel par SMS" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Confirmation de modification</p>
                    <p className="text-xs text-muted-foreground">SMS lors d'un changement de rendez-vous</p>
                  </div>
                  <Toggle aria-label="Activer la confirmation de modification par SMS" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Rappel de dernière minute</p>
                    <p className="text-xs text-muted-foreground">SMS 2h avant le rendez-vous</p>
                  </div>
                  <Toggle defaultPressed aria-label="Activer le rappel de dernière minute" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4 pt-2">
            <h3 className="font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Planification des rappels
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email-reminder">Rappel par email</Label>
                <Select defaultValue="24">
                  <SelectTrigger id="email-reminder">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="48">48 heures avant</SelectItem>
                    <SelectItem value="24">24 heures avant</SelectItem>
                    <SelectItem value="12">12 heures avant</SelectItem>
                    <SelectItem value="6">6 heures avant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sms-reminder">Rappel par SMS</Label>
                <Select defaultValue="2">
                  <SelectTrigger id="sms-reminder">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24">24 heures avant</SelectItem>
                    <SelectItem value="12">12 heures avant</SelectItem>
                    <SelectItem value="4">4 heures avant</SelectItem>
                    <SelectItem value="2">2 heures avant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="space-y-3 pt-2">
            <h3 className="font-medium flex items-center">
              <Send className="h-4 w-4 mr-2" />
              Personnaliser les messages
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="email-template">Template d'email (confirmation)</Label>
              <Textarea 
                id="email-template" 
                rows={4}
                defaultValue="Bonjour {client_name},

Votre rendez-vous a été confirmé pour le {date} à {heure} pour un service de {service} avec {stylist}.

À bientôt chez {salon_name} !"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sms-template">Template SMS (rappel)</Label>
              <Textarea 
                id="sms-template" 
                rows={3}
                defaultValue="Rappel: Votre rdv chez {salon_name} est demain à {heure} pour {service}. Pour modifier, appelez le {salon_phone}."
              />
            </div>
          </div>
          
          <div className="space-y-3 pt-2">
            <h3 className="font-medium flex items-center">
              <BellRing className="h-4 w-4 mr-2" />
              Notifications pour le salon
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="staff-email">Email du personnel (pour les notifications)</Label>
              <Input 
                id="staff-email" 
                placeholder="staff@votresalon.fr"
                defaultValue="staff@votresalon.fr"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="staff-phone">Téléphone du salon (pour les notifications SMS)</Label>
              <Input 
                id="staff-phone" 
                placeholder="+33123456789"
                defaultValue="+33123456789"
              />
            </div>
            
            <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Notification de nouvelle réservation</p>
                  <p className="text-sm text-muted-foreground">Alerter le salon à chaque nouvelle réservation</p>
                </div>
              </div>
              <Toggle defaultPressed aria-label="Activer la notification de nouvelle réservation" />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline">Réinitialiser</Button>
            <Button>Enregistrer les modifications</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsSettings;
