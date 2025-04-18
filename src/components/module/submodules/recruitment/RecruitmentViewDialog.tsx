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
  Briefcase, 
  TrendingUp, 
  DollarSign,
  Users
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
      case 'Fermée':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Haute':
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Moyenne':
      case 'Medium':
        return 'bg-orange-100 text-orange-800';
      case 'Basse':
      case 'Low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatSalary = (salary: any): string => {
    if (!salary) return 'Non précisé';
    if (typeof salary === 'string') return salary;
    if (typeof salary === 'object' && 'min' in salary && 'max' in salary) {
      return `${salary.min}-${salary.max} ${salary.currency || '€'}`;
    }
    return 'Non précisé';
  };

  const formatContractType = (type: string): string => {
    switch (type) {
      case 'full-time': return 'Temps plein';
      case 'part-time': return 'Temps partiel';
      case 'temporary': return 'Temporaire';
      case 'internship': return 'Stage';
      case 'freelance': return 'Freelance';
      default: return type;
    }
  };

  const handleEditSuccess = () => {
    toast({
      title: "Mise à jour réussie",
      description: "Les informations du recrutement ont été mises à jour."
    });
    // In a real app, we would refresh the data here
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle className="text-xl">{recruitment.position}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Header with key info */}
            <div className="flex flex-wrap gap-3 items-center">
              <Badge variant="outline" className={getStatusColor(recruitment.status)}>
                {recruitment.status}
              </Badge>
              <Badge variant="outline" className={getPriorityColor(recruitment.priority)}>
                Priorité: {recruitment.priority}
              </Badge>
              <div className="text-sm text-gray-500 ml-auto">
                Ouvert le {recruitment.openDate || recruitment.publishDate}
              </div>
            </div>
            
            {/* Key details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">
                  <span className="font-medium">Type:</span> {formatContractType(recruitment.contractType)}
                </span>
              </div>
              
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">
                  <span className="font-medium">Localisation:</span> {recruitment.location}
                </span>
              </div>
              
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">
                  <span className="font-medium">Département:</span> {recruitment.department}
                </span>
              </div>
              
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">
                  <span className="font-medium">Salaire:</span> {formatSalary(recruitment.salary)}
                </span>
              </div>
              
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">
                  <span className="font-medium">Responsable:</span> {recruitment.hiringManagerName || 'Non spécifié'}
                </span>
              </div>
              
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">
                  <span className="font-medium">Date limite:</span> {recruitment.applicationDeadline || recruitment.closingDate || 'Non définie'}
                </span>
              </div>
            </div>
            
            <Separator />
            
            {/* Description */}
            <div className="space-y-3">
              <h3 className="font-medium">Description du poste</h3>
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {recruitment.description}
              </p>
            </div>
            
            {/* Requirements */}
            <div className="space-y-3">
              <h3 className="font-medium">Prérequis et compétences</h3>
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {typeof recruitment.requirements === 'string'
                  ? recruitment.requirements
                  : Array.isArray(recruitment.requirements)
                    ? recruitment.requirements.join('\n')
                    : 'Non précisé'
                }
              </p>
            </div>
            
            {/* Application stats */}
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">
                  <span className="font-medium">Candidatures reçues:</span> {recruitment.applicationCount || recruitment.applications_count || 0}
                </span>
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
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fermer
            </Button>
            <Button onClick={() => setShowEditDialog(true)}>
              Modifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EditRecruitmentDialog 
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        recruitment={recruitment}
        onSuccess={handleEditSuccess}
      />
    </>
  );
};

export default RecruitmentViewDialog;
