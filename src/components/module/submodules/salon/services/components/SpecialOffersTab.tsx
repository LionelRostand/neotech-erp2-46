
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Calendar, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SpecialOffersTab: React.FC = () => {
  const { toast } = useToast();
  
  const specialOffers = [
    {
      id: "offer1",
      name: "Offre étudiante",
      description: "20% de réduction sur toutes les prestations pour les étudiants sur présentation de leur carte.",
      discount: 20,
      validUntil: "2023-12-31",
      conditions: "Valable du lundi au jeudi uniquement.",
      isActive: true
    },
    {
      id: "offer2",
      name: "Happy Hour",
      description: "15% de réduction sur toutes les prestations entre 10h et 12h.",
      discount: 15,
      validUntil: "2023-10-31",
      conditions: "Uniquement sur rendez-vous pris plus de 24h à l'avance.",
      isActive: true
    },
    {
      id: "offer3",
      name: "Offre de fidélité",
      description: "Après 5 visites, bénéficiez d'un soin capillaire offert avec votre prochaine prestation.",
      discount: 0,
      validUntil: "2023-12-31",
      conditions: "Soin d'une valeur maximum de 25€. Non cumulable avec d'autres offres.",
      isActive: true
    },
    {
      id: "offer4",
      name: "Promotion anniversaire",
      description: "30% de réduction sur une prestation au choix le mois de votre anniversaire.",
      discount: 30,
      validUntil: "2023-12-31",
      conditions: "Sur présentation d'une pièce d'identité. Non cumulable avec d'autres offres.",
      isActive: false
    }
  ];

  const handleActiveToggle = (offerId: string) => {
    toast({
      title: "Fonctionnalité à venir",
      description: "La gestion des offres sera disponible prochainement"
    });
  };

  const handleEditOffer = (offerId: string) => {
    toast({
      title: "Fonctionnalité à venir",
      description: "La modification des offres sera disponible prochainement"
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {specialOffers.map((offer) => (
        <Card key={offer.id} className={!offer.isActive ? "opacity-70" : ""}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle>{offer.name}</CardTitle>
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                </div>
                <CardDescription className="mt-1">
                  {offer.description}
                </CardDescription>
              </div>
              <Badge variant={offer.isActive ? "default" : "outline"}>
                {offer.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {offer.discount > 0 && (
                <div className="text-lg font-bold">
                  -{offer.discount}%
                </div>
              )}
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                Valable jusqu'au {new Date(offer.validUntil).toLocaleDateString('fr-FR')}
              </div>
              <div className="flex items-start text-sm">
                <AlertCircle className="h-4 w-4 mr-1 mt-0.5 text-muted-foreground" />
                <span className="text-muted-foreground">{offer.conditions}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleActiveToggle(offer.id)}
            >
              {offer.isActive ? "Désactiver" : "Activer"}
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={() => handleEditOffer(offer.id)}
            >
              Modifier
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default SpecialOffersTab;
