
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Users } from "lucide-react";

const SubscriptionPlans: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Plans d'abonnement</h2>
        <p className="text-muted-foreground mt-2">
          Choisissez le plan qui correspond le mieux aux besoins de vos adhérents
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Free Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Gratuit</CardTitle>
            <CardDescription>Pour les utilisateurs occasionnels</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">0€</span>
              <span className="text-muted-foreground">/mois</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span>Accès au catalogue</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span>2 livres maximum</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span>Durée d'emprunt: 14 jours</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span>Accès à la salle de lecture</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Activer
            </Button>
          </CardFooter>
        </Card>

        {/* Basic Plan */}
        <Card className="border-primary">
          <CardHeader>
            <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full w-fit mb-2">
              Populaire
            </div>
            <CardTitle>Basique</CardTitle>
            <CardDescription>Pour les lecteurs réguliers</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">5€</span>
              <span className="text-muted-foreground">/mois</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span>Tout du plan Gratuit</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span>5 livres maximum</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span>Durée d'emprunt: 21 jours</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span>Réservation de livres</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span>Accès aux événements</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <CreditCard className="h-4 w-4 mr-2" />
              Configurer
            </Button>
          </CardFooter>
        </Card>

        {/* Premium Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Premium</CardTitle>
            <CardDescription>Pour les passionnés de lecture</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">10€</span>
              <span className="text-muted-foreground">/mois</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span>Tout du plan Basique</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span>10 livres maximum</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span>Durée d'emprunt: 30 jours</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span>Accès aux e-books</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span>Livraison à domicile</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span>Invitations exclusives</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Configurer
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-10 bg-slate-50 p-6 rounded-lg border">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-primary mr-3" />
            <div>
              <h3 className="text-lg font-medium">Plan Groupe</h3>
              <p className="text-muted-foreground">Pour les écoles, entreprises et organisations</p>
            </div>
          </div>
          <Button>Contactez-nous</Button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
