
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PaySlip } from '@/types/payslip';

// Déclaration de types pour jspdf-autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: {
      finalY: number;
    };
  }
}

// Fonction principale pour générer le PDF d'une fiche de paie
export const generatePayslipPDF = (payslip: PaySlip): jsPDF => {
  try {
    // Création du document
    const doc = new jsPDF();
    
    // Vérification de la disponibilité de autoTable
    if (typeof doc.autoTable !== 'function') {
      console.error('La fonction autoTable n\'est pas disponible');
      return generateBasicPayslip(payslip);
    }
    
    // Date de la fiche de paie
    const date = payslip.month ? `${payslip.month} ${payslip.year}` : (payslip.period || 'Non spécifié');
    
    // En-tête principal
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text("BULLETIN DE PAIE", 105, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`EN EUROS - ${date}`, 105, 20, { align: 'center' });
    
    doc.setLineWidth(0.1);
    doc.line(14, 25, 196, 25);
    
    // Section 1: Informations employeur et employé
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    
    // Informations employeur (côté gauche)
    doc.text(payslip.employerName || 'Entreprise', 15, 35);
    const employerAddress = payslip.employerAddress?.split(',') || ['Adresse non spécifiée'];
    employerAddress.forEach((line, index) => {
      doc.text(line.trim(), 15, 40 + (index * 5));
    });
    
    doc.setFont('helvetica', 'normal');
    doc.text(`N° SIRET: ${payslip.employerSiret || 'Non spécifié'}`, 15, 55);
    
    // Informations employé (côté droit)
    doc.setFont('helvetica', 'bold');
    const employeeName = `${payslip.employee?.firstName || ''} ${payslip.employee?.lastName || ''}`.trim();
    doc.text(employeeName, 130, 35);
    
    doc.setFont('helvetica', 'normal');
    doc.text(`N° sécurité sociale: ${payslip.employee?.socialSecurityNumber || 'Non spécifié'}`, 130, 45);
    doc.text(`Emploi: ${payslip.employee?.role || 'Non spécifié'}`, 130, 50);
    doc.text(`Période: ${date}`, 130, 55);
    
    // Démarrage de la section salaire après l'en-tête
    let yPosition = 70;
    
    // Section 2: Salaire et montants principaux
    doc.setFillColor(240, 247, 255);
    doc.rect(14, yPosition, 182, 40, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.text(`Bonjour ${payslip.employee?.firstName || ''}`, 15, yPosition + 10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Voici votre bulletin de paie de ${date}`, 15, yPosition + 15);
    
    // Calcul des montants (simplifiés pour l'exemple)
    const grossSalary = payslip.grossSalary || 0;
    const taxAmount = payslip.totalDeductions || (grossSalary * 0.03);
    const netBeforeTax = grossSalary - taxAmount;
    const netSalary = payslip.netSalary || (grossSalary * 0.78);
    const socialAmount = payslip.netSalary ? (payslip.netSalary * 1.05) : (grossSalary * 0.82);
    
    doc.setFont('helvetica', 'bold');
    doc.text("Votre salaire avant impôt", 15, yPosition + 25);
    doc.text(`${netBeforeTax.toFixed(2)} €`, 180, yPosition + 25, { align: 'right' });
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Prélèvement à la source (3,60 %)`, 15, yPosition + 30);
    doc.text(`${taxAmount.toFixed(2)} €`, 180, yPosition + 30, { align: 'right' });
    
    doc.setFont('helvetica', 'bold');
    doc.text("Votre salaire après impôt", 15, yPosition + 35);
    doc.text(`${netSalary.toFixed(2)} €`, 180, yPosition + 35, { align: 'right' });
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Ce montant vous sera transféré le ${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`, 15, yPosition + 40);
    
    // Montant net social
    doc.setFont('helvetica', 'bold');
    doc.text("Votre montant net social", 15, yPosition + 50);
    doc.text(`${socialAmount.toFixed(2)} €`, 180, yPosition + 50, { align: 'right' });
    
    doc.setFont('helvetica', 'normal');
    doc.text("Ce montant sert au calcul de vos aides sociales", 15, yPosition + 55);
    
    // Section 3: Détail du calcul du salaire
    yPosition += 70;
    
    doc.setFillColor(255, 255, 255);
    doc.rect(14, yPosition, 182, 90, 'S');
    
    doc.setFont('helvetica', 'bold');
    doc.text("Calcul du salaire net", 80, yPosition + 10);
    
    // Tableau de calcul
    const calculData = [
      ['Rémunération brute', `${grossSalary.toFixed(2)} €`],
      ['Cotisations et contributions salariales', `- ${taxAmount.toFixed(2)} €`],
      ['Indemnités non soumises', '+ 0,00 €'],
      ['Autres retenues', '- 0,00 €'],
      ['Prélèvement à la source', `- ${taxAmount.toFixed(2)} €`],
      ['Net à payer', `${netSalary.toFixed(2)} €`],
    ];
    
    autoTable(doc, {
      startY: yPosition + 15,
      head: [['', '']],
      body: calculData,
      theme: 'plain',
      styles: {
        cellPadding: 2,
      },
      columnStyles: {
        0: { halign: 'left', fontStyle: 'bold' },
        1: { halign: 'right' }
      },
    });
    
    // Section 4: Cumuls
    yPosition += 100;
    
    doc.setFillColor(255, 251, 235);
    doc.rect(14, yPosition, 182, 60, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.text("Cumuls DEPUIS JANV. 2025", 80, yPosition + 10);
    
    // Calcul des cumuls annuels
    const annualGross = payslip.annualCumulative?.grossSalary || (grossSalary * 2);
    const annualNet = payslip.annualCumulative?.netSalary || (netSalary * 2);
    const annualTax = payslip.annualCumulative?.taxableIncome || (taxAmount * 2);
    
    // Tableau des cumuls
    const cumulData = [
      ['Salaire net imposable', `${annualNet.toFixed(2)} €`],
      ['Salaire brut', `${annualGross.toFixed(2)} €`],
      ['Prélèvement à la source', `${annualTax.toFixed(2)} €`],
      ['Montant net des heures supplémentaires exonérées', '0,00 €'],
      ['Temps travaillé', '151,67 h'],
    ];
    
    autoTable(doc, {
      startY: yPosition + 15,
      body: cumulData,
      theme: 'plain',
      styles: {
        cellPadding: 2,
      },
      columnStyles: {
        0: { halign: 'left', fontStyle: 'bold' },
        1: { halign: 'right' }
      },
    });
    
    // Section 5: Congés et RTT
    yPosition = doc.lastAutoTable.finalY + 10;
    
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(14, yPosition, 182, 80, 3, 3, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.text("Congés disponibles", 80, yPosition + 10);
    
    // Récupération des données de congés
    const conges = payslip.conges || { acquired: 0, taken: 0, balance: 0 };
    const rtt = payslip.rtt || { acquired: 0, taken: 0, balance: 0 };
    
    // Création d'un tableau pour les congés
    const congesData = [
      [{ content: 'CP N-2', styles: { fontStyle: 'bold' } }, { content: '0,00 jours', styles: { halign: 'right' } }],
      ['+ Acquis', `${conges.acquired.toFixed(2)} j`],
      ['- Pris', `${conges.taken.toFixed(2)} j`],
      ['Solde', `${conges.balance.toFixed(2)} j`],
      [{ content: 'CP N-1', styles: { fontStyle: 'bold' } }, { content: '0,00 jours', styles: { halign: 'right' } }],
      ['+ Acquis', '25,00 j'],
      ['- Pris', '25,00 j'],
      ['Solde', '0,00 j'],
      [{ content: 'CP N', styles: { fontStyle: 'bold' } }, { content: `${conges.balance.toFixed(2)} jours`, styles: { halign: 'right' } }],
      ['+ Acquis', `${conges.acquired.toFixed(2)} j`],
      ['- Pris', `${conges.taken.toFixed(2)} j`],
      ['Solde', `${conges.balance.toFixed(2)} j`],
    ];
    
    autoTable(doc, {
      startY: yPosition + 15,
      body: congesData,
      theme: 'plain',
      styles: {
        cellPadding: 1,
      },
      columnStyles: {
        0: { halign: 'left' },
        1: { halign: 'right' }
      },
    });
    
    // Section RTT
    const rttData = [
      [{ content: 'RTT', styles: { fontStyle: 'bold' } }, { content: `${rtt.balance.toFixed(2)} jours`, styles: { halign: 'right' } }],
      ['+ Acquis', `${rtt.acquired.toFixed(2)} j`],
      ['- Pris', `${rtt.taken.toFixed(2)} j`],
      ['Solde', `${rtt.balance.toFixed(2)} j`],
    ];
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 5,
      body: rttData,
      theme: 'plain',
      styles: {
        cellPadding: 1,
      },
      columnStyles: {
        0: { halign: 'left' },
        1: { halign: 'right' }
      },
    });
    
    // Pied de page et vérification
    const pageHeight = doc.internal.pageSize.height;
    
    // QR code ou code de vérification (simulé)
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(15, pageHeight - 40, 40, 40, 3, 3, 'F');
    
    doc.setFontSize(8);
    doc.text("Vérifiez l'intégrité du bulletin", 35, pageHeight - 20, { align: 'center' });
    doc.text(`CODE DE VÉRIFICATION: ${Math.random().toString(36).substring(2, 8).toUpperCase()}`, 35, pageHeight - 10, { align: 'center' });
    
    doc.text("Retrouvez tous les détails de votre fichier en deuxième page de votre bulletin de paie", 130, pageHeight - 20);
    
    doc.setFontSize(6);
    doc.text("Dans votre intérêt, et pour vous aider à faire valoir vos droits, conservez ce document sans limitation de durée", 105, pageHeight - 5, { align: 'center' });
    
    // Deuxième page avec détails supplémentaires
    doc.addPage();
    
    // En-tête de la page 2
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("BULLETIN DE PAIE", 105, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`EN EUROS`, 105, 20, { align: 'center' });
    
    // Informations employeur et employé
    doc.setFontSize(10);
    doc.text(payslip.employerName || 'Entreprise', 20, 35);
    doc.setFont('helvetica', 'normal');
    employerAddress.forEach((line, index) => {
      doc.text(line.trim(), 20, 40 + (index * 5));
    });
    
    doc.setFont('helvetica', 'bold');
    doc.text(employeeName, 150, 35, { align: 'center' });
    
    // Tableau des cotisations détaillées
    const detailsData = [];
    
    // Ligne 1: Informations principales
    detailsData.push([
      { content: 'CATÉGORIE', styles: { fontStyle: 'bold' } },
      { content: 'Ingénieurs et Cadres', styles: { fontStyle: 'normal' } },
      { content: 'EMPLOI', styles: { fontStyle: 'bold' } },
      { content: payslip.employee?.role || 'Non spécifié', styles: { fontStyle: 'normal' } }
    ]);
    
    // Ligne 2: Classification et coefficient
    detailsData.push([
      { content: 'CLASSIFICATION', styles: { fontStyle: 'bold' } },
      { content: 'Salarié - Cadre', styles: { fontStyle: 'normal' } },
      { content: 'MINIMUM COEFFICIENT', styles: { fontStyle: 'bold' } },
      { content: '2 530,00', styles: { fontStyle: 'normal' } }
    ]);
    
    // Ligne 3: Rémunération
    detailsData.push([
      { content: 'PÉRIODE', styles: { fontStyle: 'bold' } },
      { content: `01/${new Date().getMonth() + 1}/${new Date().getFullYear()} - ${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`, styles: { fontStyle: 'normal' } },
      { content: 'RÉMUNÉRATION TOTALE', styles: { fontStyle: 'bold' } },
      { content: `${grossSalary.toFixed(2)} €`, styles: { fontStyle: 'normal' } }
    ]);
    
    autoTable(doc, {
      startY: 50,
      body: detailsData,
      theme: 'plain',
      styles: {
        cellPadding: 3,
      },
    });
    
    // Tableau détaillé des rubriques de paie
    yPosition = doc.lastAutoTable.finalY + 10;
    
    // En-têtes du tableau détaillé
    const headDetailsData = [
      [
        'DÉSIGNATION', 'BASE', 'PART SALARIÉ', 'PART EMPLOYEUR'
      ],
      [
        '', '', 'TAUX OU %', 'MONTANT', 'TAUX OU %', 'MONTANT'
      ]
    ];
    
    // Corps du tableau détaillé (simplifié pour l'exemple)
    const bodyDetailsData = [
      // Section brut
      [{ content: 'Salaire de base', styles: { fontStyle: 'bold' } }, '151,67', '26,6827', `${(grossSalary * 0.85).toFixed(2)}`, '', ''],
      ['Heures supplémentaires 25%', '0', '0', '0,00', '', ''],
      [{ content: 'Rémunération brute', styles: { fontStyle: 'bold' } }, '', '', `${grossSalary.toFixed(2)}`, '', ''],
      
      // Section cotisations
      [{ content: 'Sécurité sociale', styles: { fontStyle: 'bold' } }, `${grossSalary.toFixed(2)}`, '6,90', `${(grossSalary * 0.069).toFixed(2)}`, '13,00', `${(grossSalary * 0.13).toFixed(2)}`],
      ['Assurance chômage', `${grossSalary.toFixed(2)}`, '0,00', '0,00', '4,05', `${(grossSalary * 0.0405).toFixed(2)}`],
      ['Retraite complémentaire', `${grossSalary.toFixed(2)}`, '3,93', `${(grossSalary * 0.0393).toFixed(2)}`, '5,85', `${(grossSalary * 0.0585).toFixed(2)}`],
      ['CSG déductible', `${(grossSalary * 0.9825).toFixed(2)}`, '6,80', `${(grossSalary * 0.9825 * 0.068).toFixed(2)}`, '', ''],
      ['CSG/CRDS non déductible', `${(grossSalary * 0.9825).toFixed(2)}`, '2,90', `${(grossSalary * 0.9825 * 0.029).toFixed(2)}`, '', ''],
      
      // Totaux
      [{ content: 'TOTAL COTISATIONS SALARIALES', styles: { fontStyle: 'bold' } }, '', '', `${taxAmount.toFixed(2)}`, '', ''],
      [{ content: 'TOTAL COTISATIONS PATRONALES', styles: { fontStyle: 'bold' } }, '', '', '', '', `${(grossSalary * 0.42).toFixed(2)}`],
      
      // Résultats finaux
      [{ content: 'Net à payer avant impôt', styles: { fontStyle: 'bold' } }, '', '', `${netBeforeTax.toFixed(2)}`, '', ''],
      [{ content: 'Net payé en euros (Virement)', styles: { fontStyle: 'bold' } }, '', '', `${netSalary.toFixed(2)}`, '', ''],
    ];
    
    autoTable(doc, {
      startY: yPosition,
      head: headDetailsData,
      body: bodyDetailsData,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
      },
    });
    
    // Tableau de solde des congés
    yPosition = doc.lastAutoTable.finalY + 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text("Soldes de congés", 105, yPosition, { align: 'center' });
    
    // En-têtes du tableau des congés
    const headCongesData = [
      [
        '', 'CP N-2', 'CP N-1', 'CP N'
      ]
    ];
    
    // Corps du tableau des congés
    const bodyCongesData = [
      ['Acquis', `${conges.acquired.toFixed(2)}`, '25,00', '18,75'],
      ['Pris', `${conges.taken.toFixed(2)}`, '25,00', '1,50'],
      ['Solde', `${conges.balance.toFixed(2)}`, '0,00', '17,25'],
    ];
    
    autoTable(doc, {
      startY: yPosition + 5,
      head: headCongesData,
      body: bodyCongesData,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
      },
    });
    
    // Cumuls annuels
    yPosition = doc.lastAutoTable.finalY + 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text("Cumuls DEPUIS JANV. 2025", 50, yPosition);
    
    // Tableau des cumuls annuels
    const cumulAnnualData = [
      ['Net imposable', `${annualNet.toFixed(2)}`],
      ['Salaire brut', `${annualGross.toFixed(2)}`],
      ['Prélèvement à la source', `${annualTax.toFixed(2)}`],
      ['Montant net des heures supplémentaires exonérées', '0,00'],
      ['Temps travaillé', '333 h'],
    ];
    
    autoTable(doc, {
      startY: yPosition + 5,
      body: cumulAnnualData,
      theme: 'plain',
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      columnStyles: {
        0: { fontStyle: 'bold' },
        1: { halign: 'right' }
      },
    });
    
    // Pied de page page 2
    doc.setFontSize(7);
    doc.text("Dans votre intérêt, et pour vous aider à faire valoir vos droits, conservez ce document sans limitation de durée", 105, pageHeight - 15, { align: 'center' });
    doc.text("Pour la définition des termes employés, se reporter au site internet www.service-public.fr, rubrique cotisations sociales", 105, pageHeight - 10, { align: 'center' });
    
    return doc;
  } catch (error) {
    console.error('Erreur lors de la génération du PDF de la fiche de paie:', error);
    return generateBasicPayslip(payslip);
  }
};

// Version simplifiée en cas d'erreur avec autoTable
const generateBasicPayslip = (payslip: PaySlip): jsPDF => {
  const doc = new jsPDF();
  
  // Informations de base
  doc.setFontSize(16);
  doc.text("BULLETIN DE PAIE", 105, 20, { align: 'center' });
  
  const date = payslip.month ? `${payslip.month} ${payslip.year}` : (payslip.period || 'Non spécifié');
  doc.setFontSize(12);
  doc.text(`Période: ${date}`, 105, 30, { align: 'center' });
  
  // Informations employeur
  doc.setFontSize(12);
  doc.text(`Employeur: ${payslip.employerName || 'Non spécifié'}`, 20, 45);
  doc.text(`SIRET: ${payslip.employerSiret || 'Non spécifié'}`, 20, 52);
  
  // Informations employé
  doc.text(`Employé: ${payslip.employee?.firstName || ''} ${payslip.employee?.lastName || ''}`, 20, 65);
  doc.text(`N° SS: ${payslip.employee?.socialSecurityNumber || 'Non spécifié'}`, 20, 72);
  doc.text(`Poste: ${payslip.employee?.role || 'Non spécifié'}`, 20, 79);
  
  // Résumé des montants
  doc.setFontSize(12);
  doc.text("Résumé des montants:", 20, 95);
  doc.text(`Salaire brut: ${payslip.grossSalary?.toFixed(2) || '0.00'} €`, 30, 105);
  doc.text(`Total cotisations: ${payslip.totalDeductions?.toFixed(2) || '0.00'} €`, 30, 112);
  doc.text(`Net à payer: ${payslip.netSalary?.toFixed(2) || '0.00'} €`, 30, 119);
  
  // Congés
  doc.text("Soldes de congés:", 20, 135);
  
  const conges = payslip.conges || { acquired: 0, taken: 0, balance: 0 };
  const rtt = payslip.rtt || { acquired: 0, taken: 0, balance: 0 };
  
  doc.text(`Congés payés: ${conges.balance} jours`, 30, 145);
  doc.text(`RTT: ${rtt.balance} jours`, 30, 152);
  
  // Cumuls annuels
  doc.text("Cumuls depuis janvier:", 20, 170);
  
  const annualNet = payslip.annualCumulative?.netSalary || 0;
  const annualGross = payslip.annualCumulative?.grossSalary || 0;
  
  doc.text(`Cumul net: ${annualNet.toFixed(2)} €`, 30, 180);
  doc.text(`Cumul brut: ${annualGross.toFixed(2)} €`, 30, 187);
  
  // Message de conservation
  doc.setFontSize(8);
  doc.text("Document à conserver sans limitation de durée", 105, 270, { align: 'center' });
  
  return doc;
};
