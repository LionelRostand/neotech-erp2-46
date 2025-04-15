
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from "@/components/ui/button";
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
  const { toast } = useToast();

  if (!recruitment) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ouvert':
        return 'bg-green-100 text-green-800';
      case 'En cours':
        return 'bg-blue-100 text-blue-800';
      case 'Clôturé':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Haute':
        return 'bg-red-100 text-red-800';
      case 'Moyenne':
        return 'bg-orange-100 text-orange-800';
      case 'Basse':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
                Ouvert le {recruitment.openDate}
              </div>
            </div>
            
            {/* Key details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">
                  <span className="font-medium">Type:</span> {recruitment.contractType}
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
                  <span className="font-medium">Salaire:</span> {recruitment.salary || 'Non précisé'}
                </span>
              </div>
              
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">
                  <span className="font-medium">Responsable:</span> {recruitment.hiringManagerName}
                </span>
              </div>
              
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">
                  <span className="font-medium">Date limite:</span> {recruitment.applicationDeadline || 'Non définie'}
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
                {recruitment.requirements}
              </p>
            </div>
            
            {/* Application stats */}
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">
                  <span className="font-medium">Candidatures reçues:</span> {recruitment.applicationCount}
                </span>
              </div>
            </div>
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
