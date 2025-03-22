
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sample data for the revenue chart
const data = [
  { month: 'Jan', revenue: 18500 },
  { month: 'Fév', revenue: 20100 },
  { month: 'Mar', revenue: 23400 },
  { month: 'Avr', revenue: 21900 },
  { month: 'Mai', revenue: 25600 },
  { month: 'Juin', revenue: 28700 },
  { month: 'Juil', revenue: 27300 },
  { month: 'Août', revenue: 26100 },
  { month: 'Sep', revenue: 29400 },
  { month: 'Oct', revenue: 31200 },
  { month: 'Nov', revenue: 29700 },
  { month: 'Déc', revenue: 32450 },
];

export const RevenueChart = () => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
          <XAxis 
            dataKey="month" 
            className="text-xs"
            tick={{ fill: '#6B7280' }}
          />
          <YAxis 
            className="text-xs"
            tick={{ fill: '#6B7280' }}
            tickFormatter={(value) => `${value/1000}k€`}
          />
          <Tooltip 
            formatter={(value: any) => [`${value.toLocaleString('fr-FR')} €`, 'Revenu']} 
            labelFormatter={(label: string) => `Mois: ${label}`}
          />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="#2563EB" 
            fill="#3B82F6" 
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
