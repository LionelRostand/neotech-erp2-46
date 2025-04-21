
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, Info } from 'lucide-react';

interface UnifiedTrackingSearchProps {
  onResult: (ref: string) => void;
  isLoading: boolean;
  lastQuery?: string;
}

const UnifiedTrackingSearch: React.FC<UnifiedTrackingSearchProps> = ({
  onResult,
  isLoading,
  lastQuery,
}) => {
  const [reference, setReference] = useState("");
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reference.trim()) {
      onResult(reference.trim());
    }
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder="Numéro de référence colis, conteneur ou expédition..."
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          disabled={isLoading}
          className="flex-1"
        />
        <Button disabled={isLoading || reference.trim().length < 3} type="submit">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          Suivre
        </Button>
      </form>
      
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          Types de référence acceptés : CT-XXXX-XXXX (conteneur) ou EXPXXXXX (expédition)
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowHint(!showHint)}
          className="h-6 px-2"
        >
          <Info className="h-3 w-3 mr-1" />
          <span className="text-xs">Aide</span>
        </Button>
      </div>
      
      {showHint && (
        <div className="bg-muted/50 p-3 rounded-lg text-sm space-y-2">
          <h4 className="font-medium">Formats de référence acceptés :</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Numéro de conteneur (ex: CT-2025-3179)</li>
            <li>Référence d'expédition (ex: EXP31854)</li>
          </ul>
          <p className="text-xs text-muted-foreground italic">
            La recherche est insensible à la casse et aux espaces
          </p>
        </div>
      )}
    </div>
  );
};

export default UnifiedTrackingSearch;
