
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookLoan } from '../types/library-types';
import { format, isAfter, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';

interface OverdueLoansCardProps {
  overdueLoans: BookLoan[];
  onNotifyMember: (loanId: string) => void;
}

const OverdueLoansCard: React.FC<OverdueLoansCardProps> = ({ 
  overdueLoans, 
  onNotifyMember 
}) => {
  if (overdueLoans.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-green-500" />
            <span>Emprunts en retard</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-muted-foreground">Aucun emprunt en retard pour le moment.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getDaysOverdue = (dueDate: string) => {
    return differenceInDays(new Date(), new Date(dueDate));
  };

  const getSeverityClass = (daysOverdue: number) => {
    if (daysOverdue > 14) return "bg-red-100 text-red-800";
    if (daysOverdue > 7) return "bg-amber-100 text-amber-800";
    return "bg-blue-100 text-blue-800";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span>Emprunts en retard</span>
          <Badge variant="destructive" className="ml-2">{overdueLoans.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {overdueLoans.slice(0, 5).map((loan) => {
            const daysOverdue = getDaysOverdue(loan.dueDate);
            
            return (
              <div key={loan.id} className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="font-medium">{loan.bookTitle}</p>
                  <p className="text-sm text-muted-foreground">
                    Prévu pour le {format(new Date(loan.dueDate), 'dd MMM yyyy', { locale: fr })}
                  </p>
                  <div className="mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${getSeverityClass(daysOverdue)}`}>
                      {daysOverdue} jours de retard
                    </span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onNotifyMember(loan.id)}
                >
                  Notifier
                </Button>
              </div>
            );
          })}
          
          {overdueLoans.length > 5 && (
            <div className="text-center pt-2">
              <Button variant="link">Voir tous les {overdueLoans.length} emprunts en retard</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OverdueLoansCard;
