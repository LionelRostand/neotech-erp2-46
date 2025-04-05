
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const FilterDropdown = () => {
  return (
    <Card className="mb-4">
      <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="client">Client</Label>
          <Input id="client" placeholder="Rechercher un client" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select defaultValue="all">
            <SelectTrigger id="status">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="confirmed">Confirmé</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="completed">Terminé</SelectItem>
              <SelectItem value="cancelled">Annulé</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="driver">Chauffeur</Label>
          <Input id="driver" placeholder="Rechercher un chauffeur" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="vehicle">Véhicule</Label>
          <Input id="vehicle" placeholder="Rechercher un véhicule" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="payment">Paiement</Label>
          <Select defaultValue="all">
            <SelectTrigger id="payment">
              <SelectValue placeholder="Tous les paiements" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="paid">Payé</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="unpaid">Non payé</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="col-span-1 md:col-span-3 flex justify-end gap-2 mt-2">
          <Button variant="outline">Réinitialiser</Button>
          <Button>Appliquer les filtres</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterDropdown;
