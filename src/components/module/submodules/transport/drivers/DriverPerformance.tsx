
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TransportDriver } from '../types';
import { CalendarDays, Star, Clock, TrendingUp, Award, ThumbsUp } from "lucide-react";

interface DriverPerformanceProps {
  driver: TransportDriver;
}

const DriverPerformance: React.FC<DriverPerformanceProps> = ({ driver }) => {
  // Default values if performance data is missing
  const performance = driver.performance || {
    completedTrips: 0,
    rating: 0,
    onTimePercentage: 0,
    cancelRate: 0
  };
  
  // Calculate performance level based on rating
  const getPerformanceLevel = (rating: number) => {
    if (rating >= 4.8) return { label: "Excellent", color: "bg-green-500" };
    if (rating >= 4.5) return { label: "Très bon", color: "bg-green-400" };
    if (rating >= 4.0) return { label: "Bon", color: "bg-blue-500" };
    if (rating >= 3.5) return { label: "Moyen", color: "bg-yellow-500" };
    return { label: "À améliorer", color: "bg-red-500" };
  };
  
  // Use either averageRating or rating property from the performance object
  const ratingValue = performance.averageRating !== undefined ? 
    performance.averageRating : performance.rating;
  
  const performanceLevel = getPerformanceLevel(ratingValue);
  
  return (
    <div className="space-y-6">
      {/* Performance Summary */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Performance globale</h3>
          <p className="text-sm text-gray-500">Basée sur {performance.completedTrips} trajets</p>
        </div>
        <Badge className={`${performanceLevel.color} text-white`}>
          {performanceLevel.label}
        </Badge>
      </div>
      
      {/* Performance Metrics */}
      <div className="grid grid-cols-3 gap-4 my-6">
        <div className="text-center">
          <div className="text-2xl font-bold">{performance.onTimePercentage || 0}%</div>
          <div className="text-sm text-gray-500">Ponctualité</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{ratingValue.toFixed(1)}</div>
          <div className="text-sm text-gray-500">Note moyenne</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{performance.completedTrips || 0}</div>
          <div className="text-sm text-gray-500">Trajets effectués</div>
        </div>
      </div>
      
      {/* Rating Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-2 text-yellow-500" />
                  <span className="text-sm font-medium">Satisfaction client</span>
                </div>
                <span className="text-sm font-bold">{ratingValue.toFixed(1)}/5</span>
              </div>
              <Progress value={ratingValue * 20} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm font-medium">Ponctualité</span>
                </div>
                <span className="text-sm font-bold">{performance.onTimePercentage}%</span>
              </div>
              <Progress value={performance.onTimePercentage} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                  <span className="text-sm font-medium">Efficacité</span>
                </div>
                <span className="text-sm font-bold">
                  {performance.completedTrips > 50 ? "Élevée" : 
                   performance.completedTrips > 20 ? "Moyenne" : "Débutant"}
                </span>
              </div>
              <Progress 
                value={performance.completedTrips > 100 ? 100 : performance.completedTrips} 
                className="h-2" 
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Activity */}
      <div>
        <h3 className="text-lg font-medium mb-4">Activité récente</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-3 border rounded-lg">
            <CalendarDays className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <p className="font-medium">12 réservations ce mois</p>
              <p className="text-sm text-gray-500">Augmentation de 20% par rapport au mois dernier</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-3 border rounded-lg">
            <Award className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <p className="font-medium">Chauffeur du mois (2 fois)</p>
              <p className="text-sm text-gray-500">Reconnaissance pour service exceptionnel</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-3 border rounded-lg">
            <ThumbsUp className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">8 commentaires positifs</p>
              <p className="text-sm text-gray-500">De la part des clients ce trimestre</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverPerformance;
