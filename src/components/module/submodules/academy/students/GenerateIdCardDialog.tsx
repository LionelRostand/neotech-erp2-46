
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import StudentIdCard from './StudentIdCard';

interface GenerateIdCardDialogProps {
  open: boolean;
  onClose: () => void;
  student: {
    firstName: string;
    lastName: string;
    class: string;
    studentId: string;
    photo?: string;
    academicYear: string;
  };
}

const GenerateIdCardDialog = ({ open, onClose, student }: GenerateIdCardDialogProps) => {
  const handleGeneratePDF = () => {
    // TODO: Implement PDF generation
    console.log('Generating PDF for student:', student);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Carte d'étudiant</DialogTitle>
          <DialogDescription>
            Prévisualisation de la carte d'étudiant
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          <StudentIdCard student={student} />
          
          <Button 
            onClick={handleGeneratePDF}
            className="w-full flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Générer le PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateIdCardDialog;
