
import React from 'react';
import { Container } from "@/types/freight";
import { Kanban } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ContainersKanbanProps {
  containers: Container[];
}

const ContainersKanban: React.FC<ContainersKanbanProps> = ({ containers }) => {
  // Group containers by status
  const containersByStatus = containers.reduce((acc, container) => {
    const status = container.status || 'Non défini';
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(container);
    return acc;
  }, {} as Record<string, Container[]>);

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'en transit':
        return 'bg-blue-100';
      case 'livré':
        return 'bg-green-100';
      case 'en attente':
        return 'bg-yellow-100';
      case 'retardé':
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Kanban className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Vue Kanban des Conteneurs</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(containersByStatus).map(([status, statusContainers]) => (
          <div key={status} className="flex flex-col">
            <div className={`p-2 rounded-t-lg ${getStatusColor(status)}`}>
              <h3 className="font-medium">{status} ({statusContainers.length})</h3>
            </div>
            <div className="bg-gray-50 p-2 rounded-b-lg space-y-2 min-h-[200px]">
              {statusContainers.map((container) => (
                <Card key={container.id} className="bg-white hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="font-medium">{container.number}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Client: {container.client}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {container.origin} → {container.destination}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{container.type}</Badge>
                      <Badge variant="outline">{container.size}</Badge>
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
