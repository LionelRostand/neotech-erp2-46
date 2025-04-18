
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { CandidateApplication } from "@/types/recruitment";
import { toast } from "sonner";

interface AddCandidateDialogProps {
  recruitmentId: string;
  onCandidateAdded: (candidate: CandidateApplication) => void;
}

export default function AddCandidateDialog({ recruitmentId, onCandidateAdded }: AddCandidateDialogProps) {
  const [open, setOpen] = React.useState(false);
  const form = useForm<CandidateApplication>();

  const onSubmit = (data: Partial<CandidateApplication>) => {
    const newCandidate: CandidateApplication = {
      id: crypto.randomUUID(),
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      email: data.email || '',
      phone: data.phone,
      cvUrl: data.cvUrl,
      applicationDate: new Date().toISOString(),
      status: 'reviewing',
      recruitmentId: recruitmentId,
      technicalInterviewStatus: 'pending',
      normalInterviewStatus: 'pending',
      currentStage: 'En cours',
      stageHistory: [{
        stage: 'En cours',
        date: new Date().toISOString(),
        note: 'Candidature reçue'
      }]
    };

    onCandidateAdded(newCandidate);
    toast.success("Candidat ajouté avec succès");
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Ajouter un candidat</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau candidat</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              {...form.register("firstName", { required: true })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Nom</Label>
            <Input
              id="lastName"
              {...form.register("lastName", { required: true })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...form.register("email", { required: true })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              {...form.register("phone")}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cvUrl">URL du CV</Label>
            <Input
              id="cvUrl"
              {...form.register("cvUrl")}
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">Sauvegarder</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
