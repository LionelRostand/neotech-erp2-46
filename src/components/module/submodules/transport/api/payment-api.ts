
import { generatePaymentReference } from "../utils/payment-utils";

// Mock API functions for payment processing

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

export const processRefund = async (paymentId: string, amount?: number) => {
  console.log(`Processing refund for payment ${paymentId}, amount: ${amount || 'full'}`);
  return {
    success: true,
    refundId: `REF-${Date.now()}`,
    paymentId,
    amount: amount || 0,
    date: new Date().toISOString()
  };
};

export const getPaymentStatistics = async (period: 'day' | 'week' | 'month' | 'year') => {
  console.log(`Getting payment statistics for period: ${period}`);
  return {
    totalAmount: 2450.75,
    count: 28,
    averageAmount: 87.53,
    byMethod: {
      card: 1520.50,
      paypal: 430.25,
      cash: 500.00
    }
  };
};
