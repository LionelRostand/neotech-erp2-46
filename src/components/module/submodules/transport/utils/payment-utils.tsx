
import React from 'react';
import { ChevronsUpDown } from "@/components/ui/chevrons-up-down";

// Composant d'icône ChevronsUpDown pour les composants de paiement
export const PaymentChevronIcon: React.FC = () => {
  return <ChevronsUpDown className="h-4 w-4 ml-2" />;
};

// Formatter les montants
export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

// Calculer le montant TTC à partir d'un montant HT
export const calculateTTC = (amountHT: number, taxRate: number = 20): number => {
  return amountHT * (1 + taxRate / 100);
};

// Types d'options de paiement
export const paymentOptions = [
  { id: 'card', name: 'Carte bancaire', fee: 0 },
  { id: 'paypal', name: 'PayPal', fee: 1.5 },
  { id: 'transfer', name: 'Virement bancaire', fee: 0 },
  { id: 'cheque', name: 'Chèque', fee: 0 },
  { id: 'cash', name: 'Espèces', fee: 0 },
];

// Méthode pour générer une référence de paiement
export const generatePaymentReference = (prefix = 'PAY'): string => {
  const date = new Date();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${random}`;
};

// Mock API functions
export const createPayment = async (paymentData: any) => {
  console.log('Creating payment', paymentData);
  return {
    id: generatePaymentReference(),
    ...paymentData,
    status: 'success',
    createdAt: new Date().toISOString()
  };
};

export const getPaymentRecords = async (filters?: any) => {
  console.log('Getting payment records with filters', filters);
  return [
    {
      id: 'PAY-20230701-1234',
      amount: 120.5,
      reservationId: 'RES-001',
      method: 'card',
      status: 'completed',
      date: '2023-07-01T10:15:00Z',
      clientName: 'Jean Dupont'
    },
    {
      id: 'PAY-20230702-5678',
      amount: 85.0,
      reservationId: 'RES-002',
      method: 'paypal',
      status: 'completed',
      date: '2023-07-02T14:30:00Z',
      clientName: 'Marie Laurent'
    }
  ];
};
