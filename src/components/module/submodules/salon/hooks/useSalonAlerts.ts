
import { useState, useEffect } from 'react';
import { useSalonBilling } from '../billing/hooks/useSalonBilling';
import { useProducts } from '../products/hooks/useProducts';
import { useAppointments } from './useAppointments';
import { InvoiceStatus } from '../types/salon-types';

export const useSalonAlerts = () => {
  const [newAppointments, setNewAppointments] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState(0);
  
  const { invoices } = useSalonBilling();
  const { getLowStockProducts } = useProducts();
  const { getNewAppointments } = useAppointments();
  
  // Get count of pending appointments
  const getNewAppointmentsCount = () => {
    return getNewAppointments().length;
  };
  
  // Get count of pending payments
  const getPendingPaymentsCount = () => {
    return invoices.filter(invoice => 
      invoice.status === 'pending' || invoice.status === 'overdue'
    ).length;
  };
  
  // Get count of low stock products
  const getLowStockProductsCount = () => {
    return getLowStockProducts().length;
  };
  
  // Update alert counts
  useEffect(() => {
    setNewAppointments(getNewAppointmentsCount());
    setPendingPayments(getPendingPaymentsCount());
    setLowStockProducts(getLowStockProductsCount());
  }, [invoices]);
  
  return {
    newAppointments,
    pendingPayments,
    lowStockProducts
  };
};
