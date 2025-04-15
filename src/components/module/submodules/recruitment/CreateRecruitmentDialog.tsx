
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { addDocument } from '@/hooks/firestore/firestore-utils';
import { COLLECTIONS } from '@/lib/firebase-collections';

interface CreateRecruitmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateRecruitmentDialog: React.FC<CreateRecruitmentDialogProps> = ({ open, onOpenChange }) => {
  const [formData, setFormData] = useState({
    position: '',
    department: '',
    location: '',
    status: 'Ouvert',
    priority: 'Moyenne',
    contractType: 'CDI',
    description: '',
    requirements: '',
    salary: '',
    applicationDeadline: '',
    hiringManagerName: '',
    hiringManagerId: 'manager-1', // Default value for now
  });

  const [candidates, setCandidates] = useState<{
    name: string;
    email: string;
    resume: File | null;
  }[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleAddCandidate = () => {
    setCandidates([
      ...candidates,
      {
        name: '',
        email: '',
        resume: null,
      },
    ]);
  };

  const handleCandidateChange = (index: number, field: string, value: string | File | null) => {
    const updatedCandidates = [...candidates];
    updatedCandidates[index] = {
      ...updatedCandidates[index],
      [field]: value,
    };
    setCandidates(updatedCandidates);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.position || !formData.department) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare recruitment data
      const recruitmentData = {
        ...formData,
        openDate: new Date().toISOString(),
        applicationCount: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Convert requirements string to array
        requirements: formData.requirements.split('\n').filter(req => req.trim() !== ''),
      };

      // Add to Firestore
      const recruitmentRef = await addDocument(COLLECTIONS.HR.RECRUITMENTS, recruitmentData);
      
      // Process candidates if any
      if (candidates.length > 0) {
        const validCandidates = candidates.filter(c => c.name && c.email);
        
        // Add candidates to the database
        for (const candidate of validCandidates) {
          const candidateData = {
            recruitmentId: recruitmentRef.id,
            candidateName: candidate.name,
            candidateEmail: candidate.email,
            currentStage: 'Candidature déposée' as const,
            stageHistory: [
              {
                stage: 'Candidature déposée' as const,
                date: new Date().toISOString(),
                comments: 'Candidature initiale'
              }
            ],
            resume: candidate.resume ? 'Attached' : undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          await addDocument(COLLECTIONS.HR.CANDIDATES, candidateData);
        }
      }

      toast({
        title: "Offre créée",
        description: "L'offre d'emploi a été créée avec succès.",
      });
      
      // Reset form and close dialog
      setFormData({
        position: '',
        department: '',
        location: '',
        status: 'Ouvert',
        priority: 'Moyenne',
        contractType: 'CDI',
        description: '',
        requirements: '',
        salary: '',
        applicationDeadline: '',
        hiringManagerName: '',
        hiringManagerId: 'manager-1',
      });
      setCandidates([]);
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating recruitment post:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'offre.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle offre d'emploi</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position">Poste*</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="Développeur full-stack"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Département*</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="Informatique"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contractType">Type de contrat</Label>
              <Select
                value={formData.contractType}
                onValueChange={(value) => setFormData({ ...formData, contractType: value })}
              >
                <SelectTrigger id="contractType">
                  <SelectValue placeholder="Type de contrat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CDI">CDI</SelectItem>
                  <SelectItem value="CDD">CDD</SelectItem>
                  <SelectItem value="Alternance">Alternance</SelectItem>
                  <SelectItem value="Stage">Stage</SelectItem>
                  <SelectItem value="Freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Localisation</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Paris"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ouvert">Ouvert</SelectItem>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="Clôturé">Clôturé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priorité</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Haute">Haute</SelectItem>
                  <SelectItem value="Moyenne">Moyenne</SelectItem>
                  <SelectItem value="Basse">Basse</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary">Salaire</Label>
              <Input
                id="salary"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                placeholder="45-55K€"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicationDeadline">Date limite</Label>
              <Input
                id="applicationDeadline"
                type="date"
                value={formData.applicationDeadline}
                onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description du poste</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description détaillée du poste..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Prérequis (un par ligne)</Label>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              placeholder="Expérience minimale de 3 ans\nMaîtrise de React\nAnglais courant"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hiringManager">Responsable du recrutement</Label>
            <Input
              id="hiringManager"
              value={formData.hiringManagerName}
              onChange={(e) => setFormData({ ...formData, hiringManagerName: e.target.value })}
              placeholder="Marie Dubois"
            />
          </div>

          {/* Candidate section */}
          <div className="border rounded-md p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Candidats</h3>
              <Button type="button" variant="outline" size="sm" onClick={handleAddCandidate}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Ajouter un candidat
              </Button>
            </div>

            {candidates.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun candidat ajouté. Cliquez sur "Ajouter un candidat" pour commencer.</p>
            ) : (
              candidates.map((candidate, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 border-t pt-4">
                  <div className="space-y-2">
                    <Label htmlFor={`candidate-${index}-name`}>Nom</Label>
                    <Input
                      id={`candidate-${index}-name`}
                      value={candidate.name}
                      onChange={(e) => handleCandidateChange(index, 'name', e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`candidate-${index}-email`}>Email</Label>
                    <Input
                      id={`candidate-${index}-email`}
                      value={candidate.email}
                      onChange={(e) => handleCandidateChange(index, 'email', e.target.value)}
                      placeholder="john.doe@example.com"
                      type="email"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor={`candidate-${index}-resume`}>CV</Label>
                    <div className="flex items-center border rounded p-2">
                      <FileText className="h-4 w-4 mr-2 text-blue-500" />
                      <Input
                        id={`candidate-${index}-resume`}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          handleCandidateChange(index, 'resume', file);
                        }}
                        className="border-0 p-0"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Création en cours..." : "Créer l'offre"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRecruitmentDialog;
