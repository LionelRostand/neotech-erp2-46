
import React from 'react';
import { Card } from '@/components/ui/card';
import { RecruitmentStage } from '@/types/recruitment';

interface KanbanColumnProps {
  title: string;
  children: React.ReactNode;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, children }) => (
  <div className="flex-1 min-w-[250px] max-w-[300px]">
    <div className="bg-muted p-3 rounded-t-lg border-b">
      <h3 className="font-semibold text-sm">{title}</h3>
    </div>
    <div className="p-2 bg-muted/50 rounded-b-lg min-h-[400px]">
      {children}
    </div>
  </div>
);

const RecruitmentKanban = () => {
  const stages: RecruitmentStage[] = [
    'CV en cours d\'analyse',
    'Entretien RH',
    'Test technique',
    'Entretien final',
    'Recrutement finalisé'
  ];

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-3 p-3">
        {stages.map((stage) => (
          <KanbanColumn key={stage} title={stage}>
            <div className="space-y-2">
              <Card className="p-3 bg-white cursor-move hover:shadow-md transition-shadow">
                <p className="font-medium text-sm">Exemple de candidat</p>
                <p className="text-xs text-muted-foreground">exemple@email.com</p>
              </Card>
            </div>
          </KanbanColumn>
        ))}
      </div>
    </div>
  );
};

export default RecruitmentKanban;
