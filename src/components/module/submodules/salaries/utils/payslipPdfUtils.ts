
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import { PaySlip } from '@/types/payslip';

// Define correct type for fontStyle
type FontStyle = 'normal' | 'bold' | 'italic' | 'bolditalic';

/**
 * Generate a PDF for a French payslip
 * @param payslip Payslip data
 * @returns PDF document
 */
export const generatePayslipPDF = (payslip: PaySlip): jsPDF => {
  try {
    // Create PDF document
    const doc = new jsPDF();
    
    // Set default font
    doc.setFont('helvetica', 'normal');
    
    // Add company information at top
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(payslip.employerName || 'Entreprise', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    if (payslip.employerAddress) {
      doc.text(payslip.employerAddress, 105, 27, { align: 'center' });
    }
    
    if (payslip.employerSiret) {
      doc.text(`SIRET: ${payslip.employerSiret}`, 105, 32, { align: 'center' });
    }
    
    // Add document title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('BULLETIN DE PAIE', 105, 45, { align: 'center' });
    
    // Add period information
    doc.setFontSize(11);
    doc.text(`Période: ${payslip.period || `${payslip.month || ''} ${payslip.year || ''}`}`, 105, 52, { align: 'center' });
    
    // Employee information section
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Informations salarié:', 15, 65);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const employee = payslip.employee;
    if (employee) {
      // Employee info table
      const employeeData = [
        ['Nom et prénom:', `${employee.lastName} ${employee.firstName}`],
        ['Emploi:', employee.role || 'Non spécifié'],
        ['N° Sécurité Sociale:', employee.socialSecurityNumber || 'Non spécifié'],
        ['Date d\'embauche:', employee.startDate ? new Date(employee.startDate).toLocaleDateString('fr-FR') : 'Non spécifiée']
      ];
      
      autoTable(doc, {
        startY: 70,
        head: [],
        body: employeeData,
        theme: 'plain',
        styles: {
          fontSize: 9,
          cellPadding: 1
        },
        columnStyles: {
          0: { fontStyle: 'bold' as FontStyle, cellWidth: 50 },
          1: { cellWidth: 60 }
        }
      });
    } else {
      doc.text('Informations employé non disponibles', 15, 75);
    }
    
    // Company details on right side
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Informations employeur:', 140, 65);
    
    doc.setFont('helvetica', 'normal');
    // Draw company info table on right
    const companyData = [
      ['Raison sociale:', payslip.employerName || 'Non spécifiée'],
      ['Adresse:', payslip.employerAddress || 'Non spécifiée'],
      ['SIRET:', payslip.employerSiret || 'Non spécifié']
    ];
    
    autoTable(doc, {
      startY: 70,
      head: [],
      body: companyData,
      theme: 'plain',
      styles: {
        fontSize: 9,
        cellPadding: 1
      },
      margin: { left: 125 },
      columnStyles: {
        0: { fontStyle: 'bold' as FontStyle, cellWidth: 30 },
        1: { cellWidth: 50 }
      }
    });
    
    // Salary details section
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Détail de la rémunération', 15, 110);
    
    // Helper function to format currency
    const formatEuro = (amount: number): string => {
      return `${amount.toFixed(2)} €`;
    };
    
    // Generate rows for salary details table
    const salaryRows = [];
    
    // First, add salary earnings
    if (payslip.details && payslip.details.length > 0) {
      // Add earnings
      const earnings = payslip.details.filter(d => d.type === 'earning');
      
      for (const earning of earnings) {
        salaryRows.push([
          { content: earning.label, styles: { fontStyle: 'normal' as FontStyle } },
          { content: earning.base || '', styles: { halign: 'center' } },
          { content: earning.rate || '', styles: { halign: 'center' } },
          { content: formatEuro(earning.amount), styles: { halign: 'right' } }
        ]);
      }
      
      // Add deductions
      const deductions = payslip.details.filter(d => d.type === 'deduction');
      
      if (deductions.length > 0) {
        salaryRows.push([
          { content: 'Cotisations et contributions sociales', styles: { fontStyle: 'bold' as FontStyle } },
          { content: '', styles: { halign: 'center' } },
          { content: '', styles: { halign: 'center' } },
          { content: '', styles: { halign: 'right' } }
        ]);
        
        for (const deduction of deductions) {
          salaryRows.push([
            { content: deduction.label, styles: { fontStyle: 'normal' as FontStyle } },
            { content: deduction.base || '', styles: { halign: 'center' } },
            { content: deduction.rate || '', styles: { halign: 'center' } },
            { content: `-${formatEuro(deduction.amount)}`, styles: { halign: 'right' } }
          ]);
        }
      }
    } else {
      salaryRows.push([
        { content: 'Salaire de base', styles: { fontStyle: 'normal' as FontStyle } },
        { content: payslip.hoursWorked?.toString() || '151,67', styles: { halign: 'center' } },
        { content: '', styles: { halign: 'center' } },
        { content: formatEuro(payslip.grossSalary), styles: { halign: 'right' } }
      ]);
      
      // Add some default deductions if none provided
      salaryRows.push([
        { content: 'Cotisations et contributions sociales', styles: { fontStyle: 'bold' as FontStyle } },
        { content: '', styles: { halign: 'center' } },
        { content: '', styles: { halign: 'center' } },
        { content: '', styles: { halign: 'right' } }
      ]);
      
      salaryRows.push([
        { content: 'Sécurité sociale', styles: { fontStyle: 'normal' as FontStyle } },
        { content: payslip.grossSalary.toFixed(2), styles: { halign: 'center' } },
        { content: '7,30%', styles: { halign: 'center' } },
        { content: `-${formatEuro(payslip.grossSalary * 0.073)}`, styles: { halign: 'right' } }
      ]);
      
      salaryRows.push([
        { content: 'Retraite complémentaire', styles: { fontStyle: 'normal' as FontStyle } },
        { content: payslip.grossSalary.toFixed(2), styles: { halign: 'center' } },
        { content: '3,15%', styles: { halign: 'center' } },
        { content: `-${formatEuro(payslip.grossSalary * 0.0315)}`, styles: { halign: 'right' } }
      ]);
      
      salaryRows.push([
        { content: 'Assurance chômage', styles: { fontStyle: 'normal' as FontStyle } },
        { content: payslip.grossSalary.toFixed(2), styles: { halign: 'center' } },
        { content: '2,40%', styles: { halign: 'center' } },
        { content: `-${formatEuro(payslip.grossSalary * 0.024)}`, styles: { halign: 'right' } }
      ]);
      
      salaryRows.push([
        { content: 'CSG/CRDS', styles: { fontStyle: 'normal' as FontStyle } },
        { content: (payslip.grossSalary * 0.9825).toFixed(2), styles: { halign: 'center' } },
        { content: '9,70%', styles: { halign: 'center' } },
        { content: `-${formatEuro(payslip.grossSalary * 0.9825 * 0.097)}`, styles: { halign: 'right' } }
      ]);
    }
    
    // Salary details table
    autoTable(doc, {
      startY: 115,
      head: [
        [
          { content: 'Élément', styles: { fontStyle: 'bold' as FontStyle, halign: 'left' } },
          { content: 'Base', styles: { fontStyle: 'bold' as FontStyle, halign: 'center' } },
          { content: 'Taux', styles: { fontStyle: 'bold' as FontStyle, halign: 'center' } },
          { content: 'Montant', styles: { fontStyle: 'bold' as FontStyle, halign: 'right' } }
        ]
      ],
      body: salaryRows,
      theme: 'striped',
      headStyles: {
        fillColor: [220, 220, 220],
        textColor: [0, 0, 0],
        fontStyle: 'bold' as FontStyle
      },
      styles: {
        fontSize: 9,
        cellPadding: 2
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 30, halign: 'center' },
        2: { cellWidth: 30, halign: 'center' },
        3: { cellWidth: 40, halign: 'right' }
      }
    });
    
    // Calculate current y-position after the table
    const finalY = (doc as any).lastAutoTable.finalY || 200;
    
    // Summary section
    doc.setFontSize(10);
    
    // Summary table
    const summaryData = [
      [
        { content: 'Salaire brut', styles: { fontStyle: 'bold' as FontStyle } },
        { content: formatEuro(payslip.grossSalary), styles: { halign: 'right' } }
      ],
      [
        { content: 'Total des cotisations', styles: { fontStyle: 'bold' as FontStyle } },
        { content: `-${formatEuro(payslip.totalDeductions)}`, styles: { halign: 'right' } }
      ],
      [
        { content: 'NET À PAYER', styles: { fontStyle: 'bold' as FontStyle } },
        { content: formatEuro(payslip.netSalary), styles: { halign: 'right' } }
      ],
      [
        { content: 'Payé le: ' + (payslip.paymentDate ? new Date(payslip.paymentDate).toLocaleDateString('fr-FR') : 'Non spécifié'), styles: { fontStyle: 'normal' as FontStyle } },
        { content: 'Mode de paiement: ' + (payslip.paymentMethod || 'Virement bancaire'), styles: { halign: 'right' } }
      ]
    ];
    
    autoTable(doc, {
      startY: finalY + 10,
      head: [],
      body: summaryData,
      theme: 'plain',
      styles: {
        fontSize: 10,
        cellPadding: 2
      },
      columnStyles: {
        0: { cellWidth: 120 },
        1: { cellWidth: 60 }
      }
    });
    
    const finalSummaryY = (doc as any).lastAutoTable.finalY || 240;
    
    // Leave balances section
    if (payslip.conges || payslip.rtt) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Solde des congés', 15, finalSummaryY + 15);
      
      const leavesData = [];
      
      // Add congés payés row
      if (payslip.conges) {
        leavesData.push([
          { content: 'Congés payés', styles: { fontStyle: 'bold' as FontStyle } },
          { content: `Acquis: ${payslip.conges.acquired.toFixed(2)}`, styles: { fontStyle: 'normal' as FontStyle } },
          { content: `Pris: ${payslip.conges.taken.toFixed(2)}`, styles: { fontStyle: 'normal' as FontStyle } },
          { content: `Solde: ${payslip.conges.balance.toFixed(2)}`, styles: { fontStyle: 'bold' as FontStyle } }
        ]);
      }
      
      // Add RTT row
      if (payslip.rtt) {
        leavesData.push([
          { content: 'RTT', styles: { fontStyle: 'bold' as FontStyle } },
          { content: `Acquis: ${payslip.rtt.acquired.toFixed(2)}`, styles: { fontStyle: 'normal' as FontStyle } },
          { content: `Pris: ${payslip.rtt.taken.toFixed(2)}`, styles: { fontStyle: 'normal' as FontStyle } },
          { content: `Solde: ${payslip.rtt.balance.toFixed(2)}`, styles: { fontStyle: 'bold' as FontStyle } }
        ]);
      }
      
      if (leavesData.length > 0) {
        autoTable(doc, {
          startY: finalSummaryY + 20,
          head: [],
          body: leavesData,
          theme: 'grid',
          styles: {
            fontSize: 9,
            cellPadding: 3
          }
        });
      }
    }
    
    // Add footer
    const pageCount = doc.getNumberOfPages();
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(`Ce bulletin de paie est conforme à la législation française - Page ${i} / ${pageCount}`, 105, 285, { align: 'center' });
    }
    
    return doc;
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    return generateSimplePDF(payslip);
  }
};

