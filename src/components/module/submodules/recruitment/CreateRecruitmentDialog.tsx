import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { addDocument } from '@/hooks/firestore/firestore-utils';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { FileText } from 'lucide-react';
import { CandidateApplication } from '@/types/recruitment';

interface CreateRecruitmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateRecruitmentDialog: React.FC<CreateRecruitmentDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('Open');
  const [priority, setPriority] = useState('Medium');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [openDate, setOpenDate] = useState('');
  const [applicationDeadline, setApplicationDeadline] = useState('');
  const [hiringManagerId, setHiringManagerId] = useState('');
  const [hiringManagerName, setHiringManagerName] = useState('');
  const [contractType, setContractType] = useState('');
  const [salary, setSalary] = useState('');

  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [candidates, setCandidates] = useState<CandidateApplication[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setResumeFile(event.target.files[0]);
    }
  };

  const handleAddCandidate = async () => {
    if (!candidateName || !candidateEmail) {
      toast.error("Veuillez remplir tous les champs du candidat.");
      return;
    }
    
    try {
      const candidateData: Partial<CandidateApplication> = {
        recruitmentId: '',  // Will be updated after recruitment post is created
        candidateName,
        candidateEmail,
        currentStage: 'Candidature déposée',
        stageHistory: [
          {
            stage: 'Candidature déposée',
            date: new Date().toISOString(),
            comments: 'Candidature initiale'
          }
        ],
        resume: resumeFile ? `${candidateName.replace(/\s+/g, '_')}_CV.pdf` : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add to temporary list for now
      // We'll save to Firestore after the recruitment post is created
      setCandidates([...candidates, { id: `temp-${Date.now()}`, ...candidateData } as CandidateApplication]);
      
      // Reset candidate form
      setCandidateName('');
      setCandidateEmail('');
      setResumeFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      toast.success("Candidat ajouté à l'offre");
    } catch (error) {
      console.error("Erreur lors de l'ajout du candidat:", error);
      toast.error("Erreur lors de l'ajout du candidat");
    }
  };

  const handleSubmit = async () => {
    if (!position || !department || !location || !status || !priority || !description || !requirements || !openDate || !hiringManagerId || !hiringManagerName || !contractType || !salary) {
      toast.error("Veuillez remplir tous les champs de l'offre.");
      return;
    }
    
    try {
      const recruitmentData = {
        position,
        department,
        location,
        status,
        priority,
        description,
        requirements,
        openDate,
        applicationDeadline,
        hiringManagerId,
        hiringManagerName,
        contractType,
        salary,
        candidates: [],  // Will be populated after saving
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Add the recruitment post to Firestore
      const recruitmentRef = await addDocument(COLLECTIONS.HR.RECRUITMENTS, recruitmentData);
      
      // Now add each candidate with the correct recruitmentId
      for (const candidate of candidates) {
        const candidateData = {
          ...candidate,
          recruitmentId: recruitmentRef.id,
        };
        
        // Use the CANDIDATES collection we just added
        await addDocument(COLLECTIONS.HR.CANDIDATES, candidateData);
      }
      
      toast.success("Offre de recrutement créée avec succès");
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la création de l'offre:", error);
      toast.error("Erreur lors de la création de l'offre");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle offre de recrutement</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">
                Poste
              </Label>
              <Input
                type="text"
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Département
              </Label>
              <Input
                type="text"
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Localisation
              </Label>
              <Input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Statut
              </Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Ouvert</SelectItem>
                  <SelectItem value="In Progress">En cours</SelectItem>
                  <SelectItem value="Closed">Fermé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priorité
              </Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner une priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">Haute</SelectItem>
                  <SelectItem value="Medium">Moyenne</SelectItem>
                  <SelectItem value="Low">Basse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contractType" className="text-right">
                Type de contrat
              </Label>
              <Input
                type="text"
                id="contractType"
                value={contractType}
                onChange={(e) => setContractType(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="openDate" className="text-right">
                Date d'ouverture
              </Label>
              <Input
                type="date"
                id="openDate"
                value={openDate}
                onChange={(e) => setOpenDate(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="applicationDeadline" className="text-right">
                Date limite
              </Label>
              <Input
                type="date"
                id="applicationDeadline"
                value={applicationDeadline}
                onChange={(e) => setApplicationDeadline(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hiringManagerId" className="text-right">
                ID Manager
              </Label>
              <Input
                type="text"
                id="hiringManagerId"
                value={hiringManagerId}
                onChange={(e) => setHiringManagerId(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hiringManagerName" className="text-right">
                Nom Manager
              </Label>
              <Input
                type="text"
                id="hiringManagerName"
                value={hiringManagerName}
                onChange={(e) => setHiringManagerName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="salary" className="text-right">
                Salaire
              </Label>
              <Input
                type="text"
                id="salary"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="requirements" className="text-right">
                Prérequis
              </Label>
              <Textarea
                id="requirements"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">Candidats</h3>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="candidateName" className="text-right">
                Nom du candidat
              </Label>
              <Input
                type="text"
                id="candidateName"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="candidateEmail" className="text-right">
                Email du candidat
              </Label>
              <Input
                type="email"
                id="candidateEmail"
                value={candidateEmail}
                onChange={(e) => setCandidateEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="resumeFile" className="text-right">
                CV
              </Label>
              <div className="col-span-3">
                <Input
                  type="file"
                  id="resumeFile"
                  onChange={handleFileChange}
                  className="hidden"
                  ref={fileInputRef}
                />
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  {resumeFile ? resumeFile.name : "Sélectionner un fichier"}
                  {resumeFile && <FileText className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
          <Button onClick={handleAddCandidate}>Ajouter un candidat</Button>
        </div>

        {candidates.length > 0 && (
          <div className="mt-4">
            <h4 className="text-lg font-semibold mb-2">Candidats ajoutés</h4>
            <ul>
              {candidates.map((candidate) => (
                <li key={candidate.id} className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span>{candidate.candidateName} ({candidate.candidateEmail})</span>
                  {candidate.resume && 
                    <a href="#" className="text-blue-500 hover:underline">
                      Télécharger CV
                    </a>
                  }
                </li>
              ))}
            </ul>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>Créer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRecruitmentDialog;
