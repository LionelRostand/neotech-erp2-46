
import React from 'react';
import { Button } from "@/components/ui/button";
import { MemberWithLoans } from '../types/library-types';
import { CreditCard, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface MemberSubscriptionInfoProps {
  member: MemberWithLoans;
}

const MemberSubscriptionInfo: React.FC<MemberSubscriptionInfoProps> = ({ member }) => {
  // Fake subscription data (would come from the backend in a real app)
  const getSubscriptionInfo = () => {
    switch (member.subscriptionType) {
      case 'free':
        return {
          name: 'Abonnement Gratuit',
          price: 'Gratuit',
          renewalDate: '—',
          maxLoans: 2,
          maxLoanDays: 14,
          features: [
            'Accès au catalogue', 
            'Emprunt de 2 livres maximum', 
            'Durée d\'emprunt: 14 jours'
          ]
        };
      case 'basic':
        return {
          name: 'Abonnement Basique',
          price: '5€ / mois',
          renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          maxLoans: 5,
          maxLoanDays: 21,
          features: [
            'Accès au catalogue', 
            'Emprunt de 5 livres maximum', 
            'Durée d\'emprunt: 21 jours', 
            'Réservation de livres'
          ]
        };
      case 'premium':
        return {
          name: 'Abonnement Premium',
          price: '10€ / mois',
          renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          maxLoans: 10,
          maxLoanDays: 30,
          features: [
            'Accès au catalogue', 
            'Emprunt de 10 livres maximum', 
            'Durée d\'emprunt: 30 jours', 
            'Réservation de livres', 
            'Accès aux e-books', 
            'Livraison à domicile'
          ]
        };
      default:
        return {
          name: 'Abonnement Inconnu',
          price: '—',
          renewalDate: '—',
          maxLoans: 0,
          maxLoanDays: 0,
          features: []
        };
    }
  };

  const subscription = getSubscriptionInfo();
  const isActive = member.status === 'active';

  const getStatusIcon = () => {
    if (member.status === 'active') return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (member.status === 'pending') return <Clock className="h-5 w-5 text-amber-600" />;
    return <AlertTriangle className="h-5 w-5 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-md p-4 bg-slate-50 flex items-start justify-between">
        <div>
          <h3 className="font-medium text-lg">{subscription.name}</h3>
          <p className="text-sm text-muted-foreground">{subscription.price}</p>
          
          <div className="flex items-center mt-2">
            {getStatusIcon()}
            <span className="ml-2 text-sm font-medium">
              {member.status === 'active' && 'Abonnement actif'}
              {member.status === 'pending' && 'Paiement en attente'}
              {member.status === 'expired' && 'Abonnement expiré'}
              {member.status === 'suspended' && 'Abonnement suspendu'}
            </span>
          </div>
          
          {subscription.renewalDate !== '—' && (
            <p className="text-xs text-muted-foreground mt-1">
              Renouvellement le: {new Date(subscription.renewalDate).toLocaleDateString('fr-FR')}
            </p>
          )}
        </div>
        
        <Button disabled={!isActive} size="sm">
          <CreditCard className="h-4 w-4 mr-1" />
          Gérer
        </Button>
      </div>
      
      <div>
        <h4 className="font-medium mb-2">Détails de l'abonnement</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {subscription.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>
      
      <div className="border rounded-md p-4 bg-slate-50">
        <h4 className="font-medium mb-2">Historique des paiements</h4>
        {member.subscriptionType !== 'free' ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Montant</th>
                <th className="text-left py-2">Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2">{new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}</td>
                <td className="py-2">{member.subscriptionType === 'premium' ? '10€' : '5€'}</td>
                <td className="py-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Payé
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-2">{new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}</td>
                <td className="py-2">{member.subscriptionType === 'premium' ? '10€' : '5€'}</td>
                <td className="py-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Payé
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-muted-foreground">Aucun paiement pour l'abonnement gratuit.</p>
        )}
      </div>
    </div>
  );
};

export default MemberSubscriptionInfo;
