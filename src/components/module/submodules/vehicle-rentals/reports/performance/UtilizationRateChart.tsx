
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

interface UtilizationData {
  category: string;
  utilisationRate: number;
}

interface UtilizationRateChartProps {
  data: UtilizationData[];
}

const UtilizationRateChart: React.FC<UtilizationRateChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Taux d'utilisation par catégorie</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="category" />
              <YAxis tickFormatter={(value) => `${value}%`} />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Taux d\'utilisation']}
                labelFormatter={(label) => `Catégorie: ${label}`}
              />
              <Bar dataKey="utilisationRate" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default UtilizationRateChart;