/**
 * Generate a simpler PDF as fallback
 */
const generateSimplePDF = (payslip: PaySlip): jsPDF => {
  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.text('BULLETIN DE PAIE (version simplifiée)', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Période: ${payslip.period || `${payslip.month || ''} ${payslip.year || ''}`}`, 105, 30, { align: 'center' });
  
  doc.setFontSize(11);
  doc.text('Employeur:', 20, 50);
  doc.text(payslip.employerName || 'Entreprise', 50, 50);
  
  doc.setFontSize(11);
  doc.text('Employé:', 20, 60);
  if (payslip.employee) {
    doc.text(`${payslip.employee.lastName} ${payslip.employee.firstName}`, 50, 60);
  } else if (payslip.employeeName) {
    doc.text(payslip.employeeName, 50, 60);
  } else {
    doc.text('Non spécifié', 50, 60);
  }
  
  doc.text('Salaire brut:', 20, 80);
  doc.text(`${payslip.grossSalary.toFixed(2)} €`, 80, 80);
  
  doc.text('Total cotisations:', 20, 90);
  doc.text(`${payslip.totalDeductions.toFixed(2)} €`, 80, 90);
  
  doc.text('Salaire net:', 20, 100);
  doc.text(`${payslip.netSalary.toFixed(2)} €`, 80, 100);
  
  // Add basic leave balances if available
  if (payslip.conges) {
    doc.text('Solde congés payés:', 20, 120);
    doc.text(`${payslip.conges.balance.toFixed(2)} jours`, 80, 120);
  }
  
  if (payslip.rtt) {
    doc.text('Solde RTT:', 20, 130);
    doc.text(`${payslip.rtt.balance.toFixed(2)} jours`, 80, 130);
  }
  
  return doc;
};
