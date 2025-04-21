
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UnifiedTrackingSearchProps {
  onResult: (ref: string) => void;
  isLoading: boolean;
}

const UnifiedTrackingSearch: React.FC<UnifiedTrackingSearchProps> = ({
  onResult,
  isLoading,
}) => {
  const [reference, setReference] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reference.trim().length < 4) {
      toast({
        title: "Référence trop courte",
        description: "Veuillez saisir au moins 4 caractères.",
        variant: "destructive",
      });
      return;
    }
    onResult(reference.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        placeholder="Numéro de référence colis ou conteneur..."
        value={reference}
        onChange={(e) => setReference(e.target.value)}
        disabled={isLoading}
        className="flex-1"
      />
      <Button disabled={isLoading || reference.trim().length < 4} type="submit">
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

export default UnifiedTrackingSearch;
