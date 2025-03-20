
import React, { useEffect, useState } from 'react';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { where, orderBy, limit } from 'firebase/firestore';
import { format, subMonths, eachMonthOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from '@/components/ui/skeleton';

interface CompanyActivity {
  month: string;
  créations: number;
  documents: number;
  mises_à_jour: number;
}

const CompanyActivityChart: React.FC = () => {
  const [activityData, setActivityData] = useState<CompanyActivity[]>([]);
  const [loading, setLoading] = useState(true);
  
  const companiesDb = useFirestore(COLLECTIONS.COMPANIES);
  const documentsDb = useFirestore(COLLECTIONS.DOCUMENTS);
  
  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        // Get the last 6 months including current
        const today = new Date();
        const sixMonthsAgo = subMonths(today, 5);
        
        // Generate array of the last 6 months
        const months = eachMonthOfInterval({
          start: sixMonthsAgo,
          end: today
        });
        
        // Fetch all companies
        const companies = await companiesDb.getAll();
        
        // Fetch all documents
        const documents = await documentsDb.getAll([
          where('type', '==', 'company_document')
        ]);
        
        // Prepare activity data
        const data: CompanyActivity[] = months.map(month => {
          const monthStart = startOfMonth(month);
          const monthEnd = endOfMonth(month);
          
          // Count company creations in this month
          const creations = companies.filter(company => {
            const createdAt = company.createdAt?.toDate();
            return createdAt && createdAt >= monthStart && createdAt <= monthEnd;
          }).length;
          
          // Count updates in this month
          const updates = companies.filter(company => {
            const updatedAt = company.updatedAt?.toDate();
            return updatedAt && updatedAt >= monthStart && updatedAt <= monthEnd;
          }).length;
          
          // Count documents added in this month
          const docsCount = documents.filter(doc => {
            const createdAt = doc.createdAt?.toDate();
            return createdAt && createdAt >= monthStart && createdAt <= monthEnd;
          }).length;
          
          return {
            month: format(month, 'MMM yyyy', { locale: fr }),
            créations: creations,
            documents: docsCount,
            mises_à_jour: updates - creations, // Only count updates that are not creations
          };
        });
        
        setActivityData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching activity data:', error);
        setLoading(false);
      }
    };
    
    fetchActivityData();
  }, []);
  
  if (loading) {
    return <Skeleton className="h-[300px] w-full" />;
  }
  
  return (
    <div className="h-[300px]">
      <h3 className="text-lg font-medium mb-4">Activité des entreprises</h3>
      <ChartContainer
        config={{
          créations: {
            label: "Créations",
            theme: {
              light: "#3b82f6",
              dark: "#60a5fa"
            }
          },
          documents: {
            label: "Documents",
            theme: {
              light: "#f59e0b",
              dark: "#fbbf24"
            }
          },
          mises_à_jour: {
            label: "Mises à jour",
            theme: {
              light: "#10b981",
              dark: "#34d399"
            }
          }
        }}
      >
        <BarChart data={activityData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar dataKey="créations" name="Créations" fill="var(--color-créations)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="documents" name="Documents" fill="var(--color-documents)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="mises_à_jour" name="Mises à jour" fill="var(--color-mises_à_jour)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default CompanyActivityChart;
