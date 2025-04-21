
import React from 'react';
import { Container } from "@/types/freight";
import { Square } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ContainersKanbanProps {
  containers: Container[];
}

const ContainersKanban: React.FC<ContainersKanbanProps> = ({ containers }) => {
  // Group containers by status
  const containersByStatus = containers.reduce((acc, container) => {
    const status = container.status || 'Indéfini';
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(container);
    return acc;
  }, {} as Record<string, Container[]>);

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Square className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Vue Kanban des Conteneurs</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(containersByStatus).map(([status, statusContainers]) => (
          <div key={status} className="flex flex-col">
            <div className="bg-muted p-2 rounded-t-lg">
              <h3 className="font-medium">{status} ({statusContainers.length})</h3>
            </div>
            <div className="bg-muted/50 p-2 rounded-b-lg space-y-2 min-h-[200px]">
              {statusContainers.map((container) => (
                <Card key={container.id} className="bg-white">
                  <CardContent className="p-4 space-y-2">
                    <div className="font-medium">{container.number}</div>
                    <div className="text-sm text-muted-foreground">
                      Client: {container.client}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Destination: {container.destination}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContainersKanban;
