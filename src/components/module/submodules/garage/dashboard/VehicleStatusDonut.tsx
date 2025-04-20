
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface VehicleStatusDonutProps {
  ongoing: number;
  completed: number;
  totalVehicles: number;
}

const VehicleStatusDonut: React.FC<VehicleStatusDonutProps> = ({ 
  ongoing, 
  completed, 
  totalVehicles 
}) => {
  const waiting = totalVehicles - (ongoing + completed);

  const data = [
    { name: 'En cours', value: ongoing, color: '#F59E0B' },
    { name: 'Terminés', value: completed, color: '#10B981' },
    { name: 'En attente', value: waiting, color: '#6B7280' },
  ];

  const COLORS = ['#F59E0B', '#10B981', '#6B7280'];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: any) => [`${value} véhicules`, '']}
          contentStyle={{ borderRadius: '8px' }}
        />
        <Legend 
          verticalAlign="bottom" 
          align="center"
          layout="horizontal"
          iconType="circle"
          wrapperStyle={{ paddingTop: '20px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default VehicleStatusDonut;
