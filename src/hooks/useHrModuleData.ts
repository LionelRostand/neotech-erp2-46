
import { useEffect, useState } from 'react';
import { useHrData } from './modules/useHrData';
import { toast } from 'sonner';
import { Company } from '@/components/module/submodules/companies/types';

/**
 * Hook centralisant l'accès aux données du module HR (Employés)
 */
export const useHrModuleData = () => {
  const {
    employees,
    departments,
    contracts,
    leaveRequests,
    payslips,
    attendance,
    absenceRequests,
    hrDocuments,
    timeSheets,
    evaluations,
    trainings,
    hrReports,
    hrAlerts,
    isLoading,
    error
  } = useHrData();

  // État pour stocker les entreprises
  const [companies, setCompanies] = useState<Company[]>([]);

  // Simuler des données d'entreprises pour les besoins actuels
  useEffect(() => {
    // Création d'une liste d'entreprises fictives
    const mockCompanies: Company[] = [
      {
        id: 'comp-001',
        name: 'Entreprise Principale',
        address: {
          street: '123 Rue Principale',
          city: 'Paris',
          postalCode: '75001',
          country: 'France'
        },
        siret: '123 456 789 00012',
        logo: '',
        logoUrl: '',
        phone: '+33 1 23 45 67 89',
        email: 'contact@entrepriseprincipale.fr',
        website: 'www.entrepriseprincipale.fr',
        industry: 'Technologie',
        size: 'Grande entreprise',
        status: 'active',
        employeesCount: 500,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'comp-002',
        name: 'Filiale A',
        address: {
          street: '45 Avenue de la République',
          city: 'Lyon',
          postalCode: '69001',
          country: 'France'
        },
        siret: '987 654 321 00021',
        logo: '',
        logoUrl: '',
        phone: '+33 4 56 78 90 12',
        email: 'contact@filialea.fr',
        website: 'www.filialea.fr',
        industry: 'Services',
        size: 'Moyenne entreprise',
        status: 'active',
        employeesCount: 150,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    setCompanies(mockCompanies);
  }, []);

  useEffect(() => {
    if (error) {
      console.error('Erreur lors du chargement des données RH:', error);
      toast.error('Erreur lors du chargement des données. Veuillez réessayer.');
    }
  }, [error]);

  return {
    employees: employees || [],
    departments: departments || [],
    contracts: contracts || [],
    leaveRequests: leaveRequests || [],
    payslips: payslips || [],
    attendance: attendance || [],
    absenceRequests: absenceRequests || [],
    hrDocuments: hrDocuments || [],
    timeSheets: timeSheets || [],
    evaluations: evaluations || [],
    trainings: trainings || [],
    hrReports: hrReports || [],
    hrAlerts: hrAlerts || [],
    companies: companies || [], // Ajout de l'exposition des données d'entreprises
    isLoading,
    error
  };
};
