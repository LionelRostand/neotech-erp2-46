
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";

interface RevenueChartProps {
  revenueData: Array<{
    day: string;
    revenue: number;
  }>;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ revenueData }) => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Revenus du Salon</CardTitle>
        <CardDescription>
          Évolution des revenus des 14 derniers jours
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#8884d8" 
                strokeWidth={3} 
                dot={false}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 shadow-md rounded-md border">
                        <p className="font-semibold">{`${payload[0].payload.day}`}</p>
                        <p className="text-purple-600">{`${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(payload[0].value))}`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
