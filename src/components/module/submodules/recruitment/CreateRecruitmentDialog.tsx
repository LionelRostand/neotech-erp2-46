
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { addDocument } from '@/hooks/firestore/firestore-utils';
import { COLLECTIONS } from '@/lib/firebase-collections';

interface CreateRecruitmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOfferCreated?: () => void;
}

const CreateRecruitmentDialog: React.FC<CreateRecruitmentDialogProps> = ({
  open,
  onOpenChange,
  onOfferCreated
}) => {
  const { toast } = useToast();
  const [position, setPosition] = React.useState('');
  const [department, setDepartment] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newOffer = {
        position,
        department,
        status: 'Ouvert',
        priority: 'Moyenne',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        currentStage: 'Candidature déposée',
        stageHistory: [{
          stage: 'Candidature déposée',
          date: new Date().toISOString(),
          comments: 'Nouvelle offre créée'
        }]
      };

      await addDocument(COLLECTIONS.HR.RECRUITMENTS, newOffer);
      
      toast({
        title: "Offre créée",
        description: "L'offre de recrutement a été créée avec succès"
      });

      onOpenChange(false);
      if (onOfferCreated) {
        onOfferCreated();
      }
    } catch (error) {
      console.error('Error creating offer:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'offre",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvelle offre de recrutement</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="position">Poste</Label>
            <Input
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Intitulé du poste"
              required
            />
          </div>

          <div>
            <Label htmlFor="department">Département</Label>
            <Input
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Département"
              required
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Créer l'offre
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRecruitmentDialog;
