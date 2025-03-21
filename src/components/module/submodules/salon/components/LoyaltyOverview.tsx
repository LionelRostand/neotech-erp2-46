
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Award, Gift } from "lucide-react";

interface LoyaltyClient {
  name: string;
  points: number;
  status: 'gold' | 'silver' | 'bronze';
}

interface LoyaltyOverviewProps {
  totalClients: number;
  loyaltyProgramMembers: number;
  topLoyaltyClients: LoyaltyClient[];
}

const LoyaltyOverview: React.FC<LoyaltyOverviewProps> = ({ 
  totalClients,
  loyaltyProgramMembers,
  topLoyaltyClients = [
    { name: "Marie Dupont", points: 450, status: 'gold' },
    { name: "Jean Martin", points: 320, status: 'silver' },
    { name: "Sophie Laurent", points: 280, status: 'silver' }
  ]
}) => {
  const loyaltyPercentage = Math.round((loyaltyProgramMembers / totalClients) * 100);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'gold': return <Award className="h-4 w-4 text-yellow-500" />;
      case 'silver': return <Award className="h-4 w-4 text-gray-400" />;
      case 'bronze': return <Award className="h-4 w-4 text-amber-700" />;
      default: return <Heart className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          <span>Programme de Fidélité</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-pink-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500">Membres fidélité</p>
              <p className="text-2xl font-bold text-pink-600">{loyaltyProgramMembers}</p>
              <p className="text-xs text-gray-500">{loyaltyPercentage}% des clients</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500">Points attribués (mois)</p>
              <p className="text-2xl font-bold text-purple-600">1,245</p>
              <p className="text-xs text-gray-500">+18% vs mois précédent</p>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="font-medium text-gray-700 mb-2 flex items-center">
              <Award className="h-4 w-4 mr-1" />
              <span>Top clients fidélité</span>
            </p>
            {topLoyaltyClients.map((client, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                <span className="flex items-center">
                  {getStatusIcon(client.status)}
                  <span className="ml-2">{client.name}</span>
                </span>
                <span className="font-medium text-primary">
                  {client.points} points
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-yellow-50 rounded-md flex items-center">
            <Gift className="h-5 w-5 text-yellow-600 mr-2" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800">Promotion du moment</p>
              <p className="text-yellow-700">-20% sur coloration pour les clients Gold</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoyaltyOverview;
