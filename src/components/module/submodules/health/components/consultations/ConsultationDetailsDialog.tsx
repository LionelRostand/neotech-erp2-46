
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Consultation } from '../../types/health-types';
import { ConsultationDetailsForm } from '../../ConsultationDetailsForm';
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ConsultationDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  consultation: Consultation;
}

const ConsultationDetailsDialog: React.FC<ConsultationDetailsDialogProps> = ({
  open,
  onClose,
  consultation
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const { update } = useFirestore(COLLECTIONS.HEALTH.CONSULTATIONS);
  
  const handleUpdateConsultation = async (updatedData: Partial<Consultation>) => {
    if (!consultation.id) {
      toast.error("Impossible de mettre à jour la consultation: ID manquant");
      return;
    }
    
    try {
      await update(consultation.id, {
        ...updatedData,
        updatedAt: new Date().toISOString()
      });
      
      toast.success("Consultation mise à jour avec succès");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating consultation:", error);
      toast.error("Erreur lors de la mise à jour de la consultation");
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex justify-between items-center flex-row">
          <DialogTitle>Détails de la Consultation</DialogTitle>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          )}
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="medical">Dossier Médical</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date</h3>
                <p>{new Date(consultation.date).toLocaleDateString()}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Heure</h3>
                <p>{consultation.time}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Type</h3>
                <p>
                  {consultation.consultationType === 'routine' && 'Consultation de routine'}
                  {consultation.consultationType === 'followup' && 'Suivi'}
                  {consultation.consultationType === 'emergency' && 'Urgence'}
                  {consultation.consultationType === 'specialist' && 'Spécialiste'}
                  {consultation.consultationType === 'checkup' && 'Bilan de santé'}
                  {!['routine', 'followup', 'emergency', 'specialist', 'checkup'].includes(consultation.consultationType) && consultation.consultationType}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Statut</h3>
                <p>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    consultation.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    consultation.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    consultation.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {consultation.status === 'scheduled' && 'Planifiée'}
                    {consultation.status === 'in-progress' && 'En cours'}
                    {consultation.status === 'completed' && 'Terminée'}
                    {consultation.status === 'cancelled' && 'Annulée'}
                  </span>
                </p>
              </div>
              
              <div className="col-span-2">
                <h3 className="text-sm font-medium text-gray-500">Motif de consultation</h3>
                <p>{consultation.chiefComplaint || 'Non renseigné'}</p>
              </div>
              
              {consultation.notes && (
                <div className="col-span-2">
                  <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                  <p className="whitespace-pre-line">{consultation.notes}</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="medical">
            <ConsultationDetailsForm
              consultation={consultation}
              onSubmit={handleUpdateConsultation}
              onCancel={() => setIsEditing(false)}
              isReadOnly={!isEditing}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationDetailsDialog;
