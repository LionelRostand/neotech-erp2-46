
import React from 'react';
import { Container } from '@/types/freight';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContainerEditFormProps {
  container: Container;
  onChange: (field: keyof Container, value: string) => void;
}

const ContainerEditForm: React.FC<ContainerEditFormProps> = ({
  container,
  onChange
}) => {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="number">Numéro</Label>
        <Input
          id="number"
          value={container.number}
          onChange={(e) => onChange('number', e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="type">Type</Label>
        <Input
          id="type"
          value={container.type}
          onChange={(e) => onChange('type', e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="client">Client</Label>
        <Input
          id="client"
          value={container.client}
          onChange={(e) => onChange('client', e.target.value)}
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
        <Label htmlFor="origin">Origine</Label>
        <Input
          id="origin"
          value={container.origin}
          onChange={(e) => onChange('origin', e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="destination">Destination</Label>
        <Input
          id="destination"
          value={container.destination}
          onChange={(e) => onChange('destination', e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="departure">Date de départ</Label>
        <Input
          id="departure"
          type="date"
          value={container.departure}
          onChange={(e) => onChange('departure', e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="arrival">Date d'arrivée</Label>
        <Input
          id="arrival"
          type="date"
          value={container.arrival}
          onChange={(e) => onChange('arrival', e.target.value)}
        />
      </div>
    </div>
  );
};

export default ContainerEditForm;
