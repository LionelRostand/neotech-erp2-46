
import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RevenueForecast {
  month: string;
  actual: number;
  forecast: number;
}

interface RevenueForecastChartProps {
  data: RevenueForecast[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
};

const RevenueForecastChart: React.FC<RevenueForecastChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prévisions de revenus</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${value / 1000}k€`} />
              <Tooltip formatter={(value) => [formatCurrency(value as number), '']} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="actual" 
                name="Revenus actuels" 
                stroke="#4f46e5"
                fill="#4f46e530"
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="forecast" 
                name="Prévisions" 
                stroke="#f59e0b"
                fill="#f59e0b30"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueForecastChart;
