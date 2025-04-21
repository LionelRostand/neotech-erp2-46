
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

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
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const refTrimmed = reference.trim();
    
    if (refTrimmed.length < 3) {
      toast({
        title: "Référence trop courte",
        description: "Veuillez saisir au moins 3 caractères.",
        variant: "destructive",
      });
      return;
    }
    
    onResult(refTrimmed);
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
          Entrez un numéro de référence pour suivre un colis, conteneur ou expédition
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
        <Card className="bg-slate-50">
          <CardContent className="p-3 text-xs">
            <h4 className="font-medium mb-1">Types de référence acceptés:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Numéro de colis (ex: TRK123456)</li>
              <li>Numéro de conteneur (ex: CONT789012)</li>
              <li>Référence d'expédition (ex: SHP456789)</li>
              <li>ID interne (inclus dans la recherche)</li>
            </ul>
            <p className="mt-2 italic">La recherche est insensible à la casse et aux espaces.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UnifiedTrackingSearch;
