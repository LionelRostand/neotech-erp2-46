
import React from 'react';
import { BookOpen, User, Calendar } from 'lucide-react';
import StatCard from '@/components/StatCard';

interface StatCardsProps {
  totalBooks: number;
  totalMembers: number;
  activeLoans: number;
}

const StatCards: React.FC<StatCardsProps> = ({ 
  totalBooks, 
  totalMembers, 
  activeLoans 
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Total Livres"
        value={totalBooks.toString()}
        icon={<BookOpen className="h-6 w-6 text-purple-500" />}
        description="Nombre total de livres dans la collection"
      />
      <StatCard
        title="Adhérents"
        value={totalMembers.toString()}
        icon={<User className="h-6 w-6 text-indigo-500" />}
        description="Nombre d'adhérents actifs"
      />
      <StatCard
        title="Emprunts Actifs"
        value={activeLoans.toString()}
        icon={<Calendar className="h-6 w-6 text-emerald-500" />}
        description="Emprunts en cours"
      />
    </div>
  );
};

export default StatCards;
