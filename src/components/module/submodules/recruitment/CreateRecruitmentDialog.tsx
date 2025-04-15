
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { addDocument } from '@/hooks/firestore/firestore-utils';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFirebaseDepartments } from '@/hooks/useFirebaseDepartments';
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Upload } from "lucide-react";
import { CandidateApplication } from '@/types/recruitment';
import { v4 as uuidv4 } from 'uuid';

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
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('');
  const [description, setDescription] = useState('');
  const { departments, isLoading } = useFirebaseDepartments();
  
  // Candidates state
  const [candidates, setCandidates] = useState<CandidateApplication[]>([]);
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidateCV, setCandidateCV] = useState<File | null>(null);

  const handleAddCandidate = () => {
    if (!candidateName || !candidateEmail) {
      toast({
        title: "Champs requis",
        description: "Le nom et l'email du candidat sont requis",
        variant: "destructive"
      });
      return;
    }

    const newCandidate: CandidateApplication = {
      id: uuidv4(),
      recruitmentId: '', // Will be set when the offer is created
      candidateName,
      candidateEmail,
      currentStage: 'CV en cours d\'analyse',
      stageHistory: [{
        stage: 'CV en cours d\'analyse',
        date: new Date().toISOString(),
      }],
      resume: candidateCV ? 'cv_attached' : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCandidates([...candidates, newCandidate]);
    
    // Clear form
    setCandidateName('');
    setCandidateEmail('');
    setCandidateCV(null);
  };

  const handleRemoveCandidate = (id: string) => {
    setCandidates(candidates.filter(c => c.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!position || !department) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    try {
      const newOffer = {
        position,
        department,
        description,
        status: 'Ouvert',
        priority: 'Moyenne',
        location: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        currentStage: 'Candidature déposée',
        candidates: candidates.map(candidate => ({
          ...candidate,
          // The recruitmentId will be set after we get the new document ID
        })),
        stageHistory: [{
          stage: 'Candidature déposée',
          date: new Date().toISOString(),
          comments: 'Nouvelle offre créée'
        }]
      };

      const docRef = await addDocument(COLLECTIONS.HR.RECRUITMENTS, newOffer);
      
      // If we have candidates, we need to update them with the correct recruitmentId
      if (candidates.length > 0 && docRef?.id) {
        const updatedCandidates = candidates.map(candidate => ({
          ...candidate,
          recruitmentId: docRef.id,
        }));
        
        // Update the document with the updated candidates
        await addDocument(COLLECTIONS.HR.RECRUITMENTS, {
          ...newOffer,
          candidates: updatedCandidates,
          id: docRef.id
        }, docRef.id);
      }
      
      toast({
        title: "Offre créée",
        description: "L'offre de recrutement a été créée avec succès"
      });

      // Reset form
      setPosition('');
      setDepartment('');
      setDescription('');
      setCandidates([]);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCandidateCV(e.target.files[0]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nouvelle offre de recrutement</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="position">Poste *</Label>
              <Input
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Intitulé du poste"
                required
              />
            </div>

            <div>
              <Label htmlFor="department">Département *</Label>
              <Select 
                value={department} 
                onValueChange={setDepartment}
                required
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Sélectionner un département" />
                </SelectTrigger>
                <SelectContent>
                  {departments?.map((dept) => (
                    <SelectItem key={dept.id} value={dept.name}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description du poste</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description des responsabilités et des compétences requises"
              rows={3}
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Ajouter des candidats</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <div>
                <Label htmlFor="candidateName">Nom du candidat</Label>
                <Input
                  id="candidateName"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Nom complet"
                />
              </div>
              <div>
                <Label htmlFor="candidateEmail">Email du candidat</Label>
                <Input
                  id="candidateEmail"
                  type="email"
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                  placeholder="email@exemple.com"
                />
              </div>
            </div>

            <div className="mb-4">
              <Label htmlFor="candidateCV" className="block mb-1">CV du candidat</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="candidateCV"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={handleAddCandidate}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter
                </Button>
              </div>
              {candidateCV && (
                <p className="text-sm text-muted-foreground mt-1">
                  Fichier: {candidateCV.name}
                </p>
              )}
            </div>

            {candidates.length > 0 && (
              <div className="border rounded-md p-3 space-y-2">
                <h4 className="text-sm font-medium">Candidats ajoutés ({candidates.length})</h4>
                {candidates.map((candidate) => (
                  <div key={candidate.id} className="flex items-center justify-between bg-muted/50 p-2 rounded">
                    <div>
                      <p className="text-sm font-medium">{candidate.candidateName}</p>
                      <p className="text-xs text-muted-foreground">{candidate.candidateEmail}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {candidate.resume && (
                        <div className="text-xs flex items-center text-blue-600">
                          <FileText className="h-3 w-3 mr-1" />
                          <span>CV</span>
                        </div>
                      )}
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveCandidate(candidate.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
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
