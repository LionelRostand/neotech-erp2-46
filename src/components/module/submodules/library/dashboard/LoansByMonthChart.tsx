
import React from 'react';
import { BarChart } from 'lucide-react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface LoansByMonthData {
  month: string;
  loans: number;
  returns: number;
}

interface LoansByMonthChartProps {
  data: LoansByMonthData[];
  chartConfig: any;
}

const LoansByMonthChart: React.FC<LoansByMonthChartProps> = ({ 
  data,
  chartConfig
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5" />
          <span>Emprunts et Retours (6 derniers mois)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80">
          <RechartsBarChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <Bar dataKey="loans" name="loans" fill="var(--color-loans)" />
            <Bar dataKey="returns" name="returns" fill="var(--color-returns)" />
          </RechartsBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default LoansByMonthChart;
