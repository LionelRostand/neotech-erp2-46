
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
  GraduationCap,
  DollarSign,
  Building,
  Award
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Training } from '@/hooks/useTrainingsData';
import TrainingEditDialog from './TrainingEditDialog';

interface TrainingViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  training: Training | null;
}

const TrainingViewDialog: React.FC<TrainingViewDialogProps> = ({
  open,
  onOpenChange,
  training
}) => {
  const [showEditDialog, setShowEditDialog] = useState(false);

  if (!training) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planifiée':
        return 'bg-blue-100 text-blue-800';
      case 'En cours':
        return 'bg-amber-100 text-amber-800';
      case 'Terminée':
        return 'bg-green-100 text-green-800';
      case 'Annulée':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle className="text-xl">{training.title}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Header with key info */}
            <div className="flex flex-wrap gap-3 items-center">
              <Badge variant="outline" className={getStatusColor(training.status)}>
                {training.status}
              </Badge>
              <div className="text-sm text-gray-500 ml-auto">
                {training.startDate && (
                  <span>Début: {training.startDate}</span>
                )}
              </div>
            </div>
            
            {/* Key details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">
                  <span className="font-medium">Participant:</span> {training.employeeName}
                </span>
              </div>
              
              <div className="flex items-center">
                <GraduationCap className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">
                  <span className="font-medium">Type:</span> {training.type}
                </span>
              </div>
              
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">
                  <span className="font-medium">Date début:</span> {training.startDate}
                </span>
              </div>
              
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">
                  <span className="font-medium">Date fin:</span> {training.endDate || 'Non définie'}
                </span>
              </div>
              
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">
                  <span className="font-medium">Prestataire:</span> {training.provider || 'Formation interne'}
                </span>
              </div>
              
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">
                  <span className="font-medium">Lieu:</span> {training.location || 'Non spécifié'}
                </span>
              </div>
              
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">
                  <span className="font-medium">Département:</span> {training.department || 'Non spécifié'}
                </span>
              </div>
              
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">
                  <span className="font-medium">Coût:</span> {training.cost ? `${training.cost}€` : 'Non spécifié'}
                </span>
              </div>
              
              <div className="flex items-center">
                <Award className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">
                  <span className="font-medium">Certification:</span> {training.certificate ? 'Oui' : 'Non'}
                </span>
              </div>
              
              {training.duration && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm">
                    <span className="font-medium">Durée:</span> {training.duration} jour(s)
                  </span>
                </div>
              )}
            </div>
            
            <Separator />
            
            {/* Description */}
            {training.description && (
              <div className="space-y-3">
                <h3 className="font-medium">Description</h3>
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {training.description}
                </p>
              </div>
            )}
            
            {/* Skills */}
            {training.skills && training.skills.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium">Compétences acquises</h3>
                <div className="flex flex-wrap gap-2">
                  {training.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Certificate */}
            {training.certificate && training.certificateURL && (
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm font-medium">
                    Cette formation délivre un certificat
                  </span>
                  <Button variant="link" className="ml-auto p-0">
                    Voir le certificat
                  </Button>
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

      <TrainingEditDialog 
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        training={training}
        onSuccess={() => {
          setShowEditDialog(false);
          onOpenChange(false);
        }}
      />
    </>
  );
};

export default TrainingViewDialog;
