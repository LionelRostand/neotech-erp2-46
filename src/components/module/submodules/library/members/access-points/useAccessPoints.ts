
import { useState } from 'react';
import { AccessPoint } from './types';

const mockAccessPoints: AccessPoint[] = [
  { id: "ap1", name: "Bibliothèque Centrale", address: "15 Rue de la République, 75001 Paris", employeesCount: 8, isActive: true },
  { id: "ap2", name: "Annexe Nord", address: "42 Avenue des Fleurs, 75018 Paris", employeesCount: 3, isActive: true },
  { id: "ap3", name: "Point Numérique", address: "7 Place de l'Innovation, 75004 Paris", employeesCount: 2, isActive: false },
];

export const useAccessPoints = () => {
  const [accessPoints, setAccessPoints] = useState<AccessPoint[]>(mockAccessPoints);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAccessPoints = accessPoints.filter(ap => 
    ap.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    ap.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    accessPoints,
    setAccessPoints,
    searchQuery,
    setSearchQuery,
    filteredAccessPoints
  };
};
