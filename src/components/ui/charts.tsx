
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const defaultOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
};

const pieOptions: ChartOptions<'pie'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const,
    },
  }
};

interface ChartProps {
  data: ChartData<any>;
  options?: ChartOptions<any>;
  height?: number;
}

export const LineChart: React.FC<ChartProps> = ({ data, options, height = 400 }) => {
  return (
    <div style={{ height: height }}>
      <Line 
        data={data}
        options={{ ...defaultOptions, ...options }}
      />
    </div>
  );
};

export const BarChart: React.FC<ChartProps> = ({ data, options, height = 400 }) => {
  return (
    <div style={{ height: height }}>
      <Bar 
        data={data}
        options={{ ...defaultOptions, ...options }}
      />
    </div>
  );
};

export const PieChart: React.FC<ChartProps> = ({ data, options, height = 400 }) => {
  return (
    <div style={{ height: height }}>
      <Pie 
        data={data}
        options={{ ...pieOptions, ...options }}
      />
    </div>
  );
};
