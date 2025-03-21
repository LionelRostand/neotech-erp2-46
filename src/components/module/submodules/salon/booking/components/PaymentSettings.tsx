
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Toggle } from '@/components/ui/toggle';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CreditCard, LockKeyhole, Percent, Wallet } from 'lucide-react';

const PaymentSettings = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Paiement en ligne</CardTitle>
              <CardDescription>Configuration des méthodes de paiement</CardDescription>
            </div>
            <Toggle defaultPressed aria-label="Activer le paiement en ligne">Activé</Toggle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="payment-processor">Processeur de paiement</Label>
              </div>
              <Select defaultValue="stripe">
                <SelectTrigger id="payment-processor">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="adyen">Adyen</SelectItem>
                  <SelectItem value="square">Square</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <LockKeyhole className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="api-key">Clé API (cachée)</Label>
              </div>
              <Input 
                id="api-key" 
                type="password"
                value="sk_test_•••••••••••••••••••••••••"
                disabled
              />
              <p className="text-xs text-muted-foreground">Configurer dans les paramètres de sécurité</p>
            </div>
          </div>
          
          <div className="space-y-4 pt-2">
            <h3 className="font-medium">Méthodes de paiement acceptées</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 bg-muted/30 p-3 rounded-lg">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M2 10h18v6c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-6z"/><path d="M17.4 6a4 4 0 0 0-3.7-2.5H10c-1.9 0-3.3 1.3-3.7 2.5"/></svg>
                </div>
                <div className="flex-1">
                  <div className="font-medium">Cartes de crédit</div>
                  <div className="text-xs text-muted-foreground">Visa, Mastercard, AMEX</div>
                </div>
                <Toggle defaultPressed aria-label="Activer les cartes de crédit" />
              </div>
              
              <div className="flex items-center space-x-3 bg-muted/30 p-3 rounded-lg">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                </div>
                <div className="flex-1">
                  <div className="font-medium">Apple Pay</div>
                  <div className="text-xs text-muted-foreground">Paiement par appareil Apple</div>
                </div>
                <Toggle defaultPressed aria-label="Activer Apple Pay" />
              </div>
              
              <div className="flex items-center space-x-3 bg-muted/30 p-3 rounded-lg">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="20" height="14" x="2" y="5" rx="2"/><circle cx="6" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="18" cy="12" r="1"/></svg>
                </div>
                <div className="flex-1">
                  <div className="font-medium">Google Pay</div>
                  <div className="text-xs text-muted-foreground">Paiement par appareil Android</div>
                </div>
                <Toggle defaultPressed aria-label="Activer Google Pay" />
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <h3 className="font-medium mb-3">Options de paiement</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Percent className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Acompte obligatoire</p>
                    <p className="text-sm text-muted-foreground">Exiger un acompte à la réservation</p>
                  </div>
                </div>
                <Toggle aria-label="Exiger un acompte" />
              </div>
              
              <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Wallet className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Paiement sur place</p>
                    <p className="text-sm text-muted-foreground">Permettre le paiement en salon</p>
                  </div>
                </div>
                <Toggle defaultPressed aria-label="Permettre le paiement sur place" />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline">Annuler</Button>
            <Button>Sauvegarder</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSettings;
