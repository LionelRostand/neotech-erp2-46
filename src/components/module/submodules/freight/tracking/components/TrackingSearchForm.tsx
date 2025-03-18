
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TrackingSearchFormProps {
  onSearch: (trackingNumber: string) => void;
  isLoading: boolean;
}

const TrackingSearchForm: React.FC<TrackingSearchFormProps> = ({ onSearch, isLoading }) => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingNumber) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un numéro de référence.",
        variant: "destructive"
      });
      return;
    }
    
    onSearch(trackingNumber);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        placeholder="Entrez le numéro de référence"
        value={trackingNumber}
        onChange={(e) => setTrackingNumber(e.target.value)}
      />
      <Button 
        type="submit"
        disabled={isLoading}
        className="whitespace-nowrap"
      >
        {isLoading ? "Recherche..." : "Suivre le colis"}
        <Search className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
};

export default TrackingSearchForm;
