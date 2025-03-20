
import React, { useEffect, useState } from 'react';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { orderBy, limit } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { Building2, Calendar, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface Company {
  id: string;
  name: string;
  createdAt: any;
}

const RecentCompaniesWidget: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  
  const companiesDb = useFirestore(COLLECTIONS.COMPANIES);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchRecentCompanies = async () => {
      try {
        const recentCompanies = await companiesDb.getAll([
          orderBy('createdAt', 'desc'),
          limit(5)
        ]);
        
        setCompanies(recentCompanies as Company[]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recent companies:', error);
        setLoading(false);
      }
    };
    
    fetchRecentCompanies();
  }, []);
  
  const navigateToCompany = (id: string) => {
    navigate(`/modules/companies/view/${id}`);
  };
  
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-2 border rounded-md">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div>
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {companies.length > 0 ? (
        companies.map(company => (
          <div 
            key={company.id}
            className="flex items-center justify-between p-2 border rounded-md hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 p-2 rounded-full">
                <Building2 size={16} className="text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium">{company.name}</h4>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar size={12} className="mr-1" />
                  {company.createdAt ? 
                    formatDistanceToNow(company.createdAt.toDate(), { addSuffix: true, locale: fr }) : 
                    'Date inconnue'
                  }
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigateToCompany(company.id)}
            >
              <ExternalLink size={16} />
            </Button>
          </div>
        ))
      ) : (
        <div className="text-center py-4 text-gray-500">
          Aucune entreprise récente
        </div>
      )}
      
      {companies.length > 0 && (
        <Button 
          variant="outline" 
          className="w-full mt-2" 
          onClick={() => navigate('/modules/companies/list')}
        >
          Voir toutes les entreprises
        </Button>
      )}
    </div>
  );
};

export default RecentCompaniesWidget;
