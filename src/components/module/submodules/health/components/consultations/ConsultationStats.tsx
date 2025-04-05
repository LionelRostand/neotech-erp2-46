
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle, XCircle, Calendar } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, description }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </CardContent>
  </Card>
);

interface ConsultationStatsProps {
  totalConsultations: number;
  completedConsultations: number;
  pendingConsultations: number;
  cancelledConsultations: number;
}

const ConsultationStats: React.FC<ConsultationStatsProps> = ({
  totalConsultations,
  completedConsultations,
  pendingConsultations,
  cancelledConsultations
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Consultations"
        value={totalConsultations}
        icon={<Users className="h-4 w-4 text-gray-500" />}
      />
      <StatsCard
        title="Consultations Terminées"
        value={completedConsultations}
        icon={<CheckCircle className="h-4 w-4 text-green-500" />}
        description={`${Math.round((completedConsultations / totalConsultations) * 100)}% du total`}
      />
      <StatsCard
        title="En Attente"
        value={pendingConsultations}
        icon={<Calendar className="h-4 w-4 text-yellow-500" />}
        description={`${Math.round((pendingConsultations / totalConsultations) * 100)}% du total`}
      />
      <StatsCard
        title="Annulées"
        value={cancelledConsultations}
        icon={<XCircle className="h-4 w-4 text-red-500" />}
        description={`${Math.round((cancelledConsultations / totalConsultations) * 100)}% du total`}
      />
    </div>
  );
};

export default ConsultationStats;
