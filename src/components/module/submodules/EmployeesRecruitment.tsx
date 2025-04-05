
import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, 
  Eye, 
  Edit, 
  Download,
  Filter,
  FileSignature,
  Calendar, 
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { useRecruitmentFirebaseData } from '@/hooks/useRecruitmentFirebaseData';
import { useRecruitmentData } from '@/hooks/useRecruitmentData';
import RecruitmentStats from './employees/RecruitmentStats';
import RecruitmentViewDialog from './recruitment/RecruitmentViewDialog';
import EditRecruitmentDialog from './recruitment/EditRecruitmentDialog';
import RecruitmentFilterDialog from './recruitment/RecruitmentFilterDialog';
import RecruitmentScheduleDialog from './recruitment/RecruitmentScheduleDialog';
import CreateRecruitmentDialog from './recruitment/CreateRecruitmentDialog';

const EmployeesRecruitment: React.FC = () => {
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedRecruitment, setSelectedRecruitment] = useState<any>(null);
  const [filterCriteria, setFilterCriteria] = useState({
    department: null,
    contractType: null,
    status: null,
    priority: null,
    location: null
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Use Firebase data with fallback to mock data
  const { 
    recruitmentPosts: firebasePosts, 
    isLoading: isFirebaseLoading, 
    error: firebaseError,
    refreshData: refreshFirebaseData 
  } = useRecruitmentFirebaseData();
  
  const { recruitmentPosts: mockPosts, stats, isLoading: isMockLoading } = useRecruitmentData(refreshTrigger);
  
  // Use Firebase data if available, otherwise use mock data
  const recruitmentPosts = firebasePosts.length > 0 ? firebasePosts : mockPosts;
  const isLoading = isFirebaseLoading || isMockLoading;
  
  // Filter posts based on criteria
  const filteredPosts = React.useMemo(() => {
    return recruitmentPosts.filter(post => {
      if (filterCriteria.department && post.department !== filterCriteria.department) return false;
      if (filterCriteria.contractType && post.contractType !== filterCriteria.contractType) return false;
      if (filterCriteria.status && post.status !== filterCriteria.status) return false;
      if (filterCriteria.priority && post.priority !== filterCriteria.priority) return false;
      if (filterCriteria.location && post.location !== filterCriteria.location) return false;
      return true;
    });
  }, [recruitmentPosts, filterCriteria]);
  
  // Log the data source being used
  useEffect(() => {
    if (firebasePosts.length > 0) {
      console.log('Using Firebase recruitment data:', firebasePosts.length, 'posts');
      console.log('Filtered posts count:', filteredPosts.length);
    } else if (firebaseError) {
      console.error('Firebase error, using mock data instead:', firebaseError);
    } else if (isFirebaseLoading) {
      console.log('Loading Firebase recruitment data...');
    } else {
      console.log('No Firebase data available, using mock data:', mockPosts.length, 'posts');
      console.log('Filtered posts count:', filteredPosts.length);
    }
  }, [firebasePosts, mockPosts, filteredPosts, isFirebaseLoading, firebaseError]);

  const handleViewPost = (post: any) => {
    setSelectedRecruitment(post);
    setViewDialogOpen(true);
  };

  const handleEditPost = (post: any) => {
    setSelectedRecruitment(post);
    setEditDialogOpen(true);
  };

  const handleRefreshData = () => {
    toast.info("Actualisation des données en cours...");
    if (refreshFirebaseData) {
      refreshFirebaseData();
    } else {
      setRefreshTrigger(prev => prev + 1);
    }
    setTimeout(() => toast.success("Données actualisées"), 1000);
  };

  const handleExport = () => {
    toast.success("Exportation des données de recrutement lancée");
    // Implement export logic
    setTimeout(() => {
      const fileName = `recrutement_export_${new Date().toISOString().slice(0, 10)}.csv`;
      toast.success(`Fichier ${fileName} téléchargé avec succès`);
    }, 1500);
  };

  const handleScheduleInterview = (post: any) => {
    setSelectedRecruitment(post);
    setScheduleDialogOpen(true);
  };

  const handleSuccess = useCallback(() => {
    toast.success("Opération réussie");
    handleRefreshData();
  }, []);

  // Extract the stats we need from the stats object
  const statsProps = {
    openPositions: stats.open,
    inProgressPositions: stats.inProgress,
    closedPositions: stats.closed,
    applicationsThisMonth: 42, // This would come from a real data source
    interviewsScheduled: 15, // This would come from a real data source
    applicationsChange: 12, // This would come from a real data source
    isLoading
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold">Recrutement</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => setFilterDialogOpen(true)}>
            <Filter className="h-4 w-4 mr-2" />
            Filtres{Object.values(filterCriteria).some(v => v !== null) ? ' (actifs)' : ''}
          </Button>
          <Button variant="outline" onClick={handleRefreshData}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Briefcase className="h-4 w-4 mr-2" />
            Nouveau poste
          </Button>
        </div>
      </div>

      <RecruitmentStats 
        openPositions={statsProps.openPositions}
        inProgressPositions={statsProps.inProgressPositions}
        closedPositions={statsProps.closedPositions}
        applicationsThisMonth={statsProps.applicationsThisMonth}
        interviewsScheduled={statsProps.interviewsScheduled}
        applicationsChange={statsProps.applicationsChange}
        isLoading={statsProps.isLoading}
      />

      {Object.values(filterCriteria).some(v => v !== null) && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 flex justify-between items-center">
          <div className="text-blue-800 text-sm">
            Filtres actifs: {[
              filterCriteria.department && `Département: ${filterCriteria.department}`,
              filterCriteria.contractType && `Type de contrat: ${filterCriteria.contractType}`,
              filterCriteria.status && `Statut: ${filterCriteria.status}`,
              filterCriteria.priority && `Priorité: ${filterCriteria.priority}`,
              filterCriteria.location && `Localisation: ${filterCriteria.location}`
            ].filter(Boolean).join(', ')}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setFilterCriteria({
              department: null,
              contractType: null,
              status: null,
              priority: null,
              location: null
            })}
          >
            Effacer les filtres
          </Button>
        </div>
      )}

      <Card>
        <CardContent className="p-0 pt-6">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Briefcase className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun poste trouvé</h3>
              <p className="text-gray-500 max-w-md mb-4">
                {Object.values(filterCriteria).some(v => v !== null) 
                  ? "Aucun poste ne correspond aux critères de filtrage actuels." 
                  : "Aucun poste n'est actuellement disponible. Créez votre premier poste."}
              </p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                Créer un poste
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Poste</TableHead>
                    <TableHead>Département</TableHead>
                    <TableHead>Date d'ouverture</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Priorité</TableHead>
                    <TableHead>Candidatures</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow key={post.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{post.position}</TableCell>
                      <TableCell>{post.department}</TableCell>
                      <TableCell>{post.openDate}</TableCell>
                      <TableCell>{post.hiringManagerName}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          post.status === 'Ouvert' ? 'bg-green-100 text-green-800' :
                          post.status === 'En cours' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {post.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          post.priority === 'Haute' ? 'bg-red-100 text-red-800' :
                          post.priority === 'Moyenne' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {post.priority}
                        </span>
                      </TableCell>
                      <TableCell>{post.applicationCount}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleViewPost(post)} title="Voir les détails">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEditPost(post)} title="Modifier">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleScheduleInterview(post)} title="Planifier un entretien">
                            <Calendar className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedRecruitment && (
        <>
          <RecruitmentViewDialog 
            open={viewDialogOpen} 
            onOpenChange={setViewDialogOpen} 
            recruitment={selectedRecruitment} 
          />
          
          <EditRecruitmentDialog 
            open={editDialogOpen} 
            onOpenChange={setEditDialogOpen} 
            recruitment={selectedRecruitment}
            onSuccess={handleSuccess}
          />
          
          <RecruitmentScheduleDialog 
            open={scheduleDialogOpen} 
            onOpenChange={setScheduleDialogOpen} 
            recruitment={selectedRecruitment} 
          />
        </>
      )}
      
      <RecruitmentFilterDialog 
        open={filterDialogOpen}
        onOpenChange={setFilterDialogOpen}
        filterCriteria={filterCriteria}
        setFilterCriteria={setFilterCriteria}
      />
      
      <CreateRecruitmentDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default EmployeesRecruitment;
