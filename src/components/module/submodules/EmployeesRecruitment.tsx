
import React, { useState } from 'react';
import { useRecruitmentData } from '@/hooks/useRecruitmentData';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, CalendarPlus } from 'lucide-react';
import RecruitmentViewDialog from './recruitment/RecruitmentViewDialog';
import RecruitmentScheduleDialog from './recruitment/RecruitmentScheduleDialog';
import { RecruitmentPost } from '@/hooks/useRecruitmentData';

const EmployeesRecruitment = () => {
  const { recruitmentPosts, isLoading } = useRecruitmentData();
  const [selectedRecruitment, setSelectedRecruitment] = useState<RecruitmentPost | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);

  const columns = [
    {
      header: "Poste",
      cell: ({ row }) => row.original.position
    },
    {
      header: "Département",
      cell: ({ row }) => row.original.department
    },
    {
      header: "Statut",
      cell: ({ row }) => row.original.status
    },
    {
      header: "Priorité",
      cell: ({ row }) => row.original.priority
    },
    {
      header: "Localisation",
      cell: ({ row }) => row.original.location
    },
    {
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
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={recruitmentPosts}
        isLoading={isLoading}
      />

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
