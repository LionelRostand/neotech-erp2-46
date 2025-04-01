
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';

interface TrackingSearchFormProps {
  onSearch: (trackingNumber: string) => void;
  isLoading: boolean;
}

const TrackingSearchForm: React.FC<TrackingSearchFormProps> = ({ onSearch, isLoading }) => {
  const [trackingNumber, setTrackingNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      onSearch(trackingNumber.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        placeholder="Entrez votre numéro de suivi"
        value={trackingNumber}
        onChange={(e) => setTrackingNumber(e.target.value)}
        disabled={isLoading}
        className="flex-1"
      />
      <Button disabled={isLoading || !trackingNumber.trim()} type="submit">
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Search className="mr-2 h-4 w-4" />
        )}
        Suivre
      </Button>
    </form>
  );
};

export default TrackingSearchForm;
