
import { LoyaltyProgram } from '../types/loyalty-types';

export const loyaltyPrograms: LoyaltyProgram[] = [
  {
    id: "lp1",
    name: "Programme VIP Auto",
    description: "Programme premium pour nos clients fidèles",
    pointsMultiplier: 2,
    minimumSpend: 100,
    benefitsDescription: "Double points sur tous les services, -10% sur les pièces",
    startDate: "2024-01-01",
    status: "active",
    createdAt: "2023-12-15"
  },
  {
    id: "lp2",
    name: "Programme Maintenance Plus",
    description: "Récompenses sur les services d'entretien régulier",
    pointsMultiplier: 1.5,
    minimumSpend: 50,
    benefitsDescription: "Points bonus sur les révisions, lavage offert",
    startDate: "2024-02-01",
    status: "active",
    createdAt: "2024-01-15"
  }
];
