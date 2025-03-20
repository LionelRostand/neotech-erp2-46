
import React from 'react';
import { PieChart } from 'lucide-react';
import { 
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  Tooltip
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface BooksByCategoryData {
  category: string;
  count: number;
}

interface BooksByCategoryChartProps {
  data: BooksByCategoryData[];
  colors: string[];
  chartConfig: any;
}

const BooksByCategoryChart: React.FC<BooksByCategoryChartProps> = ({ 
  data,
  colors,
  chartConfig
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          <span>Livres par Catégorie</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80">
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              dataKey="count"
              nameKey="category"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip content={<ChartTooltipContent />} />
          </RechartsPieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default BooksByCategoryChart;
