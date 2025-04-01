
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, Clock, UserCheck, Shield, Star } from "lucide-react";
import { TransportDriver } from '../types/transport-types';

interface DriverPerformanceProps {
  driver: TransportDriver;
}

const DriverPerformance: React.FC<DriverPerformanceProps> = ({ driver }) => {
  // Mock performance data
  const monthlyRatings = [
    { month: 'Jan', rating: 4.6 },
    { month: 'Fév', rating: 4.7 },
    { month: 'Mar', rating: 4.8 },
    { month: 'Avr', rating: 4.7 },
    { month: 'Mai', rating: 4.9 },
    { month: 'Juin', rating: 4.8 }
  ];
  
  // Calculate color based on performance value
  const getColorClass = (value: number, max: number) => {
    const percentage = (value / max) * 100;
    if (percentage >= 90) return "bg-green-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Get safe performance values
  const getOnTimeRate = () => driver.performance?.onTimeRate || 0;
  const getSatisfactionScore = () => driver.performance?.satisfactionScore || 0;
  const getSafetyScore = () => driver.performance?.safetyScore || 0;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <h4 className="font-semibold text-lg">Ponctualité</h4>
              <p className="text-3xl font-bold mt-2">{getOnTimeRate()}%</p>
              <Progress 
                value={getOnTimeRate()} 
                className={`h-2 mt-2 ${getColorClass(getOnTimeRate(), 100)}`} 
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <UserCheck className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <h4 className="font-semibold text-lg">Satisfaction client</h4>
              <p className="text-3xl font-bold mt-2">{getSatisfactionScore()}/5</p>
              <Progress 
                value={getSatisfactionScore() * 20} 
                className={`h-2 mt-2 ${getColorClass(getSatisfactionScore(), 5)}`} 
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Shield className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <h4 className="font-semibold text-lg">Score de sécurité</h4>
              <p className="text-3xl font-bold mt-2">{getSafetyScore()}/100</p>
              <Progress 
                value={getSafetyScore()} 
                className={`h-2 mt-2 ${getColorClass(getSafetyScore(), 100)}`} 
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={16} />
            <span>Évolution de la note sur 6 mois</span>
          </h4>
          
          <div className="h-60 flex items-end justify-between px-2">
            {monthlyRatings.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="w-8 bg-blue-500 rounded-t-sm" 
                  style={{ 
                    height: `${(item.rating / 5) * 150}px`,
                    opacity: 0.3 + ((index / monthlyRatings.length) * 0.7)
                  }}
                ></div>
                <span className="text-xs mt-1">{item.month}</span>
                <span className="text-xs text-muted-foreground">{item.rating}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Star size={16} />
            <span>Commentaires récents des clients</span>
          </h4>
          
          <div className="space-y-4">
            <div className="p-3 border rounded-md">
              <div className="flex justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">Il y a 2 jours</span>
              </div>
              <p className="mt-2 text-sm">
                "Chauffeur très professionnel et ponctuel. A rendu notre transfert vers l'aéroport très agréable."
              </p>
              <p className="mt-1 text-sm text-muted-foreground">- Jean Dupont</p>
            </div>
            
            <div className="p-3 border rounded-md">
              <div className="flex justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">Il y a 1 semaine</span>
              </div>
              <p className="mt-2 text-sm">
                "Excellent service, véhicule impeccable et chauffeur très courtois. Je recommande vivement!"
              </p>
              <p className="mt-1 text-sm text-muted-foreground">- Marie Martin</p>
            </div>
            
            <div className="p-3 border rounded-md">
              <div className="flex justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400" />
                  ))}
                  {[...Array(1)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-gray-300" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">Il y a 2 semaines</span>
              </div>
              <p className="mt-2 text-sm">
                "Bonne prestation dans l'ensemble. Petit retard au départ mais conduite très sécuritaire."
              </p>
              <p className="mt-1 text-sm text-muted-foreground">- Thomas Petit</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverPerformance;
