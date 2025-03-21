
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SeasonalTrend {
  month: string;
  reservations: number;
  actual: number;
  forecast: number;
}

interface SeasonalTrendsChartProps {
  data: SeasonalTrend[];
}

const SeasonalTrendsChart: React.FC<SeasonalTrendsChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendances saisonnières</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="actual" 
                name="Réservations actuelles" 
                stroke="#4f46e5" 
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="forecast" 
                name="Prévisions" 
                stroke="#10b981" 
                strokeDasharray="5 5"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeasonalTrendsChart;
