
import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip,
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MaintenanceData {
  name: string;
  value: number;
}

interface MaintenanceDistributionChartProps {
  data: MaintenanceData[];
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

const MaintenanceDistributionChart: React.FC<MaintenanceDistributionChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition des interventions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} interventions`, '']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaintenanceDistributionChart;
