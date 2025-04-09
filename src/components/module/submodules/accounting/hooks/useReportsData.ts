
import { useState, useEffect, useMemo } from 'react';
import { useInvoicesCollection, usePaymentsCollection, useTransactionsCollection } from './useAccountingCollection';
import { formatCurrency } from '../utils/formatting';

export const useReportsData = () => {
  const { data: invoices, isLoading: isInvoicesLoading } = useInvoicesCollection();
  const { data: payments, isLoading: isPaymentsLoading } = usePaymentsCollection();
  const { data: transactions, isLoading: isTransactionsLoading } = useTransactionsCollection();

  // Combined loading state
  const isLoading = isInvoicesLoading || isPaymentsLoading || isTransactionsLoading;

  // Format data for monthly revenue chart
  const monthlyRevenueData = useMemo(() => {
    if (!invoices || invoices.length === 0) return [];

    const currentYear = new Date().getFullYear();
    const monthNames = [
      'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 
      'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'
    ];
    
    // Initialize monthly data with zeros
    const monthlyData = monthNames.map(month => ({
      name: month,
      revenue: 0
    }));

    // Sum up revenue by month
    invoices.forEach(invoice => {
      if (!invoice.issueDate || invoice.status !== 'paid') return;
      
      const date = new Date(invoice.issueDate);
      if (date.getFullYear() === currentYear) {
        const month = date.getMonth();
        monthlyData[month].revenue += invoice.total || 0;
      }
    });

    return monthlyData;
  }, [invoices]);

  // Format data for payment methods pie chart
  const paymentMethodsData = useMemo(() => {
    if (!payments || payments.length === 0) return [];

    const methods = {};
    const methodNames = {
      'stripe': 'Carte de crédit',
      'bank_transfer': 'Virement bancaire',
      'cash': 'Espèces',
      'check': 'Chèque',
      'paypal': 'PayPal',
      'other': 'Autre'
    };

    payments.forEach(payment => {
      const method = payment.method || 'other';
      methods[method] = (methods[method] || 0) + (payment.amount || 0);
    });

    return Object.keys(methods).map(key => ({
      name: methodNames[key] || key,
      value: methods[key]
    }));
  }, [payments]);

  // Format data for invoice status chart
  const invoiceStatusData = useMemo(() => {
    if (!invoices || invoices.length === 0) return [];

    const statuses = {};
    const statusNames = {
      'draft': 'Brouillon',
      'sent': 'Envoyée',
      'paid': 'Payée',
      'overdue': 'En retard',
      'cancelled': 'Annulée'
    };

    invoices.forEach(invoice => {
      const status = invoice.status || 'draft';
      statuses[status] = (statuses[status] || 0) + 1;
    });

    return Object.keys(statuses).map(key => ({
      name: statusNames[key] || key,
      value: statuses[key]
    }));
  }, [invoices]);

  // Calculate various financial totals and stats
  const financialStats = useMemo(() => {
    if (!invoices || !payments) return {
      totalRevenue: 0,
      totalPaid: 0,
      totalDue: 0,
      averageInvoice: 0
    };

    const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
    const totalPaid = payments.reduce((sum, pay) => sum + (pay.amount || 0), 0);
    const totalDue = invoices
      .filter(inv => inv.status === 'sent' || inv.status === 'overdue')
      .reduce((sum, inv) => sum + (inv.total || 0), 0);
    
    const averageInvoice = invoices.length > 0 
      ? totalRevenue / invoices.length 
      : 0;

    return {
      totalRevenue,
      totalPaid,
      totalDue,
      averageInvoice
    };
  }, [invoices, payments]);

  // Format data for quarterly comparison (current vs last year)
  const quarterlyComparisonData = useMemo(() => {
    if (!invoices || invoices.length === 0) return [];

    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
    
    // Initialize quarterly data
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    const data = quarters.map(quarter => ({
      name: quarter,
      current: 0,
      previous: 0
    }));

    // Helper to determine quarter
    const getQuarter = (date) => Math.floor(date.getMonth() / 3);

    // Sum up revenue by quarter
    invoices.forEach(invoice => {
      if (!invoice.issueDate) return;
      
      const date = new Date(invoice.issueDate);
      const year = date.getFullYear();
      
      if (year === currentYear || year === lastYear) {
        const quarter = getQuarter(date);
        if (year === currentYear) {
          data[quarter].current += invoice.total || 0;
        } else {
          data[quarter].previous += invoice.total || 0;
        }
      }
    });

    return data;
  }, [invoices]);

  return {
    monthlyRevenueData,
    paymentMethodsData,
    invoiceStatusData,
    quarterlyComparisonData,
    financialStats,
    isLoading
  };
};
