
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Edit, ArrowLeft, Shield, AlertTriangle } from 'lucide-react';
import { Employee } from '@/types/employee';
import { useEmployeePermissions } from './hooks/useEmployeePermissions';

// Simule la récupération d'un employé (à remplacer par un vrai appel API)
const fetchEmployee = async (id: string): Promise<Employee | null> => {
  // Simulation d'appel API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Retourne un employé fictif pour la démonstration
  return {
    id,
    firstName: 'Martin',
    lastName: 'Dupont',
    email: 'martin.dupont@example.com',
    phone: '+33 6 12 34 56 78',
    department: 'Marketing',
    position: 'Chef de Projet Digital',
    hireDate: '15/03/2021',
    status: 'active',
    contract: 'CDI',
  };
};

const EmployeeProfileView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Utiliser le hook de permissions
  const { canView, canEdit, isOwnProfile, loading: permissionsLoading } = 
    useEmployeePermissions('employees-profiles', id);

  useEffect(() => {
    const loadEmployee = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await fetchEmployee(id);
        setEmployee(data);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        toast.error('Erreur lors du chargement des données de l\'employé');
      } finally {
        setLoading(false);
      }
    };

    loadEmployee();
  }, [id]);

  if (permissionsLoading || loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-20 mt-2" />
          </div>
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  // Vérifier si l'utilisateur a les permissions nécessaires
  if (!canView && !isOwnProfile) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Shield className="h-12 w-12 text-amber-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Accès restreint</h2>
              <p className="text-gray-500 mb-4">
                Vous n'avez pas les permissions nécessaires pour voir ce profil.
              </p>
              <Button onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Employé non trouvé</h2>
              <p className="text-gray-500 mb-4">
                L'employé demandé n'existe pas ou a été supprimé.
              </p>
              <Button onClick={() => navigate('/modules/employees/profiles')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête avec boutons d'action */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        
        {canEdit && (
          <Button onClick={() => navigate(`/modules/employees/profiles/${id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
        )}
      </div>
      
      {/* Carte profil principal */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Profil de l'employé</CardTitle>
            {isOwnProfile && (
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Votre profil
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage src={employee.profileImageUrl} alt={`${employee.firstName} ${employee.lastName}`} />
                <AvatarFallback className="text-2xl">
                  {employee.firstName?.[0]}{employee.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold">{employee.firstName} {employee.lastName}</h2>
                <p className="text-gray-500">{employee.position}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{employee.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p>{employee.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Département</p>
                  <p>{employee.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Statut</p>
                  <p className="capitalize">{employee.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type de contrat</p>
                  <p>{employee.contract}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date d'embauche</p>
                  <p>{employee.hireDate}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Cartes d'informations supplémentaires */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations professionnelles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Supérieur hiérarchique</p>
                <p>{employee.manager || 'Non défini'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ancienneté</p>
                <p>2 ans et 3 mois</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bureau</p>
                <p>Paris - Étage 3, Bureau 315</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Congés et absences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Jours de congés restants</p>
                <p>15 jours</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Congés pris cette année</p>
                <p>10 jours</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Prochaine absence prévue</p>
                <p>Du 15/08 au 30/08</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeProfileView;
