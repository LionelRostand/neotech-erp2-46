
import { useState, useEffect, useCallback } from 'react';
import { FreightPayment } from '../../types/freight-types';

// Données de paiements de démonstration
const demoPayments: FreightPayment[] = [
  {
    id: 'PAY-001',
    date: '2025-04-18T10:30:00Z',
    clientId: 'CLI-001',
    clientName: 'Société Maritime Internationale',
    referenceId: 'SHP-001',
    reference: 'EXP-2025-001',
    type: 'shipment',
    amount: 2800,
    method: 'transfer',
    status: 'completed',
    invoiceNumber: 'INV-2025-001',
    notes: 'Paiement reçu par virement SEPA'
  },
  {
    id: 'PAY-002',
    date: '2025-04-15T14:45:00Z',
    clientId: 'CLI-002',
    clientName: 'TransCargo Express',
    referenceId: 'CNT-001',
    reference: 'CONT-23456789',
    type: 'container',
    amount: 1450,
    method: 'card',
    status: 'completed',
    invoiceNumber: 'INV-2025-002',
    transactionId: 'TXN-98765432'
  },
  {
    id: 'PAY-003',
    date: '2025-04-10T09:15:00Z',
    clientId: 'CLI-003',
    clientName: 'Global Shipping Inc.',
    referenceId: 'SHP-003',
    reference: 'EXP-2025-003',
    type: 'shipment',
    amount: 3500,
    method: 'paypal',
    status: 'pending',
    invoiceNumber: 'INV-2025-003',
    transactionId: 'PP-12345678'
  },
  {
    id: 'PAY-004',
    date: '2025-04-05T16:20:00Z',
    clientId: 'CLI-001',
    clientName: 'Société Maritime Internationale',
    referenceId: 'CNT-002',
    reference: 'CONT-34567890',
    type: 'container',
    amount: 1800,
    method: 'cash',
    status: 'completed',
    invoiceNumber: 'INV-2025-004'
  },
  {
    id: 'PAY-005',
    date: '2025-04-01T11:00:00Z',
    clientId: 'CLI-004',
    clientName: 'FastTrack Logistics',
    referenceId: 'SHP-004',
    reference: 'EXP-2025-004',
    type: 'shipment',
    amount: 2200,
    method: 'transfer',
    status: 'failed',
    invoiceNumber: 'INV-2025-005',
    notes: 'Problème de fonds insuffisants'
  }
];

export const usePayments = () => {
  const [payments, setPayments] = useState<FreightPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simuler un chargement de données depuis une API
  useEffect(() => {
    const fetchPayments = async () => {
      setIsLoading(true);
      try {
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 500));
        setPayments(demoPayments);
      } catch (error) {
        console.error('Erreur lors du chargement des paiements:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Fonction pour recharger les données
  const reload = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 500));
      // Dans une application réelle, nous ferions un appel API ici
      // Pour cette démo, on ajoute simplement le nouveau paiement aux données existantes
      setPayments([...demoPayments]);
    } catch (error) {
      console.error('Erreur lors du rechargement des paiements:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { payments, isLoading, reload };
};
