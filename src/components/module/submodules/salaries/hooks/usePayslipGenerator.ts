
import { useState, useCallback } from 'react';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { v4 as uuidv4 } from 'uuid';
import { PaySlip, PaySlipDetail } from '../types/payslip';
import { Company } from '@/components/module/submodules/companies/types';
import { Employee } from '@/types/employee';
import { savePaySlip } from '../services/payslipService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const usePayslipGenerator = () => {
  // État pour les données du formulaire
  const [employeeName, setEmployeeName] = useState('');
  const [period, setPeriod] = useState('');
  const [grossSalary, setGrossSalary] = useState('');
  const [overtimeHours, setOvertimeHours] = useState('0');
  const [overtimeRate, setOvertimeRate] = useState('25');
  const [showPreview, setShowPreview] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [currentPayslip, setCurrentPayslip] = useState<PaySlip | null>(null);

  const { companies } = useEmployeeData();

  // Handle company selection
  const handleCompanySelect = useCallback((companyId: string) => {
    setSelectedCompanyId(companyId);
    const company = companies.find(c => c.id === companyId);
    setSelectedCompany(company || null);
  }, [companies]);

  // Handle employee selection
  const handleEmployeeSelect = useCallback((employeeId: string, employees: Employee[]) => {
    const employee = employees.find(e => e.id === employeeId);
    if (employee) {
      setSelectedEmployee(employee);
      setEmployeeName(`${employee.firstName} ${employee.lastName}`);
    }
  }, []);

  // Générer la fiche de paie selon le Code du travail français
  const generatePayslip = useCallback(() => {
    if (!selectedEmployee || !selectedCompany) {
      console.error("Employé ou entreprise non sélectionné");
      return null;
    }

    // Vérifier que le salaire brut est un nombre valide
    const annualGrossSalary = parseFloat(grossSalary);
    if (isNaN(annualGrossSalary) || annualGrossSalary <= 0) {
      console.error("Salaire brut invalide");
      return null;
    }

    // Calculer le salaire mensuel (en France, c'est généralement l'annuel / 12)
    const monthlyGrossSalary = annualGrossSalary / 12;

    // Heures travaillées par mois (base légale française : 35h × 52/12 semaines = 151.67h)
    const standardMonthlyHours = 151.67;
    
    // Calcul des heures supplémentaires
    const overtimeHoursValue = parseFloat(overtimeHours) || 0;
    
    // Taux de majoration des heures supplémentaires
    // Code du travail français : 25% pour les 8 premières heures, 50% au-delà
    const firstOvertimeRate = 0.25; // 25% pour les 8 premières heures
    const secondOvertimeRate = 0.50; // 50% au-delà
    
    // Calculer le taux horaire
    const hourlyRate = monthlyGrossSalary / standardMonthlyHours;
    
    // Calculer la rémunération des heures supplémentaires
    let overtimeAmount = 0;
    if (overtimeHoursValue > 0) {
      const firstOvertimeHours = Math.min(overtimeHoursValue, 8);
      const secondOvertimeHours = Math.max(0, overtimeHoursValue - 8);
      
      overtimeAmount = 
        hourlyRate * firstOvertimeHours * (1 + firstOvertimeRate) +
        hourlyRate * secondOvertimeHours * (1 + secondOvertimeRate);
    }
    
    // Calculer le salaire brut total (mensuel + heures supplémentaires)
    const totalGrossSalary = monthlyGrossSalary + overtimeAmount;
    
    // Calculer les charges sociales (approximatif selon le système français)
    // Charges salariales : environ 22% du brut
    const employeeContributions = totalGrossSalary * 0.22;
    
    // Charges patronales : environ 42% du brut (non visible sur la fiche de paie)
    const employerContributions = totalGrossSalary * 0.42;
    
    // Calculer le salaire net
    const netSalary = totalGrossSalary - employeeContributions;
    
    // Créer les détails de la fiche de paie
    const details: PaySlipDetail[] = [
      {
        label: "Salaire de base",
        base: `${standardMonthlyHours} heures`,
        amount: monthlyGrossSalary,
        type: "earning"
      }
    ];
    
    // Ajouter les heures supplémentaires si présentes
    if (overtimeHoursValue > 0) {
      const firstOvertimeHours = Math.min(overtimeHoursValue, 8);
      if (firstOvertimeHours > 0) {
        details.push({
          label: "Heures supplémentaires (125%)",
          base: `${firstOvertimeHours} heures`,
          rate: "25%",
          amount: hourlyRate * firstOvertimeHours * (1 + firstOvertimeRate),
          type: "earning"
        });
      }
      
      const secondOvertimeHours = Math.max(0, overtimeHoursValue - 8);
      if (secondOvertimeHours > 0) {
        details.push({
          label: "Heures supplémentaires (150%)",
          base: `${secondOvertimeHours} heures`,
          rate: "50%",
          amount: hourlyRate * secondOvertimeHours * (1 + secondOvertimeRate),
          type: "earning"
        });
      }
    }
    
    // Ajouter les charges sociales
    details.push(
      {
        label: "Sécurité sociale - Maladie",
        rate: "0.75%",
        amount: totalGrossSalary * 0.0075,
        type: "deduction"
      },
      {
        label: "Sécurité sociale - Vieillesse plafonnée",
        rate: "6.90%",
        amount: totalGrossSalary * 0.069,
        type: "deduction"
      },
      {
        label: "Sécurité sociale - Vieillesse déplafonnée",
        rate: "0.40%",
        amount: totalGrossSalary * 0.004,
        type: "deduction"
      },
      {
        label: "Assurance chômage",
        rate: "2.40%",
        amount: totalGrossSalary * 0.024,
        type: "deduction"
      },
      {
        label: "Retraite complémentaire (AGIRC-ARRCO)",
        rate: "3.15%",
        amount: totalGrossSalary * 0.0315,
        type: "deduction"
      },
      {
        label: "CEG (Contribution d'équilibre général)",
        rate: "0.86%",
        amount: totalGrossSalary * 0.0086,
        type: "deduction"
      },
      {
        label: "CSG déductible",
        rate: "6.80%",
        amount: totalGrossSalary * 0.068,
        type: "deduction"
      },
      {
        label: "CSG/CRDS non déductible",
        rate: "2.90%",
        amount: totalGrossSalary * 0.029,
        type: "deduction"
      }
    );
    
    // Générer un ID unique
    const payslipId = uuidv4();
    
    // Obtenir la date actuelle
    const currentDate = new Date();
    const formattedDate = format(currentDate, 'dd/MM/yyyy');
    
    // Créer le mois et l'année à partir de la période
    const [month, year] = period.split(" ");
    
    // Calculer les congés et RTT (valeurs exemples)
    const conges = {
      acquired: 2.5, // 2.5 jours par mois travaillé
      taken: 0,
      balance: 25 // Solde maximum en France
    };
    
    const rtt = {
      acquired: 1,
      taken: 0,
      balance: 12
    };
    
    // Créer la fiche de paie
    const payslip: PaySlip = {
      id: payslipId,
      employee: {
        firstName: selectedEmployee.firstName,
        lastName: selectedEmployee.lastName,
        employeeId: selectedEmployee.id,
        role: selectedEmployee.position || selectedEmployee.role || "Employé",
        socialSecurityNumber: selectedEmployee.socialSecurityNumber || "1 99 99 99 999 999 99",
        startDate: selectedEmployee.startDate
      },
      period: period,
      details: details,
      grossSalary: totalGrossSalary,
      totalDeductions: employeeContributions,
      netSalary: netSalary,
      hoursWorked: standardMonthlyHours + parseFloat(overtimeHours || "0"),
      paymentDate: format(new Date(parseInt(year), new Date().getMonth() + 1, 0), 'dd/MM/yyyy'),
      employerName: selectedCompany.name,
      employerAddress: selectedCompany.address ? 
        `${selectedCompany.address.street}, ${selectedCompany.address.postalCode} ${selectedCompany.address.city}` : 
        "Adresse non spécifiée",
      employerSiret: selectedCompany.siret || "SIRET non spécifié",
      conges,
      rtt,
      annualCumulative: {
        grossSalary: annualGrossSalary,
        netSalary: netSalary * 12,
        taxableIncome: netSalary * 12 * 0.975 // Base imposable approximative
      },
      status: "Généré",
      date: formattedDate,
      employeeId: selectedEmployee.id,
      employeeName: `${selectedEmployee.firstName} ${selectedEmployee.lastName}`,
      month,
      year: parseInt(year),
      paymentMethod: "Virement bancaire"
    };
    
    // Sauvegarder la fiche de paie
    try {
      // Enregistrer la fiche de paie dans l'état local
      setCurrentPayslip(payslip);
      
      // Optionnellement, enregistrer dans la base de données
      // savePaySlip(payslip);
      
      return payslip;
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la fiche de paie:", error);
      return payslip; // Retourner quand même la fiche générée
    }
  }, [
    selectedEmployee, 
    selectedCompany, 
    grossSalary, 
    overtimeHours, 
    overtimeRate, 
    period
  ]);

  return {
    employeeName,
    setEmployeeName,
    period,
    setPeriod,
    grossSalary,
    setGrossSalary,
    overtimeHours,
    setOvertimeHours,
    overtimeRate,
    setOvertimeRate,
    selectedCompanyId,
    handleCompanySelect,
    handleEmployeeSelect,
    showPreview,
    setShowPreview,
    generatePayslip,
    selectedEmployeeId,
    setSelectedEmployeeId,
    selectedCompany,
    selectedEmployee,
    currentPayslip
  };
};
