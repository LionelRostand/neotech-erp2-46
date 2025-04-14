
import { useState, useEffect } from 'react';
import { useEmployeeContract } from '@/hooks/useEmployeeContract';
import { toast } from 'sonner';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { addDocument } from '@/hooks/firestore/create-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { PaySlip } from '@/types/payslip';
import { addPayslipToEmployee } from '../services/employeeSalaryService';

export const useSalaryForm = () => {
  const { employees } = useHrModuleData();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [baseSalary, setBaseSalary] = useState<number>(0);
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [paymentMethod, setPaymentMethod] = useState<string>('Virement');
  const [notes, setNotes] = useState<string>('');

  // Utiliser le hook pour récupérer le salaire du contrat
  const { salary: contractSalary } = useEmployeeContract(selectedEmployeeId);

  // Mettre à jour le salaire de base quand un employé est sélectionné
  useEffect(() => {
    if (selectedEmployeeId && contractSalary) {
      setBaseSalary(contractSalary);
      console.log(`Salaire du contrat récupéré: ${contractSalary}€`);
    }
  }, [selectedEmployeeId, contractSalary]);

  const handleEmployeeSelect = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    const selectedEmployee = employees.find(emp => emp.id === employeeId);

    if (selectedEmployee) {
      // Utiliser les données de congés si disponibles
      const conges = selectedEmployee.conges || {
        acquired: 0,
        taken: 0,
        balance: 0
      };

      // Utiliser les données de RTT si disponibles
      const rtt = selectedEmployee.rtt || {
        acquired: 0,
        taken: 0,
        balance: 0
      };

      console.log('Données de congés:', conges);
      console.log('Données RTT:', rtt);
    }
  };

  const handleSubmit = async () => {
    if (!selectedEmployeeId || !month || !year) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId);

    if (!selectedEmployee) {
      toast.error('Employé non trouvé');
      return;
    }

    const employeeName = `${selectedEmployee.firstName} ${selectedEmployee.lastName}`;

    // Créer un objet PaySlip simplifié
    const newPaySlip: PaySlip = {
      id: '', // L'ID sera généré par Firestore
      employee: {
        firstName: selectedEmployee.firstName,
        lastName: selectedEmployee.lastName,
        employeeId: selectedEmployeeId,
        role: selectedEmployee.role,
        socialSecurityNumber: selectedEmployee.socialSecurityNumber,
        startDate: selectedEmployee.startDate
      },
      period: `${month} ${year}`,
      details: [
        {
          label: "Salaire de base",
          amount: baseSalary,
          type: "earning"
        }
      ],
      grossSalary: baseSalary,
      totalDeductions: 0,
      netSalary: baseSalary,
      hoursWorked: 151.67,
      paymentDate: new Date().toISOString(),
      employerName: 'NEOTECH',
      employerAddress: 'Paris, France',
      employerSiret: '12345678901234',
      month: month,
      year: year,
      employeeId: selectedEmployeeId,
      employeeName: employeeName,
      status: 'Généré',
      date: new Date().toISOString(),
      paymentMethod: paymentMethod,
      notes: notes
    };

    try {
      // Créer la fiche de paie dans Firestore en utilisant addDocument au lieu de createDocument
      const payslipRef = await addDocument(COLLECTIONS.HR.PAYSLIPS, newPaySlip);
      const payslipId = payslipRef.id;

      // Associer la fiche de paie à l'employé
      const success = await addPayslipToEmployee(selectedEmployeeId, payslipId);

      if (success) {
        toast.success('Fiche de paie créée et associée avec succès');
      } else {
        toast.error('Fiche de paie créée, mais erreur lors de l\'association à l\'employé');
      }
    } catch (error) {
      console.error("Erreur lors de la création de la fiche de paie:", error);
      toast.error("Erreur lors de la création de la fiche de paie");
    }
  };

  return {
    selectedEmployeeId,
    baseSalary,
    month,
    year,
    paymentMethod,
    notes,
    handleEmployeeSelect,
    setBaseSalary,
    setMonth,
    setYear,
    setPaymentMethod,
    setNotes,
    handleSubmit
  };
};
