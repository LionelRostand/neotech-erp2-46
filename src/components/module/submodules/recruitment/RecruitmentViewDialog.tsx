
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Calendar, 
  MapPin, 
  FileText, 
  Briefcase, 
  Check, 
  Edit, 
  DollarSign,
  Tag
} from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { RecruitmentPost } from '@/types/recruitment';
import EditRecruitmentDialog from './EditRecruitmentDialog';
import { useToast } from '@/hooks/use-toast';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';

interface RecruitmentViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recruitment: RecruitmentPost | null;
}

const RecruitmentViewDialog: React.FC<RecruitmentViewDialogProps> = ({
  open,
  onOpenChange,
  recruitment
}) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [proposedSalary, setProposedSalary] = useState('');
  const { toast } = useToast();

  // Early return with null if the dialog shouldn't be open
  if (!open) return null;
  
  // If recruitment is null, render a placeholder or loading state
  if (!recruitment) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Détails de l'offre</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center text-gray-500">
            Aucune donnée disponible pour cette offre.
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const handleProposeSalary = async () => {
    if (!recruitment || !recruitment.id) return;
    
    try {
      const docRef = doc(db, COLLECTIONS.HR.RECRUITMENT, recruitment.id);
      await updateDoc(docRef, {
        proposedSalary: Number(proposedSalary)
      });
      
      toast({
        title: "Salaire proposé",
        description: "La proposition de salaire a été enregistrée avec succès",
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de la proposition de salaire:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la proposition de salaire",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ouverte':
        return 'bg-green-100 text-green-800';
      case 'En cours':
        return 'bg-blue-100 text-blue-800';
      case 'Entretiens':
        return 'bg-purple-100 text-purple-800';
      case 'Offre':
        return 'bg-orange-100 text-orange-800';
      case 'Fermée':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Now we're sure recruitment is not null, safe to use its properties
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>{recruitment.position}</span>
              <Badge className={getStatusColor(recruitment.status)}>
                {recruitment.status}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <Briefcase className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Département</h3>
                    <p className="text-gray-600">{recruitment.department}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Localisation</h3>
                    <p className="text-gray-600">{recruitment.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <DollarSign className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Salaire</h3>
                    <p className="text-gray-600">
                      {typeof recruitment.salary === 'object' 
                        ? `${recruitment.salary.min} - ${recruitment.salary.max} ${recruitment.salary.currency}`
                        : recruitment.salary || 'Non spécifié'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <User className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Responsable</h3>
                    <p className="text-gray-600">{recruitment.hiringManagerName || 'Non assigné'}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Date d'ouverture</h3>
                    <p className="text-gray-600">{recruitment.openDate || recruitment.publishDate}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Date limite</h3>
                    <p className="text-gray-600">{recruitment.applicationDeadline || recruitment.closingDate || 'Non spécifiée'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Tag className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Type de contrat</h3>
                    <p className="text-gray-600">
                      {recruitment.contractType === 'full-time' ? 'CDI' : 
                       recruitment.contractType === 'part-time' ? 'Temps partiel' :
                       recruitment.contractType === 'temporary' ? 'CDD' :
                       recruitment.contractType === 'internship' ? 'Stage' :
                       recruitment.contractType === 'freelance' ? 'Freelance' :
                       recruitment.contractType || 'Non spécifié'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Candidatures</h3>
                    <p className="text-gray-600">
                      {recruitment.applicationCount || recruitment.applications_count || 0} candidat(s)
                      {recruitment.interviews_scheduled ? ` · ${recruitment.interviews_scheduled} entretien(s) programmé(s)` : ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-gray-600 whitespace-pre-line">{recruitment.description}</p>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Exigences</h3>
              <div className="text-gray-600">
                {Array.isArray(recruitment.requirements) ? (
                  <ul className="list-disc list-inside">
                    {recruitment.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="whitespace-pre-line">{recruitment.requirements}</p>
                )}
              </div>
            </div>
            
            {recruitment.status === 'Offre' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-4">
                <h3 className="font-medium text-green-800 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Proposition de salaire
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="salary">Montant proposé (€)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="salary"
                      type="number"
                      value={proposedSalary}
                      onChange={(e) => setProposedSalary(e.target.value)}
                      placeholder="Ex: 45000"
                      className="max-w-[200px]"
                    />
                    <Button 
                      onClick={handleProposeSalary}
                      disabled={!proposedSalary}
                    >
                      Proposer
                    </Button>
                  </div>
                  
                  {recruitment.proposedSalary && (
                    <p className="text-sm text-green-600">
                      Salaire actuel proposé: {recruitment.proposedSalary}€
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(true)}
              className="gap-1"
            >
              <Edit className="h-4 w-4" />
              Modifier
            </Button>
            <Button onClick={() => onOpenChange(false)}>
              <Check className="h-4 w-4 mr-1" />
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {showEditDialog && (
        <EditRecruitmentDialog
          open={showEditDialog}
          onOpenChange={(open) => {
            setShowEditDialog(open);
            if (!open) onOpenChange(false);
          }}
          recruitment={recruitment}
        />
      )}
    </>
  );
};

export default RecruitmentViewDialog;
