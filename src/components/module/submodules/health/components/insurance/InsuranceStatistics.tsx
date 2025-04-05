
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, CheckCircle, XCircle, BadgePercent } from "lucide-react";

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

interface InsuranceStatisticsProps {
  totalInsurances: number;
  activeInsurances: number;
  inactiveInsurances: number;
  coverageRate: number;
}

const InsuranceStatistics: React.FC<InsuranceStatisticsProps> = ({
  totalInsurances,
  activeInsurances,
  inactiveInsurances,
  coverageRate
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Assurances"
        value={totalInsurances}
        icon={<Building2 className="h-4 w-4 text-gray-500" />}
      />
      <StatsCard
        title="Assurances Actives"
        value={activeInsurances}
        icon={<CheckCircle className="h-4 w-4 text-green-500" />}
        description={`${Math.round((activeInsurances / totalInsurances) * 100)}% du total`}
      />
      <StatsCard
        title="Assurances Inactives"
        value={inactiveInsurances}
        icon={<XCircle className="h-4 w-4 text-red-500" />}
        description={`${Math.round((inactiveInsurances / totalInsurances) * 100)}% du total`}
      />
      <StatsCard
        title="Taux de Couverture"
        value={`${coverageRate}%`}
        icon={<BadgePercent className="h-4 w-4 text-blue-500" />}
        description="Moyenne de couverture"
      />
    </div>
  );
};

export default InsuranceStatistics;
