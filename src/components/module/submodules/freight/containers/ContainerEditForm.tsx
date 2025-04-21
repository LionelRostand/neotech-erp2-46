
import React from 'react';
import { Container } from '@/types/freight';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ContainerEditFormProps {
  container: Container;
  onChange: (field: keyof Container, value: string) => void;
  transporteurs?: any[];
  clients?: any[];
  routes?: any[];
}

const ContainerEditForm: React.FC<ContainerEditFormProps> = ({
  container,
  onChange,
  transporteurs = [],
  clients = [],
  routes = [],
}) => {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="number">Référence</Label>
        <Input
          id="number"
          value={container.number}
          onChange={(e) => onChange('number', e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="type">Type</Label>
        <Select 
          value={container.type} 
          onValueChange={(value) => onChange('type', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="20_standard">20' Standard</SelectItem>
            <SelectItem value="40_standard">40' Standard</SelectItem>
            <SelectItem value="40_high_cube">40' High Cube</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="size">Taille</Label>
        <Input
          id="size"
          placeholder="Sélectionner un type"
          value={container.size}
          onChange={(e) => onChange('size', e.target.value)}
          disabled
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="status">Statut</Label>
        <Input
          id="status"
          value={container.status}
          onChange={(e) => onChange('status', e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="carrierName">Transporteur</Label>
        <Select 
          value={container.carrierName} 
          onValueChange={(value) => onChange('carrierName', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner" />
          </SelectTrigger>
          <SelectContent>
            {transporteurs.map((t) => (
              <SelectItem key={t.id} value={t.name}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="origin">Origine</Label>
        <Input
          id="origin"
          placeholder="Rempli via la route"
          value={container.origin}
          onChange={(e) => onChange('origin', e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="destination">Destination</Label>
        <Input
          id="destination"
          placeholder="Rempli via la route"
          value={container.destination}
          onChange={(e) => onChange('destination', e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="departure">Date départ</Label>
        <Input
          id="departure"
          type="date"
          value={container.departure || ''}
          onChange={(e) => onChange('departure', e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="arrival">Date arrivée</Label>
        <Input
          id="arrival"
          type="date"
          value={container.arrival || ''}
          onChange={(e) => onChange('arrival', e.target.value)}
        />
      </div>
    </div>
  );
};

export default ContainerEditForm;
