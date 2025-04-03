
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const LeavePolicies: React.FC = () => {
  // Dans une application réelle, ces données viendraient de Firebase
  const policies = [
    {
      id: '1',
      title: 'Congés payés',
      summary: '25 jours par an pour tous les employés à temps plein',
      details: `
        Chaque employé à temps plein a droit à 25 jours de congés payés par année civile.
        Les congés sont acquis à raison de 2,08 jours par mois travaillé.
        Les demandes doivent être soumises au moins 2 semaines à l'avance.
        La période de référence s'étend du 1er janvier au 31 décembre.
        Les jours de congés non pris peuvent être reportés jusqu'au 31 mars de l'année suivante.
      `
    },
    {
      id: '2',
      title: 'RTT (Réduction du Temps de Travail)',
      summary: '12 jours par an pour les employés sur base 39h',
      details: `
        Les salariés travaillant 39h par semaine bénéficient de 12 jours de RTT par an.
        Les RTT sont acquis dès le début de l'année civile.
        50% des jours de RTT sont à la libre disposition du salarié, 50% sont fixés par l'employeur.
        Les RTT non pris au 31 décembre sont perdus sauf accord spécifique.
      `
    },
    {
      id: '3',
      title: 'Congés exceptionnels',
      summary: 'Accordés pour événements familiaux et personnels',
      details: `
        Mariage/PACS du salarié : 4 jours ouvrables
        Mariage d'un enfant : 1 jour ouvrable
        Naissance ou adoption : 3 jours ouvrables
        Décès du conjoint ou d'un enfant : 5 jours ouvrables
        Décès d'un parent : 3 jours ouvrables
        Décès d'un grand-parent, frère, sœur : 1 jour ouvrable
        Déménagement : 1 jour ouvrable par an
      `
    },
    {
      id: '4',
      title: 'Congés maladie',
      summary: 'Indemnisation selon ancienneté après 1 an',
      details: `
        Tout arrêt maladie doit être justifié par un certificat médical envoyé dans les 48h.
        Après 1 an d'ancienneté, maintien du salaire selon les conditions suivantes :
        - De 1 à 5 ans d'ancienneté : 30 jours à 90% puis 30 jours à 66%
        - De 6 à 10 ans d'ancienneté : 40 jours à 90% puis 40 jours à 66%
        - Plus de 10 ans d'ancienneté : 60 jours à 90% puis 60 jours à 66%
      `
    },
    {
      id: '5',
      title: 'Congés sans solde',
      summary: 'Possible après accord de la direction',
      details: `
        Les congés sans solde sont accordés à la discrétion de la direction.
        La demande doit être soumise au moins 1 mois à l'avance.
        La durée maximale est de 3 mois, renouvelable une fois.
        Pendant cette période, le contrat de travail est suspendu.
        L'employé ne perçoit pas de salaire et n'acquiert pas de congés payés.
        Le retour est garanti sur le même poste ou un poste équivalent.
      `
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Politiques de congés</h3>
        <p className="text-gray-600 mb-4">
          Consultez les différents types de congés et les règles associées
        </p>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        {policies.map((policy) => (
          <AccordionItem key={policy.id} value={policy.id}>
            <AccordionTrigger className="hover:bg-gray-50 px-4">
              <div className="text-left">
                <div className="font-medium">{policy.title}</div>
                <div className="text-sm text-gray-500">{policy.summary}</div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-2 pb-4 text-gray-700 whitespace-pre-line">
              {policy.details}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-6">
        <h4 className="text-blue-800 font-medium mb-2">Note importante</h4>
        <p className="text-blue-700 text-sm">
          Ces politiques sont susceptibles d'évoluer. Veuillez consulter le département RH pour toute question spécifique concernant vos droits à congés.
        </p>
      </div>
    </div>
  );
};
