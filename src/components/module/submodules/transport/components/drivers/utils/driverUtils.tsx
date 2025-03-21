
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Driver } from '../types/driverTypes';

/**
 * Returns a status badge component based on driver status
 */
export const getStatusBadge = (status: Driver['status']) => {
  switch (status) {
    case "available":
      return <Badge className="bg-green-500">Disponible</Badge>;
    case "driving":
      return <Badge className="bg-blue-500">En service</Badge>;
    case "off-duty":
      return <Badge className="bg-gray-500">Hors service</Badge>;
    case "vacation":
      return <Badge className="bg-purple-500">Congés</Badge>;
    case "sick":
      return <Badge className="bg-yellow-500">Maladie</Badge>;
    default:
      return <Badge>Statut inconnu</Badge>;
  }
};

/**
 * Returns a star rating display component based on numeric rating
 */
export const getRatingStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center">
      {Array(fullStars).fill(0).map((_, i) => (
        <span key={`full-${i}`} className="text-yellow-500">★</span>
      ))}
      {hasHalfStar && <span className="text-yellow-500">½</span>}
      <span className="ml-1 text-gray-600">({rating})</span>
    </div>
  );
};
