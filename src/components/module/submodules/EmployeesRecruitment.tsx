
import React, { useState } from 'react';
import { useRecruitmentFirebaseData } from '@/hooks/useRecruitmentFirebaseData';
import { RecruitmentPost } from '@/hooks/useRecruitmentData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import RecruitmentStats from './employees/RecruitmentStats';
import { RefreshCw, Filter, Eye, Edit, Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const EmployeesRecruitment = () => {
  const { recruitmentPosts, isLoading, error, refreshData } = useRecruitmentFirebaseData();
  const [filterOpen, setFilterOpen] = useState(false);
  const { toast } = useToast();

  const handleRefresh = () => {
    refreshData();
    toast({
      title: "Données actualisées",
      description: "Les offres de recrutement ont été actualisées avec succès.",
    });
  };

  // Calcul des statistiques
  const openPositions = recruitmentPosts.filter(post => post.status === 'Ouvert').length;
  const inProgressPositions = recruitmentPosts.filter(post => post.status === 'En cours').length;
  const closedPositions = recruitmentPosts.filter(post => post.status === 'Clôturé').length;
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  // Filtre les candidatures du mois courant
  const applicationsThisMonth = recruitmentPosts.reduce((total, post) => {
    // Vérifie si le post a une date au format ISO string
    if (post.openDate) {
      const postDate = new Date(post.openDate);
      if (postDate.getMonth() === currentMonth && postDate.getFullYear() === currentYear) {
        return total + (post.applicationCount || 0);
      }
    }
    return total;
  }, 0);
  
  // Entretiens programmés (simulé)
  const interviewsScheduled = recruitmentPosts.reduce((total, post) => {
    return total + (post.interviewsScheduled || 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Recrutement</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setFilterOpen(!filterOpen)}
            className={filterOpen ? "bg-blue-50" : ""}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </div>

      {error ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-red-500">
              Une erreur est survenue lors du chargement des données: {error.message}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <RecruitmentStats 
            openPositions={openPositions}
            inProgressPositions={inProgressPositions}
            closedPositions={closedPositions}
            applicationsThisMonth={applicationsThisMonth}
            interviewsScheduled={interviewsScheduled}
            isLoading={isLoading}
          />
          
          {filterOpen && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">Filtres</h3>
                {/* ... Formulaire de filtre ... */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Département</label>
                    <select className="w-full border rounded p-2">
                      <option value="">Tous</option>
                      <option value="IT">IT</option>
                      <option value="RH">RH</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Statut</label>
                    <select className="w-full border rounded p-2">
                      <option value="">Tous</option>
                      <option value="Ouvert">Ouvert</option>
                      <option value="En cours">En cours</option>
                      <option value="Clôturé">Clôturé</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Priorité</label>
                    <select className="w-full border rounded p-2">
                      <option value="">Toutes</option>
                      <option value="Haute">Haute</option>
                      <option value="Moyenne">Moyenne</option>
                      <option value="Basse">Basse</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full">Appliquer</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poste</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Département</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'ouverture</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priorité</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidatures</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      Array(5).fill(0).map((_, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-3"><div className="h-5 bg-gray-200 rounded animate-pulse w-4/5"></div></td>
                          <td className="px-4 py-3"><div className="h-5 bg-gray-200 rounded animate-pulse w-2/3"></div></td>
                          <td className="px-4 py-3"><div className="h-5 bg-gray-200 rounded animate-pulse w-1/2"></div></td>
                          <td className="px-4 py-3"><div className="h-5 bg-gray-200 rounded animate-pulse w-2/5"></div></td>
                          <td className="px-4 py-3"><div className="h-5 bg-gray-200 rounded animate-pulse w-1/3"></div></td>
                          <td className="px-4 py-3"><div className="h-5 bg-gray-200 rounded animate-pulse w-1/4"></div></td>
                          <td className="px-4 py-3"><div className="h-5 bg-gray-200 rounded animate-pulse w-3/4"></div></td>
                        </tr>
                      ))
                    ) : recruitmentPosts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                          Aucune offre de recrutement disponible.
                        </td>
                      </tr>
                    ) : (
                      recruitmentPosts.map((post: RecruitmentPost) => (
                        <tr key={post.id} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-3">{post.position}</td>
                          <td className="px-4 py-3">{post.department}</td>
                          <td className="px-4 py-3">{post.openDate}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              post.status === 'Ouvert' ? 'bg-green-100 text-green-800' :
                              post.status === 'En cours' ? 'bg-blue-100 text-blue-800' : 
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {post.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              post.priority === 'Haute' ? 'bg-red-100 text-red-800' :
                              post.priority === 'Moyenne' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {post.priority}
                            </span>
                          </td>
                          <td className="px-4 py-3">{post.applicationCount || 0}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" title="Voir les détails">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" title="Modifier">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" title="Programmer un entretien">
                                <Calendar className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default EmployeesRecruitment;
