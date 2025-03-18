
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { SunMedium, Clock, Calendar, Flag, Settings } from 'lucide-react';

export const LeavePolicies: React.FC = () => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Politiques de congés</h3>
      <p className="text-gray-500 mb-6">
        Consultez les règles et politiques en vigueur concernant les différents types de congés
      </p>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="conges-payes">
          <AccordionTrigger className="flex items-center">
            <div className="flex items-center">
              <SunMedium className="h-5 w-5 mr-2 text-blue-500" />
              Congés payés
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pl-7 space-y-2 text-sm text-gray-600">
              <p>Les congés payés sont accordés à raison de 2,5 jours ouvrables par mois travaillé, soit 30 jours ouvrables (5 semaines) pour une année complète.</p>
              <p>Période de référence : du 1er juin au 31 mai de l'année suivante.</p>
              <p>Délai de prévenance : 30 jours pour les congés d'été, 15 jours pour les autres périodes.</p>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="rtt">
          <AccordionTrigger className="flex items-center">
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-amber-500" />
              RTT (Réduction du Temps de Travail)
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pl-7 space-y-2 text-sm text-gray-600">
              <p>Les jours de RTT sont attribués en compensation d'un horaire de travail supérieur à 35 heures par semaine.</p>
              <p>Nombre de jours accordés : 12 jours par an.</p>
              <p>Utilisation : à la discrétion du salarié, sous réserve d'un délai de prévenance de 7 jours.</p>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="maladie">
          <AccordionTrigger className="flex items-center">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-red-500" />
              Arrêts maladie
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pl-7 space-y-2 text-sm text-gray-600">
              <p>En cas de maladie, le salarié doit informer l'employeur dans les 24 heures et fournir un certificat médical dans les 48 heures.</p>
              <p>Maintien de salaire : selon la convention collective, après un an d'ancienneté.</p>
              <p>Les trois premiers jours peuvent constituer un délai de carence selon la politique de l'entreprise.</p>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="conges-speciaux">
          <AccordionTrigger className="flex items-center">
            <div className="flex items-center">
              <Flag className="h-5 w-5 mr-2 text-green-500" />
              Congés spéciaux
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pl-7 space-y-2 text-sm text-gray-600">
              <p>Mariage du salarié : 4 jours ouvrables</p>
              <p>Mariage d'un enfant : 1 jour ouvrable</p>
              <p>Naissance ou adoption : 3 jours ouvrables</p>
              <p>Décès du conjoint ou d'un enfant : 3 jours ouvrables</p>
              <p>Décès du père ou de la mère : 3 jours ouvrables</p>
              <p>Décès d'un frère ou d'une sœur : 3 jours ouvrables</p>
              <p>Décès des beaux-parents : 3 jours ouvrables</p>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="autres">
          <AccordionTrigger className="flex items-center">
            <div className="flex items-center">
              <Settings className="h-5 w-5 mr-2 text-gray-500" />
              Autres congés
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pl-7 space-y-2 text-sm text-gray-600">
              <p>Congé parental d'éducation : jusqu'aux 3 ans de l'enfant</p>
              <p>Congé de formation : selon les accords d'entreprise</p>
              <p>Congé sans solde : à la discrétion de l'employeur</p>
              <p>Congé sabbatique : après 36 mois d'ancienneté, pour une durée de 6 à 11 mois</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
