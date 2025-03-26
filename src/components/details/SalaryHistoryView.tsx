
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useSafeFirestore } from '@/hooks/use-safe-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { EmployeeSalary } from '@/hooks/useEmployeeSalaries';

interface SalaryHistoryViewProps {
  employeeId: string;
}

const SalaryHistoryView: React.FC<SalaryHistoryViewProps> = ({ employeeId }) => {
  const [salaryHistory, setSalaryHistory] = useState<EmployeeSalary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const firestore = useSafeFirestore(COLLECTIONS.SALARIES);

  useEffect(() => {
    const fetchSalaryHistory = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, we would filter by employeeId
        // For now, we'll simulate it by fetching all and filtering client-side
        const result = await firestore.getAll();
        const filteredHistory = result
          .filter((salary: any) => salary.employeeId === employeeId)
          .sort((a: any, b: any) => {
            // Sort by date in descending order
            const dateA = new Date(a.effectiveDate).getTime();
            const dateB = new Date(b.effectiveDate).getTime();
            return dateB - dateA;
          });

        setSalaryHistory(filteredHistory as EmployeeSalary[]);
      } catch (error) {
        console.error('Error fetching salary history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalaryHistory();
  }, [employeeId, firestore]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (salaryHistory.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun historique de salaire trouvé pour cet employé.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-medium">Date effective</th>
            <th className="text-left py-3 px-4 font-medium">Montant</th>
            <th className="text-left py-3 px-4 font-medium">Date de paiement</th>
            <th className="text-left py-3 px-4 font-medium">Statut</th>
          </tr>
        </thead>
        <tbody>
          {salaryHistory.map((salary, index) => (
            <tr key={index} className="border-b hover:bg-muted/50">
              <td className="py-3 px-4">{formatDate(salary.effectiveDate)}</td>
              <td className="py-3 px-4">{salary.amount} {salary.currency}</td>
              <td className="py-3 px-4">{formatDate(salary.paymentDate)}</td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  salary.status === 'Payé' ? 'bg-green-100 text-green-800' :
                  salary.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {salary.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalaryHistoryView;
