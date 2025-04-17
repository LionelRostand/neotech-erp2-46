
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Contract } from '@/hooks/useContractsData';
import { formatDate } from '@/lib/formatters';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Briefcase, Building, UserRound, CreditCard, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateContractPdf } from './utils/contractPdfUtils';
import { toast } from 'sonner';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Document } from '@/types/employee';

interface ContractDetailsDialogProps {
  contract: Contract | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContractDetailsDialog: React.FC<ContractDetailsDialogProps> = ({
  contract,
  open,
  onOpenChange,
}) => {
  if (!contract) return null;
  
  const { employees } = useHrModuleData();
  const { update } = useFirestore(COLLECTIONS.HR.EMPLOYEES);
  const { add: addHrDocument } = useFirestore(COLLECTIONS.HR.DOCUMENTS);
  
  // Fonction pour afficher le bon badge de statut
  const getStatusBadge = (status: 'Actif' | 'À venir' | 'Expiré') => {
    switch (status) {
      case 'Actif':
        return <Badge className="bg-green-500 hover:bg-green-600">Actif</Badge>;
      case 'À venir':
        return <Badge className="bg-blue-500 hover:bg-blue-600">À venir</Badge>;
      case 'Expiré':
        return <Badge className="bg-red-500 hover:bg-red-600">Expiré</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const handleGeneratePdf = async () => {
    try {
      // Trouver l'employé associé au contrat
      const employee = employees.find(emp => emp.id === contract.employeeId);
      
      if (!employee) {
        toast.error("Impossible de trouver l'employé associé à ce contrat");
        return;
      }
      
      // Générer le PDF
      const pdfResult = generateContractPdf(contract, employee);
      
      if (pdfResult.success && pdfResult.documentObj) {
        // Ajouter le document à l'employé
        if (!employee.documents) {
          employee.documents = [];
        }
        
        // Ensure documentObj has all required properties of Document
        const documentToAdd: Document = {
          ...pdfResult.documentObj,
          date: new Date().toISOString(), // Add the required date property
        };
        
        employee.documents.push(documentToAdd);
        
        // Mettre à jour l'employé dans la base de données
        update(employee.id, { documents: employee.documents })
          .then(() => {
            // Also add the document to HR Documents collection
            const hrDocumentToAdd = {
              title: documentToAdd.name,
              type: 'contrat',
              fileType: documentToAdd.fileType,
              fileSize: documentToAdd.fileSize,
              employeeId: employee.id,
              employeeName: `${employee.firstName} ${employee.lastName}`,
              department: employee.department,
              uploadDate: new Date(),
              createdAt: new Date(),
              date: new Date(),
              fileData: documentToAdd.fileData,
              // Add additional metadata
              description: `Contrat de ${contract.type} pour ${employee.firstName} ${employee.lastName}`,
              position: contract.position,
              status: 'active'
            };
            
            // Add to HR Documents collection
            addHrDocument(hrDocumentToAdd)
              .then(() => {
                toast.success("Le contrat a été généré et ajouté aux documents de l'employé et aux Documents RH");
              })
              .catch((error) => {
                console.error("Erreur lors de l'ajout du document aux Documents RH:", error);
                toast.error("Erreur lors de l'ajout du document aux Documents RH");
              });
          })
          .catch((error) => {
            console.error("Erreur lors de la mise à jour de l'employé:", error);
            toast.error("Erreur lors de l'enregistrement du document");
          });
      } else {
        toast.error("Erreur lors de la génération du contrat: " + (pdfResult.error || "erreur inconnue"));
      }
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      toast.error("Une erreur s'est produite lors de la génération du PDF");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Détails du contrat</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">{contract.employeeName}</h3>
            {getStatusBadge(contract.status)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-2">
              <Briefcase className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Type de contrat</p>
                <p>{contract.type}</p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Building className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Département</p>
                <p>{contract.department || "Non spécifié"}</p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <UserRound className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Poste</p>
                <p>{contract.position}</p>
              </div>
            </div>

            {contract.salary && (
              <div className="flex items-start space-x-2">
                <CreditCard className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Salaire</p>
                  <p>{contract.salary.toLocaleString('fr-FR')} €</p>
                </div>
              </div>
            )}

            <div className="flex items-start space-x-2">
              <CalendarIcon className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Date de début</p>
                <p>{contract.startDate}</p>
              </div>
            </div>

            {contract.endDate && (
              <div className="flex items-start space-x-2">
                <CalendarIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Date de fin</p>
                  <p>{contract.endDate}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleGeneratePdf}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Générer PDF du contrat
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContractDetailsDialog;
