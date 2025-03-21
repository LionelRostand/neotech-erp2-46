
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Toggle } from '@/components/ui/toggle';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Calendar, Clock, DollarSign, Link, Settings, Users } from 'lucide-react';

const BookingConfiguration = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Configuration de la réservation</CardTitle>
              <CardDescription>Paramétrez le système de réservation en ligne</CardDescription>
            </div>
            <Toggle defaultPressed aria-label="Activer la réservation en ligne">Activé</Toggle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="booking-window">Fenêtre de réservation (jours)</Label>
              </div>
              <Select defaultValue="30">
                <SelectTrigger id="booking-window">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 jours</SelectItem>
                  <SelectItem value="14">14 jours</SelectItem>
                  <SelectItem value="30">30 jours</SelectItem>
                  <SelectItem value="60">60 jours</SelectItem>
                  <SelectItem value="90">90 jours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="min-advance">Préavis minimum (heures)</Label>
              </div>
              <Select defaultValue="24">
                <SelectTrigger id="min-advance">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 heure</SelectItem>
                  <SelectItem value="3">3 heures</SelectItem>
                  <SelectItem value="12">12 heures</SelectItem>
                  <SelectItem value="24">24 heures</SelectItem>
                  <SelectItem value="48">48 heures</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <Label>Sélection du coiffeur</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Toggle defaultPressed aria-label="Permettre la sélection du coiffeur" />
              <span className="text-sm">Permettre aux clients de choisir leur coiffeur</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <Label>Acompte à la réservation</Label>
            </div>
            <div className="flex flex-col space-y-2">
              <Toggle aria-label="Exiger un acompte" />
              <div className="flex items-center space-x-4 pt-2 pl-2">
                <Label htmlFor="deposit-amount" className="text-sm w-20">Montant (%)</Label>
                <Slider
                  id="deposit-amount"
                  defaultValue={[30]}
                  max={100}
                  step={5}
                  disabled
                  className="w-48"
                />
                <span className="text-sm w-8">30%</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Link className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="booking-url">URL de réservation</Label>
            </div>
            <div className="flex space-x-2">
              <Input 
                id="booking-url" 
                placeholder="votre-salon"
                value="votre-salon" 
                className="flex-1" 
              />
              <div className="flex items-center bg-muted px-3 rounded-md text-sm text-muted-foreground">
                .reservations.com
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline">Réinitialiser</Button>
            <Button>Enregistrer les modifications</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Options avancées</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Autoriser les annulations</p>
                <p className="text-sm text-muted-foreground">Permettre aux clients d'annuler leurs rendez-vous</p>
              </div>
              <Toggle defaultPressed aria-label="Autoriser les annulations" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Confirmation manuelle</p>
                <p className="text-sm text-muted-foreground">Approuver manuellement les rendez-vous</p>
              </div>
              <Toggle aria-label="Confirmation manuelle" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Réservations multiples</p>
                <p className="text-sm text-muted-foreground">Permettre plusieurs services par réservation</p>
              </div>
              <Toggle defaultPressed aria-label="Réservations multiples" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Gestion des temps morts</p>
                <p className="text-sm text-muted-foreground">Définir des plages horaires entre les rendez-vous</p>
              </div>
              <Toggle defaultPressed aria-label="Gestion des temps morts" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingConfiguration;
