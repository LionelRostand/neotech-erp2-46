
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FreightPackages from './FreightPackages';

const FreightShipmentsPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleCreateClick = () => {
    navigate('/modules/freight/create-shipment');
  };
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestion des Colis</h1>
          <p className="text-muted-foreground">Gérez tous vos colis et suivez leur statut</p>
        </div>
        {/* Removed duplicate button */}
      </div>
      
      <FreightPackages />
    </div>
  );
};

export default FreightShipmentsPage;
