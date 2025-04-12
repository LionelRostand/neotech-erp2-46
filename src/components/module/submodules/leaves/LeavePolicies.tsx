
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';

export const LeavePolicies: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Politiques de congés</h3>
          <p className="text-sm text-gray-500">Règles et informations relatives aux congés dans l'entreprise</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Télécharger PDF
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Congés légaux et conventionnels</CardTitle>
          <CardDescription>Informations sur les différents types de congés</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="conges-payes">
              <AccordionTrigger>Congés payés</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-sm">
                  <p>Chaque salarié a droit à 2,5 jours ouvrables de congés payés par mois de travail effectif, soit 30 jours ouvrables (5 semaines) pour une année complète de travail.</p>
                  <p>Période de prise des congés : du 1er mai au 31 octobre (période légale) mais possibilité de prendre ses congés toute l'année selon accord du manager.</p>
                  <p>La demande doit être effectuée au moins 30 jours à l'avance pour les congés d'été, et 15 jours pour les autres périodes.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="rtt">
              <AccordionTrigger>RTT (Réduction du Temps de Travail)</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-sm">
                  <p>Les jours de RTT sont attribués aux salariés dont la durée de travail est supérieure à 35 heures par semaine, en compensation des heures effectuées au-delà de cette durée légale.</p>
                  <p>Pour un salarié travaillant 39 heures par semaine, le nombre de jours de RTT est de 23 jours par an.</p>
                  <p>Pour un salarié travaillant 37 heures par semaine, le nombre de jours de RTT est de 12 jours par an.</p>
                  <p>Les RTT doivent être pris dans l'année civile de référence et ne peuvent pas être reportés d'une année sur l'autre.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="conges-exceptionnels">
              <AccordionTrigger>Congés exceptionnels</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Mariage ou PACS :</strong> 4 jours ouvrables</p>
                  <p><strong>Mariage d'un enfant :</strong> 1 jour ouvrable</p>
                  <p><strong>Naissance ou adoption :</strong> 3 jours ouvrables</p>
                  <p><strong>Décès du conjoint ou d'un enfant :</strong> 5 jours ouvrables</p>
                  <p><strong>Décès d'un parent :</strong> 3 jours ouvrables</p>
                  <p><strong>Décès d'un frère, sœur, beau-parent :</strong> 3 jours ouvrables</p>
                  <p><strong>Annonce d'un handicap chez un enfant :</strong> 2 jours ouvrables</p>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="conges-maternite">
              <AccordionTrigger>Congé maternité</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-sm">
                  <p>La durée du congé maternité varie selon le nombre d'enfants à naître et le nombre d'enfants déjà à charge :</p>
                  <p><strong>Premier ou deuxième enfant :</strong> 16 semaines (6 semaines avant la date présumée de l'accouchement et 10 semaines après)</p>
                  <p><strong>À partir du troisième enfant :</strong> 26 semaines (8 semaines avant et 18 semaines après)</p>
                  <p><strong>Jumeaux :</strong> 34 semaines (12 semaines avant et 22 semaines après)</p>
                  <p><strong>Triplés ou plus :</strong> 46 semaines (24 semaines avant et 22 semaines après)</p>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="conge-paternite">
              <AccordionTrigger>Congé paternité</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-sm">
                  <p>Le congé de paternité est de 25 jours calendaires (32 jours en cas de naissances multiples).</p>
                  <p>Il se compose de :</p>
                  <p>- 4 jours consécutifs obligatoires, pris immédiatement après le congé de naissance de 3 jours</p>
                  <p>- 21 jours (ou 28 jours) non obligatoires, à prendre dans les 6 mois suivant la naissance</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Procédure de demande de congés</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-blue-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FileText className="h-5 w-5 text-blue-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Processus en 4 étapes</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>L'employé soumet sa demande de congés via l'application.</li>
                    <li>Le manager reçoit une notification et peut approuver ou refuser.</li>
                    <li>L'employé reçoit une notification de l'approbation ou du refus.</li>
                    <li>Les congés approuvés sont automatiquement intégrés dans le calendrier de l'équipe.</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Délais de demande</h4>
            <ul className="space-y-1 text-sm">
              <li>• <strong>Congés été (juillet/août) :</strong> au moins 3 mois à l'avance</li>
              <li>• <strong>Congés > 1 semaine :</strong> au moins 30 jours à l'avance</li>
              <li>• <strong>Congés < 1 semaine :</strong> au moins 15 jours à l'avance</li>
              <li>• <strong>RTT :</strong> au moins 7 jours à l'avance</li>
              <li>• <strong>Congés exceptionnels :</strong> dès que possible</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
