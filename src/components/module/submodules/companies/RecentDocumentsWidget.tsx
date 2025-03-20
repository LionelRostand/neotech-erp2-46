
import React, { useEffect, useState } from 'react';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { where, orderBy, limit } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, ExternalLink, FileImage, FileSpreadsheet, FileBox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface Document {
  id: string;
  name: string;
  type: string;
  fileType: string;
  companyId: string;
  createdAt: any;
}

const RecentDocumentsWidget: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  
  const documentsDb = useFirestore(COLLECTIONS.DOCUMENTS);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchRecentDocuments = async () => {
      try {
        const recentDocs = await documentsDb.getAll([
          where('type', '==', 'company_document'),
          orderBy('createdAt', 'desc'),
          limit(5)
        ]);
        
        setDocuments(recentDocs as Document[]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recent documents:', error);
        setLoading(false);
      }
    };
    
    fetchRecentDocuments();
  }, []);
  
  const navigateToDocument = (id: string, companyId: string) => {
    navigate(`/modules/companies/documents?companyId=${companyId}&documentId=${id}`);
  };
  
  const getFileIcon = (fileType: string) => {
    switch (fileType?.toLowerCase()) {
      case 'pdf':
        return <FileText size={16} className="text-red-600" />; // Changed from FilePdf to FileText with red color
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <FileImage size={16} className="text-purple-600" />;
      case 'xlsx':
      case 'xls':
      case 'csv':
        return <FileSpreadsheet size={16} className="text-green-600" />;
      default:
        return <FileBox size={16} className="text-gray-600" />;
    }
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
      {documents.length > 0 ? (
        documents.map(doc => (
          <div 
            key={doc.id}
            className="flex items-center justify-between p-2 border rounded-md hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="bg-amber-100 p-2 rounded-full">
                {getFileIcon(doc.fileType)}
              </div>
              <div>
                <h4 className="text-sm font-medium">{doc.name}</h4>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar size={12} className="mr-1" />
                  {doc.createdAt ? 
                    formatDistanceToNow(doc.createdAt.toDate(), { addSuffix: true, locale: fr }) : 
                    'Date inconnue'
                  }
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigateToDocument(doc.id, doc.companyId)}
            >
              <ExternalLink size={16} />
            </Button>
          </div>
        ))
      ) : (
        <div className="text-center py-4 text-gray-500">
          Aucun document récent
        </div>
      )}
      
      {documents.length > 0 && (
        <Button 
          variant="outline" 
          className="w-full mt-2" 
          onClick={() => navigate('/modules/companies/documents')}
        >
          Voir tous les documents
        </Button>
      )}
    </div>
  );
};

export default RecentDocumentsWidget;
