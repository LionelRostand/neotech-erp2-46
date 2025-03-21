
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface VehicleStatusDonutProps {
  available: number;
  rented: number;
  maintenance: number;
  reserved: number;
  inactive: number;
}

export const VehicleStatusDonut = ({
  available,
  rented,
  maintenance,
  reserved,
  inactive
}: VehicleStatusDonutProps) => {
  const data = [
    { name: 'Disponible', value: available, color: '#10b981' },
    { name: 'Loué', value: rented, color: '#6366f1' },
    { name: 'Maintenance', value: maintenance, color: '#f59e0b' },
    { name: 'Réservé', value: reserved, color: '#64748b' },
    { name: 'Inactif', value: inactive, color: '#e11d48' }
  ].filter(item => item.value > 0);

  const COLORS = data.map(item => item.color);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow-md rounded-md border">
          <p className="font-semibold" style={{ color: payload[0].payload.color }}>
            {payload[0].name}
          </p>
          <p className="text-gray-700">
            {payload[0].value} véhicules ({Math.round(payload[0].percent * 100)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return percent > 0.07 ? (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
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
          innerRadius={50}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend layout="vertical" verticalAlign="middle" align="right" />
      </PieChart>
    </ResponsiveContainer>
  );
};
