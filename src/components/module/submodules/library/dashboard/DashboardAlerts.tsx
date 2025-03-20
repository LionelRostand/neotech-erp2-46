
import React from 'react';
import OverdueLoansCard from './OverdueLoansCard';
import NewBooksCard from './NewBooksCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';
import { BookLoan, Book } from '../types/library-types';
import { toast } from 'sonner';

interface DashboardAlertsProps {
  overdueLoans: BookLoan[];
  newBooks: Book[];
}

const DashboardAlerts: React.FC<DashboardAlertsProps> = ({
  overdueLoans,
  newBooks
}) => {
  const handleNotifyMember = (loanId: string) => {
    // Dans une application réelle, cela enverrait une notification
    toast.success("Notification envoyée à l'adhérent");
    console.log(`Notification sent for loan: ${loanId}`);
  };

  const handleViewBook = (bookId: string) => {
    // Dans une application réelle, cela ouvrirait la page de détails du livre
    console.log(`View book details: ${bookId}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <OverdueLoansCard 
        overdueLoans={overdueLoans}
        onNotifyMember={handleNotifyMember}
      />
      <NewBooksCard 
        newBooks={newBooks}
        onViewBook={handleViewBook}
      />
    </div>
  );
};

export default DashboardAlerts;
