
import React from 'react';
import StatCards from './dashboard/StatCards';
import LoansByMonthChart from './dashboard/LoansByMonthChart';
import BooksByCategoryChart from './dashboard/BooksByCategoryChart';
import MostBorrowedBooksTable from './dashboard/MostBorrowedBooksTable';
import DashboardAlerts from './dashboard/DashboardAlerts';
import { useDashboardStats } from './hooks/useDashboardStats';
import { useChartConfig } from './hooks/useChartConfig';
import { Book } from './types/library-types';

// Mock data for testing alerts
const mockOverdueLoans = [
  {
    id: "loan1",
    memberId: "member1",
    bookId: "book1",
    bookTitle: "L'étranger",
    borrowDate: "2023-05-15",
    dueDate: "2023-06-15",
    returned: false,
    renewalCount: 0
  },
  {
    id: "loan2",
    memberId: "member2",
    bookId: "book2",
    bookTitle: "Le Petit Prince",
    borrowDate: "2023-05-20",
    dueDate: "2023-06-20",
    returned: false,
    renewalCount: 1
  }
];

const mockNewBooks = [
  {
    id: "book1",
    title: "Les Misérables",
    author: "Victor Hugo",
    isbn: "9780451525260",
    genre: "Roman classique",
    description: "Un chef-d'œuvre de la littérature française",
    available: true,
    availableCopies: 3,
    totalCopies: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "book2",
    title: "Le Comte de Monte-Cristo",
    author: "Alexandre Dumas",
    isbn: "9781853267338",
    genre: "Roman d'aventure",
    description: "Un roman d'aventure intemporel",
    available: true,
    availableCopies: 2,
    totalCopies: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
] as Book[];

const DashboardPage: React.FC = () => {
  const { stats, loading } = useDashboardStats();
  const { chartConfig, COLORS } = useChartConfig();

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold tracking-tight">Tableau de bord Bibliothèque</h1>
      
      {/* Stats Cards */}
      <StatCards 
        totalBooks={stats.totalBooks} 
        totalMembers={stats.totalMembers}
        activeLoans={stats.activeLoans}
      />

      {/* Alerts Section */}
      <DashboardAlerts 
        overdueLoans={mockOverdueLoans}
        newBooks={mockNewBooks}
      />

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Loans Chart */}
        <LoansByMonthChart
          data={stats.loansByMonth}
          chartConfig={chartConfig}
        />

        {/* Categories Chart */}
        <BooksByCategoryChart
          data={stats.booksByCategory}
          colors={COLORS}
          chartConfig={chartConfig}
        />
      </div>

      {/* Most Borrowed Books Table */}
      <MostBorrowedBooksTable books={stats.mostBorrowedBooks} />
    </div>
  );
};

export default DashboardPage;
