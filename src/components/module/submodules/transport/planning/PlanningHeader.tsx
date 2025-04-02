
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Download, Filter, Plus } from 'lucide-react';

const PlanningHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold">Planning des transports</h2>
        <p className="text-muted-foreground">
          Gérez les plannings des véhicules, des chauffeurs et des maintenances
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Filter size={14} />
          <span>Filtres</span>
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Calendar size={14} />
          <span>Calendrier</span>
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Download size={14} />
          <span>Exporter</span>
        </Button>
        <Button size="sm" className="flex items-center gap-1">
          <Plus size={14} />
          <span>Nouvelle entrée</span>
        </Button>
      </div>
    </div>
  );
};

export default PlanningHeader;
