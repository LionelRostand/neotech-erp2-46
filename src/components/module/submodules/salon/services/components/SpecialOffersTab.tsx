
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Calendar, AlertCircle, Eye, Edit, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EditOfferDialog from './EditOfferDialog';
import OfferDetailsDialog from './OfferDetailsDialog';
import DeleteOfferDialog from './DeleteOfferDialog';

interface SpecialOffer {
  id: string;
  name: string;
  description: string;
  discount: number;
  validUntil: string;
  conditions: string;
  isActive: boolean;
}

const SpecialOffersTab: React.FC = () => {
  const { toast } = useToast();
  
  const [specialOffers, setSpecialOffers] = useState<SpecialOffer[]>([
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
  ]);
  
  const [selectedOffer, setSelectedOffer] = useState<SpecialOffer | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleActiveToggle = (offerId: string) => {
    setSpecialOffers(prevOffers => 
      prevOffers.map(offer => 
        offer.id === offerId 
          ? { ...offer, isActive: !offer.isActive } 
          : offer
      )
    );
    
    const offer = specialOffers.find(o => o.id === offerId);
    toast({
      title: offer?.isActive ? "Offre désactivée" : "Offre activée",
      description: `L'offre "${offer?.name}" a été ${offer?.isActive ? "désactivée" : "activée"} avec succès.`
    });
  };

  const handleViewOffer = (offer: SpecialOffer) => {
    setSelectedOffer(offer);
    setDetailsOpen(true);
  };

  const handleEditOffer = (offer: SpecialOffer) => {
    setSelectedOffer(offer);
    setEditOpen(true);
  };

  const handleDeleteOffer = (offer: SpecialOffer) => {
    setSelectedOffer(offer);
    setDeleteOpen(true);
  };

  const handleOfferUpdated = (updatedOffer: SpecialOffer) => {
    setSpecialOffers(prevOffers => 
      prevOffers.map(offer => 
        offer.id === updatedOffer.id ? updatedOffer : offer
      )
    );
    
    toast({
      title: "Offre mise à jour",
      description: `L'offre "${updatedOffer.name}" a été mise à jour avec succès.`
    });
  };

  const handleOfferDeleted = (offerId: string) => {
    setSpecialOffers(prevOffers => 
      prevOffers.filter(offer => offer.id !== offerId)
    );
    
    toast({
      title: "Offre supprimée",
      description: "L'offre a été supprimée avec succès."
    });
  };

  return (
    <>
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
              
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleViewOffer(offer)}
                  title="Voir les détails"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleEditOffer(offer)}
                  title="Modifier"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleDeleteOffer(offer)}
                  title="Supprimer"
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedOffer && (
        <>
          <OfferDetailsDialog 
            open={detailsOpen} 
            onOpenChange={setDetailsOpen} 
            offer={selectedOffer} 
          />
          
          <EditOfferDialog 
            open={editOpen} 
            onOpenChange={setEditOpen} 
            offer={selectedOffer} 
            onUpdate={handleOfferUpdated}
          />
          
          <DeleteOfferDialog 
            open={deleteOpen} 
            onOpenChange={setDeleteOpen} 
            offer={selectedOffer} 
            onDelete={() => handleOfferDeleted(selectedOffer.id)}
          />
        </>
      )}
    </>
  );
};

export default SpecialOffersTab;
