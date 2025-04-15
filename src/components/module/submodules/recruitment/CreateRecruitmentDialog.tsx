import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { addDocument } from '@/hooks/firestore/firestore-utils'; // Corrected import path
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useAvailableDepartments } from '@/hooks/useAvailableDepartments'; // Added import for departments
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface CreateRecruitmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecruitmentCreated: () => void;
}

const CreateRecruitmentDialog: React.FC<CreateRecruitmentDialogProps> = ({
  open,
  onOpenChange,
  onRecruitmentCreated,
}) => {
  const [position, setPosition] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<'Ouvert' | 'En cours' | 'Clôturé'>('Ouvert');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low' | 'Haute' | 'Moyenne' | 'Basse'>('Medium');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [currency, setCurrency] = useState('EUR');
  const [contactEmail, setContactEmail] = useState('');

  const { departments } = useAvailableDepartments();
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const handleSubmit = async () => {
    if (!position || !selectedDepartment) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    try {
      const recruitmentData = {
        position,
        department: selectedDepartment,
        location,
        status,
        priority,
        description,
        requirements: requirements.split(',').map(item => item.trim()),
        salary_range: {
          min: salaryMin ? parseFloat(salaryMin) : 0,
          max: salaryMax ? parseFloat(salaryMax) : 0,
          currency,
        },
        contact_email: contactEmail,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await addDocument(COLLECTIONS.HR.RECRUITMENTS, recruitmentData);
      toast.success("Offre d'emploi créée avec succès.");
      onRecruitmentCreated();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la création de l'offre d'emploi:", error);
      toast.error("Erreur lors de la création de l'offre d'emploi.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle offre d'emploi</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium leading-none text-gray-700">Poste *</label>
              <Input type="text" value={position} onChange={(e) => setPosition(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium leading-none text-gray-700">Département *</label>
              <Select onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un département" />
                </SelectTrigger>
                <SelectContent>
                  {departments && departments.map((department) => (
                    <SelectItem key={department.id} value={department.name}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium leading-none text-gray-700">Lieu</label>
              <Input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium leading-none text-gray-700">Statut</label>
              <Select value={status} onValueChange={(value) => setStatus(value as 'Ouvert' | 'En cours' | 'Clôturé')}>
                <SelectTrigger>
                  <SelectValue placeholder={status} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ouvert">Ouvert</SelectItem>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="Clôturé">Clôturé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium leading-none text-gray-700">Priorité</label>
              <Select value={priority} onValueChange={(value) => setPriority(value as 'High' | 'Medium' | 'Low' | 'Haute' | 'Moyenne' | 'Basse')}>
                <SelectTrigger>
                  <SelectValue placeholder={priority} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Haute">Haute</SelectItem>
                  <SelectItem value="Moyenne">Moyenne</SelectItem>
                  <SelectItem value="Basse">Basse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium leading-none text-gray-700">Email de contact</label>
              <Input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium leading-none text-gray-700">Description</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium leading-none text-gray-700">Exigences (séparées par des virgules)</label>
            <Textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium leading-none text-gray-700">Salaire Min</label>
              <Input type="number" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium leading-none text-gray-700">Salaire Max</label>
              <Input type="number" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium leading-none text-gray-700">Devise</label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder={currency} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="CAD">CAD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>Créer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRecruitmentDialog;
