import React, { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, CalendarPlus } from 'lucide-react';
import RecruitmentStats from './recruitment/RecruitmentStats';
import RecruitmentViewDialog from './recruitment/RecruitmentViewDialog';
import RecruitmentScheduleDialog from './recruitment/RecruitmentScheduleDialog';
import CandidateTrackingView from './recruitment/CandidateTrackingView';
import { RecruitmentPost } from '@/types/recruitment';
import { useRecruitmentFirebaseData } from '@/hooks/useRecruitmentFirebaseData';

const EmployeesRecruitment = () => {
  const { recruitmentPosts, isLoading } = useRecruitmentFirebaseData();
  const [selectedRecruitment, setSelectedRecruitment] = useState<RecruitmentPost | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);

  // Column definitions with required 'key' property
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

  // Mock data for demonstration - In real app, this would come from your data source
  const mockTrackingData = {
    currentStage: 'Entretien RH' as const,
    stageHistory: [
      {
        stage: 'Candidature déposée' as const,
        date: '2024-04-10',
        comments: 'Candidature reçue'
      },
      {
        stage: 'CV en cours d\'analyse' as const,
        date: '2024-04-11',
        comments: 'CV en cours d\'évaluation'
      },
      {
        stage: 'Entretien RH' as const,
        date: '2024-04-15',
        comments: 'Entretien RH planifié'
      }
    ]
  };

  return (
    <div className="space-y-6">
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
          <CandidateTrackingView
            currentStage={mockTrackingData.currentStage}
            stageHistory={mockTrackingData.stageHistory}
          />
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
    </div>
  );
};

export default EmployeesRecruitment;
