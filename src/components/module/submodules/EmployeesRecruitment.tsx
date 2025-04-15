import React, { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, CalendarPlus, PlusCircle } from 'lucide-react';
import RecruitmentStats from './recruitment/RecruitmentStats';
import RecruitmentViewDialog from './recruitment/RecruitmentViewDialog';
import RecruitmentScheduleDialog from './recruitment/RecruitmentScheduleDialog';
import CreateRecruitmentDialog from './recruitment/CreateRecruitmentDialog';
import CandidateApplication from './recruitment/CandidateApplication';
import { RecruitmentPost, RecruitmentStage, CandidateApplication as CandidateApplicationType } from '@/types/recruitment';
import { useRecruitmentFirebaseData } from '@/hooks/useRecruitmentFirebaseData';
import { useToast } from '@/components/ui/use-toast';

const EmployeesRecruitment = () => {
  const { recruitmentPosts, isLoading } = useRecruitmentFirebaseData();
  const [selectedRecruitment, setSelectedRecruitment] = useState<RecruitmentPost | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const mockApplications: CandidateApplicationType[] = [
    {
      id: '1',
      recruitmentId: '1',
      candidateId: '1',
      candidateName: 'Jean Dupont',
      candidateEmail: 'jean.dupont@example.com',
      currentStage: 'CV en cours d\'analyse',
      stageHistory: [
        {
          stage: 'Candidature déposée',
          date: '2024-04-10',
          comments: 'Candidature reçue'
        },
        {
          stage: 'CV en cours d\'analyse',
          date: '2024-04-11',
          comments: 'CV en cours d\'évaluation'
        }
      ],
      createdAt: '2024-04-10',
      updatedAt: '2024-04-11'
    },
    {
      id: '2',
      recruitmentId: '1',
      candidateId: '2',
      candidateName: 'Marie Martin',
      candidateEmail: 'marie.martin@example.com',
      currentStage: 'Entretien RH',
      stageHistory: [
        {
          stage: 'Candidature déposée',
          date: '2024-04-09',
          comments: 'Candidature reçue'
        },
        {
          stage: 'CV en cours d\'analyse',
          date: '2024-04-10',
          comments: 'CV validé'
        },
        {
          stage: 'Entretien RH',
          date: '2024-04-12',
          comments: 'Entretien planifié'
        }
      ],
      createdAt: '2024-04-09',
      updatedAt: '2024-04-12'
    }
  ];

  const handleStageUpdate = (applicationId: string, newStage: string) => {
    console.log(`Updating application ${applicationId} to stage: ${newStage}`);
    toast({
      title: "Étape mise à jour",
      description: `Le candidat passe à l'étape : ${newStage}`
    });
  };

  const columns = [
    {
      key: "position",
      header: "Poste",
      cell: ({ row }) => row.original.position
    },
    {
      key: "department",
      header: "Département",
      cell: ({ row }) => row.original.department
    },
    {
      key: "status",
      header: "Statut",
      cell: ({ row }) => row.original.status
    },
    {
      key: "priority",
      header: "Priorité",
      cell: ({ row }) => row.original.priority
    },
    {
      key: "location",
      header: "Localisation",
      cell: ({ row }) => row.original.location
    },
    {
      key: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedRecruitment(row.original);
              setViewDialogOpen(true);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedRecruitment(row.original);
              setScheduleDialogOpen(true);
            }}
          >
            <CalendarPlus className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Recrutement</h2>
        <Button 
          onClick={() => setCreateDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Nouvelle offre
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecruitmentStats />
          
          <div className="mt-6">
            <DataTable
              columns={columns}
              data={recruitmentPosts}
              isLoading={isLoading}
            />
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4">Suivi des candidatures</h3>
          {mockApplications.map((application) => (
            <CandidateApplication
              key={application.id}
              application={application}
              onStageUpdate={handleStageUpdate}
            />
          ))}
        </div>
      </div>

      <RecruitmentViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        recruitment={selectedRecruitment}
      />

      <RecruitmentScheduleDialog
        open={scheduleDialogOpen}
        onOpenChange={setScheduleDialogOpen}
        recruitment={selectedRecruitment}
      />

      <CreateRecruitmentDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
};

export default EmployeesRecruitment;
