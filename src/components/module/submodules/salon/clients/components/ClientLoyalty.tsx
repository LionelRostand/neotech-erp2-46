
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from '@/hooks/use-toast';
import { Heart, Gift, Award } from "lucide-react";

interface ClientLoyaltyProps {
  loyaltyPoints: number;
  clientId: string;
  onPointsUpdated: (newPoints: number) => void;
}

const ClientLoyalty: React.FC<ClientLoyaltyProps> = ({ 
  loyaltyPoints, 
  clientId, 
  onPointsUpdated 
}) => {
  const { toast } = useToast();
  const [pointsToAdd, setPointsToAdd] = useState("");
  const nextRewardAt = 100;
  const progress = (loyaltyPoints % nextRewardAt) / nextRewardAt * 100;

  const handleAddPoints = () => {
    const points = parseInt(pointsToAdd);
    if (isNaN(points) || points <= 0) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un nombre de points valide",
        variant: "destructive"
      });
      return;
    }

    onPointsUpdated(loyaltyPoints + points);
    setPointsToAdd("");
    
    toast({
      title: "Points ajoutés",
      description: `${points} points ont été ajoutés au compte fidélité`
    });
  };

  const handleUseReward = () => {
    if (loyaltyPoints < nextRewardAt) {
      toast({
        title: "Points insuffisants",
        description: `Le client doit avoir au moins ${nextRewardAt} points pour utiliser une récompense`,
        variant: "destructive"
      });
      return;
    }

    onPointsUpdated(loyaltyPoints - nextRewardAt);
    
    toast({
      title: "Récompense utilisée",
      description: `${nextRewardAt} points ont été échangés contre une récompense`
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-xl">
            <Heart className="mr-2 h-5 w-5 text-red-500" />
            Programme de fidélité
          </CardTitle>
          <CardDescription>
            Gérez les points fidélité et les récompenses du client
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Progression vers la prochaine récompense</span>
                <span className="text-sm font-medium">{loyaltyPoints % nextRewardAt} / {nextRewardAt}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            <div className="flex items-center justify-between py-4 border-t">
              <div>
                <div className="text-2xl font-bold">{loyaltyPoints}</div>
                <div className="text-sm text-muted-foreground">Points totaux</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{Math.floor(loyaltyPoints / nextRewardAt)}</div>
                <div className="text-sm text-muted-foreground">Récompenses disponibles</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="Points à ajouter"
                    value={pointsToAdd}
                    onChange={(e) => setPointsToAdd(e.target.value)}
                  />
                  <Button onClick={handleAddPoints}>
                    <Award className="mr-2 h-4 w-4" />
                    Ajouter
                  </Button>
                </div>
              </div>
              
              <Button 
                variant={Math.floor(loyaltyPoints / nextRewardAt) > 0 ? "default" : "outline"}
                disabled={Math.floor(loyaltyPoints / nextRewardAt) === 0}
                onClick={handleUseReward}
              >
                <Gift className="mr-2 h-4 w-4" />
                Utiliser une récompense
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Historique des points</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loyaltyPoints > 0 ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <div className="font-medium">Visite initiale</div>
                    <div className="text-sm text-muted-foreground">03/01/2023</div>
                  </div>
                  <div className="text-green-600 font-medium">+10 points</div>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <div className="font-medium">Coupe et couleur</div>
                    <div className="text-sm text-muted-foreground">15/02/2023</div>
                  </div>
                  <div className="text-green-600 font-medium">+15 points</div>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <div className="font-medium">Achat de produits</div>
                    <div className="text-sm text-muted-foreground">28/03/2023</div>
                  </div>
                  <div className="text-green-600 font-medium">+5 points</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Aucun historique de points pour ce client
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientLoyalty;
