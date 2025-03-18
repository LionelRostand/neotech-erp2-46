
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ExternalLink } from 'lucide-react';
import { Package } from '@/types/freight';
import { getPackageByTrackingNumber } from './mockTrackingData';
import { useToast } from '@/hooks/use-toast';

interface TrackingSearchProps {
  onPackageFound: (packageData: Package) => void;
}

const TrackingSearch: React.FC<TrackingSearchProps> = ({ onPackageFound }) => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingNumber.trim()) {
      toast({
        title: "Erreur de recherche",
        description: "Veuillez saisir un numéro de suivi.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSearching(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      const foundPackage = getPackageByTrackingNumber(trackingNumber);
      
      if (foundPackage) {
        toast({
          title: "Colis trouvé",
          description: `Référence: ${foundPackage.reference}`,
        });
        onPackageFound(foundPackage);
      } else {
        toast({
          title: "Aucun résultat",
          description: "Aucun colis trouvé avec ce numéro de suivi.",
          variant: "destructive",
        });
      }
      
      setIsSearching(false);
    }, 800);
  };

  // For demo purposes, suggest some valid tracking numbers from mock data
  const trackingHints = [
    'TRK123456789',
    'PKG987654321',
    'TRK202301001',
    'PKG202302002'
  ];

  return (
    <div className="space-y-6">
      <div className="max-w-xl mx-auto">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Saisissez le numéro de suivi"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit" disabled={isSearching}>
            {isSearching ? 'Recherche...' : 'Rechercher'}
          </Button>
        </form>
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>Nous suivons les colis de tous les transporteurs majeurs</p>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {['DHL', 'FedEx', 'UPS', 'La Poste', 'Chronopost', 'TNT'].map(carrier => (
            <div key={carrier} className="px-2 py-1 bg-gray-100 rounded text-xs">
              {carrier}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-xl mx-auto">
        <p className="text-sm text-gray-500 mb-2">Exemples de numéros de suivi (pour démonstration):</p>
        <div className="flex flex-wrap gap-2">
          {trackingHints.map(hint => (
            <Button 
              key={hint} 
              variant="outline" 
              size="sm"
              onClick={() => setTrackingNumber(hint)}
            >
              {hint}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-4 max-w-xl mx-auto">
        <div className="text-sm text-gray-500">
          <p className="mb-2">Vous pouvez également suivre votre colis directement sur le site du transporteur:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="justify-between">
              DHL <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
            <Button variant="outline" size="sm" className="justify-between">
              FedEx <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
            <Button variant="outline" size="sm" className="justify-between">
              UPS <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
            <Button variant="outline" size="sm" className="justify-between">
              La Poste <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingSearch;
