import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { 
  Briefcase, 
  Plus, 
  Users, 
  UserPlus, 
  ListFilter, 
  Calendar, 
  Download,
  Eye
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRecruitmentData, RecruitmentPost } from '@/hooks/useRecruitmentData';
import { useRecruitmentFirebaseData } from '@/hooks/useRecruitmentFirebaseData';
import RecruitmentStats from './employees/RecruitmentStats';
import RecruitmentFilterDialog from './recruitment/RecruitmentFilterDialog';
import CreateRecruitmentDialog from './recruitment/CreateRecruitmentDialog';
import RecruitmentViewDialog from './recruitment/RecruitmentViewDialog';
import RecruitmentScheduleDialog from './recruitment/RecruitmentScheduleDialog';
import { exportToExcel } from '@/utils/exportUtils';
import { exportToPdf } from '@/utils/pdfUtils';
import { useToast } from '@/hooks/use-toast';

const EmployeesRecruitment: React.FC = () => {
  const { recruitmentPosts: mockRecruitmentPosts, stats: mockStats, isLoading: isMockLoading } = useRecruitmentData();
  const { recruitmentPosts: firebaseRecruitmentPosts, isLoading: isFirebaseLoading } = useRecruitmentFirebaseData();
  
  const [recruitmentPosts, setRecruitmentPosts] = useState<RecruitmentPost[]>([]);
  const [stats, setStats] = useState({ open: 0, inProgress: 0, closed: 0, totalApplications: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!isFirebaseLoading && firebaseRecruitmentPosts.length > 0) {
      console.log('Using Firebase recruitment data:', firebaseRecruitmentPosts.length, 'posts');
      setRecruitmentPosts(firebaseRecruitmentPosts);
      
      const open = firebaseRecruitmentPosts.filter(post => post.status === 'Ouvert').length;
      const inProgress = firebaseRecruitmentPosts.filter(post => post.status === 'En cours').length;
      const closed = firebaseRecruitmentPosts.filter(post => post.status === 'Clôturé').length;
      const totalApplications = firebaseRecruitmentPosts.reduce((acc, curr) => acc + (curr.applicationCount || 0), 0);
      
      setStats({ open, inProgress, closed, totalApplications });
      setIsLoading(false);
    } else if (!isMockLoading) {
      console.log('Using mock recruitment data:', mockRecruitmentPosts.length, 'posts');
      setRecruitmentPosts(mockRecruitmentPosts);
      setStats(mockStats);
      setIsLoading(false);
    }
  }, [isFirebaseLoading, isMockLoading, firebaseRecruitmentPosts, mockRecruitmentPosts, mockStats]);

  const { toast } = useToast();
  
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedRecruitment, setSelectedRecruitment] = useState<RecruitmentPost | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const [filterCriteria, setFilterCriteria] = useState({
    department: null as string | null,
    contractType: null as string | null,
    status: null as string | null,
    priority: null as string | null,
    location: null as string | null,
  });
  
  const handleViewRecruitment = (recruitment: RecruitmentPost) => {
    setSelectedRecruitment(recruitment);
    setShowViewDialog(true);
  };
  
  const handleScheduleRecruitment = (recruitment: RecruitmentPost) => {
    setSelectedRecruitment(recruitment);
    setShowScheduleDialog(true);
  };
  
  const filteredPosts = recruitmentPosts.filter(post => {
    if (filterCriteria.department && post.department !== filterCriteria.department) return false;
    if (filterCriteria.contractType && post.contractType !== filterCriteria.contractType) return false;
    if (filterCriteria.status && post.status !== filterCriteria.status) return false;
    if (filterCriteria.priority && post.priority !== filterCriteria.priority) return false;
    if (filterCriteria.location && post.location !== filterCriteria.location) return false;
    return true;
  });
  
  const handleExport = (format: 'excel' | 'pdf') => {
    const data = filteredPosts.map(post => ({
      'Position': post.position,
      'Département': post.department,
      'Date d\'ouverture': post.openDate,
      'Statut': post.status,
      'Localisation': post.location,
      'Type de contrat': post.contractType,
      'Priorité': post.priority,
      'Responsable': post.hiringManagerName,
      'Candidatures': post.applicationCount,
    }));
    
    if (format === 'excel') {
      exportToExcel(data, 'Offres d\'emploi', 'recrutements');
      toast({
        title: 'Export réussi',
        description: 'Les données ont été exportées au format Excel.'
      });
    } else {
      exportToPdf(data, 'Liste des offres d\'emploi', 'recrutements');
      toast({
        title: 'Export réussi',
        description: 'Les données ont été exportées au format PDF.'
      });
    }
  };
  
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    toast({
      title: 'Données actualisées',
      description: 'Les offres d\'emploi ont été mises à jour.'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Recrutement</h2>
          <p className="text-gray-500">Gestion des offres d'emploi et candidatures</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilterDialog(true)}
          >
            <ListFilter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleExport('excel')}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleExport('pdf')}
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button 
            size="sm"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle offre d'emploi
          </Button>
        </div>
      </div>
      
      <RecruitmentStats 
        openPositions={stats.open}
        applicationsThisMonth={42}
        interviewsScheduled={12}
        applicationsChange={8}
        isLoading={isLoading}
      />
      
      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Poste</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date d'ouverture</TableHead>
                  <TableHead>Candidatures</TableHead>
                  <TableHead>Priorité</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Chargement des offres d'emploi...
                    </TableCell>
                  </TableRow>
                ) : filteredPosts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Aucune offre d'emploi trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{post.position}</span>
                          <span className="text-xs text-gray-500">{post.department} • {post.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>{post.contractType}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            post.status === 'Ouvert'
                              ? 'bg-green-100 text-green-800'
                              : post.status === 'En cours'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {post.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{post.openDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-gray-500" />
                          {post.applicationCount}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            post.priority === 'Haute'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : post.priority === 'Moyenne'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }
                        >
                          {post.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewRecruitment(post)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Voir
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleScheduleRecruitment(post)}
                          >
                            <Calendar className="h-4 w-4 mr-1" />
                            Planifier
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <RecruitmentFilterDialog 
            filterCriteria={filterCriteria}
            setFilterCriteria={setFilterCriteria}
            onClose={() => setShowFilterDialog(false)}
          />
        </DialogContent>
      </Dialog>
      
      <CreateRecruitmentDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={handleRefresh}
      />
      
      <RecruitmentViewDialog 
        open={showViewDialog}
        onOpenChange={setShowViewDialog}
        recruitment={selectedRecruitment}
      />
      
      <RecruitmentScheduleDialog 
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
        recruitment={selectedRecruitment}
        onSuccess={handleRefresh}
      />
    </div>
  );
};

export default EmployeesRecruitment;
