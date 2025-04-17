
import React, { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Eye, CalendarPlus, PlusCircle, List, LayoutGrid } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import RecruitmentStats from './recruitment/RecruitmentStats';
import RecruitmentViewDialog from './recruitment/RecruitmentViewDialog';
import RecruitmentScheduleDialog from './recruitment/RecruitmentScheduleDialog';
import CreateRecruitmentDialog from './recruitment/CreateRecruitmentDialog';
import RecruitmentKanban from './recruitment/RecruitmentKanban';
import { RecruitmentPost } from '@/types/recruitment';
import { useRecruitmentFirebaseData } from '@/hooks/useRecruitmentFirebaseData';
import { useToast } from '@/components/ui/use-toast';

const EmployeesRecruitment = () => {
  const { recruitmentPosts, isLoading } = useRecruitmentFirebaseData();
  const [selectedRecruitment, setSelectedRecruitment] = useState<RecruitmentPost | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleRecruitmentCreated = () => {
    toast({
      title: "Offre créée",
      description: "L'offre d'emploi a été créée avec succès.",
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

      <RecruitmentStats />
      
      <Tabs defaultValue="kanban" className="w-full">
        <TabsList>
          <TabsTrigger value="kanban" className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4" />
            Kanban
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="w-4 h-4" />
            Liste
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="mt-6">
          <RecruitmentKanban />
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <DataTable
            columns={columns}
            data={recruitmentPosts}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>

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
        onRecruitmentCreated={handleRecruitmentCreated}
      />
    </div>
  );
};

export default EmployeesRecruitment;
