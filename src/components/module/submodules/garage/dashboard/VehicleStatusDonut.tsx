
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface VehicleStatusDonutProps {
  ongoing: number;
  completed: number;
  totalVehicles: number;
}

export const VehicleStatusDonut = ({ ongoing, completed, totalVehicles }: VehicleStatusDonutProps) => {
  // Calculate the number of vehicles not in repair
  const notInRepair = totalVehicles - (ongoing + completed);

  const data = [
    { name: 'En cours', value: ongoing, color: '#3B82F6' },
    { name: 'Terminées', value: completed, color: '#10B981' },
    { name: 'Sans réparation', value: notInRepair, color: '#E5E7EB' },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#E5E7EB'];

  const renderCustomizedLabel = ({ 
    cx, 
    cy, 
    midAngle, 
    innerRadius, 
    outerRadius, 
    percent, 
    index 
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          innerRadius={40}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: any) => [value, 'Véhicules']} />
        <Legend formatter={(value: string) => <span className="text-sm">{value}</span>} />
      </PieChart>
    </ResponsiveContainer>
  );
};
