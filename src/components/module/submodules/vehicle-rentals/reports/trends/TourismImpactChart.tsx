
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TourismImpact {
  name: string;
  impact: number;
}

interface TourismImpactChartProps {
  data: TourismImpact[];
}

const TourismImpactChart: React.FC<TourismImpactChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Facteurs d'influence du tourisme</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickFormatter={(value) => `${value}%`} />
              <YAxis type="category" dataKey="name" width={150} />
              <Tooltip formatter={(value) => [`${value}%`, 'Impact sur les réservations']} />
              <Bar dataKey="impact" name="Impact sur les réservations" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TourismImpactChart;
